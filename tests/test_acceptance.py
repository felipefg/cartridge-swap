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

from app.cartridge import InsertCartridgePayload

import logging
logger = logging.getLogger(__name__)

USDC_UNIT = int(1e6)
ERC20_PORTAL_ADDRESS = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB"
ERC20_USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"


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

    breakout_id = (
        '92d813d07db2607710ffd9b12a737a80c3e682f34119b7f4e0e2890c4b300672'
    )
    path = f'app/cartridge_info?id={breakout_id}'
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
        amount=10 * USDC_UNIT,
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
    assert report['erc20'].get(ERC20_USDC_ADDRESS.lower()) == 10 * USDC_UNIT
