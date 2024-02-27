"""
Acceptance tests for the application requirements.
"""
import json

import pytest

from cartesapp.manager import Manager
from cartesi.testclient import TestClient
from cartesi.abi import encode_model
from cartesi.models import ABIFunctionSelectorHeader

from app.cartridge import InsertCartridgePayload

import logging
logger = logging.getLogger(__name__)

USDC_UNIT = int(1e6)


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
    assert isinstance(cartrigde_info['total_sold'], int)
