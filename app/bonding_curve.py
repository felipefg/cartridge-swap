"""
Bonding curve functions and price calculations
"""
import math


def polynomial(
        base_price: float,
        total_supply: float,
        initial_supply: float,
        smoothing: float,
        exponent: float) -> int:
    """
    Return the price for piecewise polynomial function.

    The parameters are assumed to be floats in their final value.
    """
    if total_supply < initial_supply:
        return int(base_price)

    x = total_supply - initial_supply
    return int(base_price + math.pow(x, exponent)/smoothing)


def get_prices(
        int_base_price: int,
        total_supply: int,
        initial_supply: int,
        int_smoothing: int,
        int_exponent: int,
        decimals: int = 6,
        total_fees: float = 0.1) -> int:
    """
    Return Sell and Buy prices given the parameters.

    The parameters are expected to be in integers, as needed for representing
    on chain.
    """
    base_price = int_base_price / 10**decimals

    smoothing = float(int_smoothing)
    exponent = float(int_exponent) / 1000.0

    sell_price = polynomial(
        base_price=base_price,
        total_supply=total_supply,
        initial_supply=initial_supply,
        smoothing=smoothing,
        exponent=exponent
    )

    if total_supply <= initial_supply:
        # Below the initial_supply, all the revenue goes to the creator, and no
        # one can sell
        buy_price = sell_price
        sell_price = 0
        final_sell_price = 0
    else:
        # After initial_supply, buy price is marked up by the fee
        buy_price = (1 + total_fees) * sell_price

    final_sell_price = int(sell_price * (10 ** decimals))
    final_buy_price = int(buy_price * (10 ** decimals))

    return final_sell_price, final_buy_price
