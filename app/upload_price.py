"""
Functions for calculating upload price of a cartridge
"""
import math

PRICE_PER_4K_BLOCK = 4.0
PRICE_PER_LICENSE = 1.0


def get_upload_price(cartridge_bytes: int, initial_supply: int) -> float:
    """
    Calculate the price of the upload, as a float
    """
    n_blocks = _count_4k_blocks(cartridge_bytes)
    price = PRICE_PER_4K_BLOCK * n_blocks + PRICE_PER_LICENSE * initial_supply
    return price


def _count_4k_blocks(size):
    return int(math.ceil(size/4096))
