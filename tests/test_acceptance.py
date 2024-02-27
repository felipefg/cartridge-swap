"""
Acceptance tests for the application requirements.
"""
import json

import pytest

from cartesapp.manager import Manager
from cartesapp.wallet.dapp_wallet import DepositErc20Payload

from cartesi.testclient import TestClient
from cartesi.abi import encode_model
from cartesi.models import ABIFunctionSelectorHeader

from app.cartridge import InsertCartridgePayload, BuyCartridgePayload

import logging
logger = logging.getLogger(__name__)

USDC_UNIT = int(1e6)
ERC20_PORTAL_ADDRESS = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB"
ERC20_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
USER2_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
BREAKOUT_ID = (
    "92d813d07db2607710ffd9b12a737a80c3e682f34119b7f4e0e2890c4b300672"
)


@pytest.fixture(scope='session')
def dapp_client() -> TestClient:
    # Mimics the run command to set up the manager
    m = Manager()
    m.add_module('app')
    m.setup_manager()
    client = TestClient(m.dapp)
    return client


@pytest.fixture()
def insert_cartridge_payload() -> bytes:

    with open('misc/breakout.sqfs', 'rb') as fin:
        cartridge_data = fin.read()

    model = InsertCartridgePayload(
        base_price=50 * USDC_UNIT,
        initial_supply=1000,
        smoothing_factor=30,
        exponent=150,
        data=cartridge_data
    )

    return encode_model(model, packed=False)


def test_should_insert_cartridge(
        dapp_client: TestClient,
        insert_cartridge_payload: bytes):

    header = ABIFunctionSelectorHeader(
        function="app.insert_cartridge",
        argument_types=['uint128', 'uint128', 'uint128', 'uint128', 'bytes']
    ).to_bytes()

    hex_payload = '0x' + (header + insert_cartridge_payload).hex()
    dapp_client.send_advance(hex_payload=hex_payload)

    assert dapp_client.rollup.status


@pytest.mark.order(after="test_should_insert_cartridge")
def test_should_list_new_cartridge(dapp_client: TestClient):
    path = 'app/cartridges'
    inspect_payload = '0x' + path.encode('ascii').hex()

    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)
    assert isinstance(report.get('data'), list)
    assert len(report['data']) > 0
    cartrigde_info = report['data'][-1]
    assert cartrigde_info['name'] == 'Breakout'

    # Listing should have model details and pricing
    assert isinstance(cartrigde_info['base_price'], int)
    assert isinstance(cartrigde_info['initial_supply'], int)
    assert isinstance(cartrigde_info['smoothing_factor'], int)
    assert isinstance(cartrigde_info['exponent'], int)
    assert isinstance(cartrigde_info['sell_price'], int)
    assert isinstance(cartrigde_info['buy_price'], int)
    assert isinstance(cartrigde_info['total_supply'], int)


@pytest.mark.order(after="test_should_insert_cartridge")
def test_should_retrieve_cartridge_metadata(dapp_client: TestClient):

    path = f'app/cartridge_info?id={BREAKOUT_ID}'
    inspect_payload = '0x' + path.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)

    assert isinstance(report['base_price'], int)
    assert isinstance(report['initial_supply'], int)
    assert isinstance(report['smoothing_factor'], int)
    assert isinstance(report['exponent'], int)
    assert isinstance(report['sell_price'], int)
    assert isinstance(report['buy_price'], int)
    assert isinstance(report['total_supply'], int)


@pytest.mark.order(after="test_should_insert_cartridge")
def test_should_deposit_to_wallet(dapp_client: TestClient):
    # generate erc20 portal payload
    deposit = DepositErc20Payload(
        result=True,
        token=ERC20_USDC_ADDRESS,
        sender=USER_ADDRESS,
        amount=1000 * USDC_UNIT,
        execLayerData=b'',
    )
    hex_payload = '0x' + encode_model(deposit, packed=True).hex()

    # Send deposit
    dapp_client.send_advance(
        hex_payload=hex_payload,
        msg_sender=ERC20_PORTAL_ADDRESS,
    )

    assert dapp_client.rollup.status

    # Query inspect
    path = f'wallet/balance/{USER_ADDRESS}'
    inspect_payload = '0x' + path.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)

    assert isinstance(report.get('erc20'), dict)
    assert report['erc20'].get(ERC20_USDC_ADDRESS.lower()) == 1000 * USDC_UNIT


@pytest.fixture()
def buy_breakout_cartridge_payload() -> str:
    model = BuyCartridgePayload(id=bytes.fromhex(BREAKOUT_ID))
    model_bytes = encode_model(model, packed=False)

    header = ABIFunctionSelectorHeader(
        function="app.buy_cartridge",
        argument_types=['bytes32']
    ).to_bytes()

    return '0x' + (header + model_bytes).hex()


@pytest.fixture()
def buy_bogus_cartridge_payload() -> str:
    model = BuyCartridgePayload(id=bytes.fromhex("00"*32))
    model_bytes = encode_model(model, packed=False)

    header = ABIFunctionSelectorHeader(
        function="app.buy_cartridge",
        argument_types=['bytes32']
    ).to_bytes()

    return '0x' + (header + model_bytes).hex()


@pytest.mark.order(after="test_should_deposit_to_wallet")
def test_should_buy_cartridge(
        dapp_client: TestClient,
        buy_breakout_cartridge_payload: str):
    """
    GIVEN The user has enough funds in his wallet
    WHEN The user tries to buy Breakout
    THEN The order succeeds
    """
    # Send deposit
    dapp_client.send_advance(
        hex_payload=buy_breakout_cartridge_payload,
        msg_sender=USER_ADDRESS,
    )

    assert dapp_client.rollup.status


@pytest.mark.order(after="test_should_deposit_to_wallet")
def test_should_fail_purchase_cartridge_no_funds(
        dapp_client: TestClient,
        buy_breakout_cartridge_payload: str):
    """
    GIVEN The user does NOT have enough funds in his wallet
    WHEN The user tries to buy Breakout
    THEN The order is rejected
    """
    # Send deposit
    dapp_client.send_advance(
        hex_payload=buy_breakout_cartridge_payload,
        msg_sender=USER2_ADDRESS,
    )

    assert not dapp_client.rollup.status


@pytest.mark.order(after="test_should_deposit_to_wallet")
def test_should_fail_purchase_of_bogus_cartridge(
        dapp_client: TestClient,
        buy_bogus_cartridge_payload: str):
    """
    GIVEN The user has enough funds in his wallet
    WHEN The user tries to buy an invalid cartridge
    THEN The order is rejected
    """
    # Send deposit
    dapp_client.send_advance(
        hex_payload=buy_bogus_cartridge_payload,
        msg_sender=USER_ADDRESS,
    )

    assert not dapp_client.rollup.status


@pytest.mark.order(after="test_should_buy_cartridge")
def test_should_buy_second_cartridge(
        dapp_client: TestClient,
        buy_breakout_cartridge_payload: str):
    """
    GIVEN The user has enough funds in his wallet
      AND The user already owns Breakout
    WHEN The user tries to buy Breakout
    THEN The order succeeds
    """
    # Send deposit
    dapp_client.send_advance(
        hex_payload=buy_breakout_cartridge_payload,
        msg_sender=USER_ADDRESS,
    )

    assert dapp_client.rollup.status
