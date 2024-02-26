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

    with open('misc/2048.sqfs', 'rb') as fin:
        cartridge_data = fin.read()

    model = InsertCartridgePayload(
        base_price=100,
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
    assert len(report['data']) == 4
    assert report['data'][3]['name'] == '2048'
