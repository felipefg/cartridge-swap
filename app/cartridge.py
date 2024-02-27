import os
from pydantic import BaseModel
import logging
from hashlib import sha256
from typing import Optional, List
import tempfile
import json
import base64

from cartesi.abi import String, Bytes, Bytes32, UInt, UInt128

from cartesapp.storage import Entity, helpers, seed
from cartesapp.context import get_metadata
from cartesapp.input import query, mutation
from cartesapp.output import event, output, add_output, emit_event, contract_call
from cartesapp.wallet import dapp_wallet

from .riv import riv_get_cartridge_info, riv_get_cartridge_screenshot, riv_get_cartridges_path, riv_get_cover, riv_get_cartridge_outcard, replay_log
from .settings import AppSettings
from .bonding_curve import get_prices

LOGGER = logging.getLogger(__name__)
USDC_UNIT = int(1e6)
ERC20_TOKEN_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"

###
# Model

# TODO: TypeError: unhashable type: 'ABIType' allow python cartesi types
class Cartridge(Entity):
    id              = helpers.PrimaryKey(str, 64)
    name            = helpers.Required(str, index=True, unique=True)
    user_address    = helpers.Required(str, 42)
    info            = helpers.Optional(helpers.Json, lazy=True)
    created_at      = helpers.Required(int)
    cover           = helpers.Optional(bytes, lazy=True)
    base_price      = helpers.Required(int)
    initial_supply  = helpers.Required(int)
    smoothing_factor= helpers.Required(int)
    exponent        = helpers.Required(int)
    cartridge_owners= helpers.Set('CartridgeUser')


class CartridgeUser(Entity):
    id              = helpers.PrimaryKey(int, auto=True)
    cartridge       = helpers.Required(Cartridge)
    user_address    = helpers.Required(str, 42)


# Inputs


class InsertCartridgePayload(BaseModel):
    base_price: UInt128
    initial_supply: UInt128
    smoothing_factor: UInt128
    exponent: UInt128
    data: Bytes


class RemoveCartridgePayload(BaseModel):
    id: Bytes32


class BuyCartridgePayload(BaseModel):
    id: Bytes32


class CartridgePayload(BaseModel):
    id: String
    owner: Optional[str]

# TODO: TypeError: unhashable type: 'ABIType' allow python cartesi types
class CartridgesPayload(BaseModel):
    name:       Optional[str]
    tags:       Optional[List[str]]
    page:       Optional[int]
    page_size:  Optional[int]
    owner:      Optional[str]


# Outputs

@event()
class CartridgeInserted(BaseModel):
    cartridge_id:   String
    user_address:   String
    timestamp:      UInt

@event()
class CartridgeRemoved(BaseModel):
    cartridge_id:   String
    timestamp:      UInt

class Author(BaseModel):
    name:           str
    link:           str

class Info(BaseModel):
    name:           str
    summary:        Optional[str]
    description:    Optional[str]
    version:        Optional[str]
    status:         Optional[str]
    tags:           List[str]
    authors:        Optional[List[Author]]
    url:            Optional[str]

@output()
class CartridgeInfo(BaseModel):
    id: String
    name: String
    user_address: String
    info: Optional[Info]
    created_at: UInt
    cover: Optional[str] # encode to base64
    base_price: UInt128
    initial_supply: UInt128
    smoothing_factor: UInt128
    exponent: UInt128
    sell_price: UInt128
    buy_price: UInt128
    total_supply: UInt128
    owned_copies: Optional[UInt128]

@output()
class CartridgesOutput(BaseModel):
    data:   List[CartridgeInfo]
    total:  UInt
    page:   UInt


###
# Seed data


@seed()
def initialize_data():
    try:
        cartridge_example_file = open('misc/snake.sqfs', 'rb')
        cartridge_example_data = cartridge_example_file.read()
        cartridge_example_file.close()
        cartridge_payload = InsertCartridgePayload(
            base_price=10 * USDC_UNIT,
            initial_supply=1000,
            smoothing_factor=50,
            exponent=1500,
            data=cartridge_example_data
        )
        create_cartridge(
            cartridge_payload,
            msg_sender="0xAf1577F6A113da0bc671a59D247528811501cF94"
        )
        if AppSettings.rivemu_path is None:
            os.remove('misc/snake.sqfs')
    except Exception as e:
        LOGGER.warning(e)

    # try:
    #     cartridge_example_file = open('misc/freedoom.sqfs', 'rb')
    #     cartridge_example_data = cartridge_example_file.read()
    #     cartridge_example_file.close()
    #     cartridge_payload = InsertCartridgePayload(
    #         base_price=10,
    #         initial_supply=1000,
    #         smoothing_factor=50,
    #         exponent=1500,
    #         data=cartridge_example_data
    #     )
    #     create_cartridge(
    #         cartridge_payload,
    #         msg_sender="0xAf1577F6A113da0bc671a59D247528811501cF94"
    #     )
    #     if AppSettings.rivemu_path is None:
    #         os.remove('misc/freedoom.sqfs')
    # except Exception as e:
    #     LOGGER.warning(e)

    try:
        cartridge_example_file = open('misc/antcopter.sqfs', 'rb')
        cartridge_example_data = cartridge_example_file.read()
        cartridge_payload = InsertCartridgePayload(
            base_price=30 * USDC_UNIT,
            initial_supply=1000,
            smoothing_factor=50,
            exponent=1500,
            data=cartridge_example_data
        )
        create_cartridge(
            cartridge_payload,
            msg_sender="0xAf1577F6A113da0bc671a59D247528811501cF94"
        )
        if AppSettings.rivemu_path is None:
            os.remove('misc/antcopter.sqfs')
    except Exception as e:
        LOGGER.warning(e)

    try:
        cartridge_example_file = open('misc/monky.sqfs', 'rb')
        cartridge_example_data = cartridge_example_file.read()
        cartridge_payload = InsertCartridgePayload(
            base_price=25 * USDC_UNIT,
            initial_supply=1000,
            smoothing_factor=50,
            exponent=1500,
            data=cartridge_example_data
        )
        create_cartridge(
            cartridge_payload,
            msg_sender="0xAf1577F6A113da0bc671a59D247528811501cF94"
        )
        if AppSettings.rivemu_path is None:
            os.remove('misc/monky.sqfs')
    except Exception as e:
        LOGGER.warning(e)

    try:
        cartridge_example_file = open('misc/2048.sqfs', 'rb')
        cartridge_example_data = cartridge_example_file.read()
        cartridge_payload = InsertCartridgePayload(
            base_price=15 * USDC_UNIT,
            initial_supply=1000,
            smoothing_factor=50,
            exponent=1500,
            data=cartridge_example_data
        )
        create_cartridge(
            cartridge_payload,
            msg_sender="0xAf1577F6A113da0bc671a59D247528811501cF94"
        )
        if AppSettings.rivemu_path is None:
            os.remove('misc/2048.sqfs')
    except Exception as e:
        LOGGER.warning(e)

###
# Mutations

@mutation()
def insert_cartridge(payload: InsertCartridgePayload) -> bool:
    metadata = get_metadata()

    LOGGER.info("Saving cartridge...")
    try:
        cartridge_id = create_cartridge(payload,**get_metadata().dict())
    except Exception as e:
        msg = f"Couldn't insert cartridge: {e}"
        LOGGER.error(msg)
        add_output(msg,tags=['error'])
        return False

    cartridge_event = CartridgeInserted(
        cartridge_id = cartridge_id,
        user_address = metadata.msg_sender,
        timestamp = metadata.timestamp
    )
    out_tags = ['cartridge','insert_cartridge',cartridge_id]
    # add_output(payload.data,tags=out_tags)
    emit_event(cartridge_event,tags=out_tags)

    return True

@mutation()
def remove_cartridge(payload: RemoveCartridgePayload) -> bool:
    metadata = get_metadata()

    LOGGER.info("Removing cartridge...")
    try:
        delete_cartridge(payload.id.hex(),**get_metadata().dict())
    except Exception as e:
        msg = f"Couldn't remove cartridge: {e}"
        LOGGER.error(msg)
        add_output(msg,tags=['error'])
        return False

    cartridge_event = CartridgeRemoved(
        cartridge_id = payload.id.hex(),
        timestamp = metadata.timestamp
    )
    emit_event(cartridge_event,tags=['cartridge','remove_cartridge',payload.id.hex()])

    return True


def _get_erc20_balance(wallet_addr: str, contract_addr: str) -> int:
    entry = (
        helpers
        .select(e for e in dapp_wallet.Erc20
                if e.address == contract_addr.lower()
                and e.wallet.owner == wallet_addr.lower())
        .first()
    )

    if entry is None:
        return 0

    amount_str = entry.amount
    if amount_str.startswith('0x'):
        amount_str = amount_str[2:]
    amount = int(amount_str, 16)
    return amount


@mutation()
def buy_cartridge(payload: BuyCartridgePayload) -> bool:
    metadata = get_metadata()
    buyer = metadata.msg_sender
    cartridge_id = payload.id.hex()
    LOGGER.info('User %s wants to buy cartridge %s', buyer, cartridge_id)

    # Get cartridge
    cartridge = (
        helpers.select(c for c in Cartridge if c.id == cartridge_id)
        .first()
    )

    if cartridge is None:
        msg = f'Cartridge {cartridge_id} not found. Refusing tx'
        LOGGER.info(msg)
        add_output(msg, tags=['error'])
        return False

    sell, buy, supply = get_prices_supply_for_cartridge(cartridge)

    if buy == 0:
        msg = f'Cartridge {cartridge_id} has zero buy price. Refusing tx'
        LOGGER.info(msg)
        add_output(msg, tags=['error'])
        return False

    balance = _get_erc20_balance(buyer.lower(), ERC20_TOKEN_ADDRESS)

    if balance < buy:
        msg = (
            f'User ({buyer.lower()}) balance ({balance}) is lower than buy '
            f'price ({buy}) for cartridge {cartridge.name} ({cartridge_id}). '
            'Refusing tx.'
        )
        LOGGER.info(msg)
        add_output(msg, tags=['error'])
        return False

    LOGGER.debug('User balance=%i buy=%i', balance, buy)

    # TODO: Properly split between game developer and foundation
    dapp_wallet.transfer_erc20(
        token=ERC20_TOKEN_ADDRESS,
        sender=buyer,
        receiver=cartridge.user_address,
        amount=buy)

    cartridge.cartridge_owners.create(user_address=buyer.lower())

    return True

###
# Queries

@query(splittable_output=True)
def cartridge(payload: CartridgePayload) -> bool:
    query = helpers.select(c for c in Cartridge if c.id == payload.id)

    cartridge_data = b''
    if query.count() > 0:
        cartridge_file = open(f"{riv_get_cartridges_path()}/{payload.id}",'rb')
        cartridge_data = cartridge_file.read()

    add_output(cartridge_data)

    LOGGER.info(f"Returning cartridge {payload.id} with {len(cartridge_data)} bytes")

    return True

@query()
def cartridge_info(payload: CartridgePayload) -> bool:
    cartridge = helpers.select(c for c in Cartridge if c.id == payload.id).first()

    if cartridge is not None:
        cartridge_dict = cartridge.to_dict(with_lazy=True)
        cartridge_dict['cover'] = base64.b64encode(cartridge_dict['cover'])

        sell, buy, total_supply = get_prices_supply_for_cartridge(cartridge)
        cartridge_dict['sell_price'] = sell
        cartridge_dict['buy_price'] = buy
        cartridge_dict['total_supply'] = total_supply

        if payload.owner:
            cartridge_dict['owned_copies'] = (
                cartridge.cartridge_owners
                .select(lambda co: co.user_address == payload.owner.lower())
                .count()
            )

        out = CartridgeInfo.parse_obj(cartridge_dict)
        add_output(out)
    else:
        add_output("null")

    LOGGER.info(f"Returning cartridge {payload.id} info")

    return True

@query()
def cartridges(payload: CartridgesPayload) -> bool:
    cartridges_query = Cartridge.select()

    if payload.name is not None:
        cartridges_query = cartridges_query.filter(lambda c: payload.name in c.name)

    if payload.tags is not None and len(payload.tags) > 0:
        for tag in payload.tags:
            cartridges_query = cartridges_query.filter(lambda c: tag in c.info['tags'])
    
    total = cartridges_query.count()

    page = 1
    if payload.page is not None:
        page = payload.page
        if payload.page_size is not None:
            cartridges = cartridges_query.page(payload.page,payload.page_size)
        else:
            cartridges = cartridges_query.page(payload.page)
    else:
        cartridges = cartridges_query.fetch()
    

    dict_list_result = []
    for cartridge in cartridges:
        cartridge_dict = cartridge.to_dict(with_lazy=True)
        cartridge_dict['cover'] = base64.b64encode(cartridge_dict['cover'])

        sell, buy, total_supply = get_prices_supply_for_cartridge(cartridge)
        cartridge_dict['sell_price'] = sell
        cartridge_dict['buy_price'] = buy
        cartridge_dict['total_supply'] = total_supply
        if payload.owner:
            cartridge_dict['owned_copies'] = (
                cartridge.cartridge_owners
                .select(lambda co: co.user_address == payload.owner.lower())
                .count()
            )

        dict_list_result.append(cartridge_dict)

    LOGGER.info(f"Returning {len(dict_list_result)} of {total} cartridges")
    
    out = CartridgesOutput.parse_obj({'data':dict_list_result,'total':total,'page':page})
    
    add_output(out)

    return True


###
# Helpers

def generate_cartridge_id(bin_data: bytes) -> str:
    return sha256(bin_data).hexdigest()


def create_cartridge(cartridge_payload, **metadata):
    cartridge_data = cartridge_payload.data
    data_hash = generate_cartridge_id(cartridge_data)

    if helpers.count(c for c in Cartridge if c.id == data_hash) > 0:
        raise Exception("Cartridge already exists")

    cartridges_path = riv_get_cartridges_path()
    LOGGER.info(f"Got {cartridges_path=}")
    if not os.path.exists(cartridges_path):
        os.makedirs(cartridges_path)
    LOGGER.info(f"Will write cartridge to {cartridges_path}/{data_hash}")
    cartridge_file = open(f"{cartridges_path}/{data_hash}", 'wb')
    cartridge_file.write(cartridge_data)
    cartridge_file.close()

    cartridge_info = riv_get_cartridge_info(data_hash)

    # validate info
    cartridge_info_json = json.loads(cartridge_info)
    Info(**cartridge_info_json)

    # check if cartridge runs
    test_replay_file = open('misc/test.rivlog', 'rb')
    test_replay = test_replay_file.read()
    test_replay_file.close()
    # TODO: allow one of theses tests
    outcard_raw, outhash, screenshot = replay_log(data_hash,test_replay,'',b'')

    LOGGER.info("So far so good")
    cartridge_cover = riv_get_cover(data_hash)
    if cartridge_cover is None or len(cartridge_cover) == 0:
        cartridge_cover = screenshot

    user_address = metadata.get('msg_sender')
    if user_address is not None: user_address = user_address.lower()
    c = Cartridge(
        id=data_hash,
        name=cartridge_info_json['name'],
        user_address=user_address,
        created_at=metadata.get('timestamp') or 0,
        info=cartridge_info_json,
        cover=cartridge_cover,
        base_price=cartridge_payload.base_price,
        initial_supply=cartridge_payload.initial_supply,
        smoothing_factor=cartridge_payload.smoothing_factor,
        exponent=cartridge_payload.exponent
    )

    LOGGER.info(c)

    return data_hash


def delete_cartridge(cartridge_id,**metadata):
    cartridge = Cartridge.get(lambda c: c.id == cartridge_id)
    if cartridge is None:
        raise Exception(f"Cartridge doesn't exist")

    if cartridge.user_address != metadata['msg_sender'].lower():
        raise Exception(f"Sender not allowed")

    cartridge.delete()
    os.remove(f"{riv_get_cartridges_path()}/{cartridge_id}")


def get_prices_supply_for_cartridge(cartridge: Cartridge):
    """
    Get prices and current supply for the given cartridge.
    """
    total_supply = cartridge.cartridge_owners.count()
    sell, buy = get_prices(
        cartridge.base_price,
        total_supply=total_supply,
        initial_supply=cartridge.initial_supply,
        int_smoothing=cartridge.smoothing_factor,
        int_exponent=cartridge.exponent,
    )

    return sell, buy, total_supply
