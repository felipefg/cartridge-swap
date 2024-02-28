"""
Bonding curve functions and price calculations
"""
import math


def polynomial(
        base_price: float,
        total_supply: float,
        initial_supply: float,
        smoothing: float,
        exponent: float) -> float:
    """
    Return the price for piecewise polynomial function.

    The parameters are assumed to be floats in their final value.
    """
    if total_supply < initial_supply:
        return int(base_price)

    x = total_supply - initial_supply
    x_d = math.pow(x, exponent)
    p = base_price + x_d/smoothing
    return p


def get_prices(
        int_base_price: int,
        total_supply: int,
        initial_supply: int,
        int_smoothing: int,
        int_exponent: int,
        int_decimals: int = 6,
        round_decimals: int = 2,
        total_fees: float = 0.1) -> int:
    """
    Return Sell and Buy prices given the parameters.

    The parameters are expected to be in integers, as needed for representing
    on chain.
    """
    base_price = int_base_price / 10**int_decimals

    smoothing = float(int_smoothing)
    exponent = float(int_exponent) / 1000.0

    sell_price = polynomial(
        base_price=base_price,
        total_supply=total_supply,
        initial_supply=initial_supply,
        smoothing=smoothing,
        exponent=exponent
    )

    if total_supply < initial_supply:
        # Below the initial_supply, all the revenue goes to the creator, and no
        # one can sell
        buy_price = sell_price
        sell_price = 0
        final_sell_price = 0
    else:
        # After initial_supply, buy price is marked up by the fee
        buy_price = (1 + total_fees) * sell_price

    sell_price = _round_decimal(sell_price, decimal_places=round_decimals)
    buy_price = _round_decimal(buy_price, decimal_places=round_decimals)

    final_sell_price = int(round(sell_price * (10 ** int_decimals)))
    final_buy_price = int(round(buy_price * (10 ** int_decimals)))

    return final_sell_price, final_buy_price


def _round_decimal(orig: float, decimal_places: int = 2) -> float:

    factor = 10**decimal_places
    final = round(orig*factor) / factor
    return final
