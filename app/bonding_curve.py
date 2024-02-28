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
        round_decimals: int = 4,
        fees: list[float] = []) -> int:
    """
    Return Sell and Buy prices given the parameters.

    The parameters are expected to be in integers, as needed for representing
    on chain.
    """
    base_price = int_base_price / 10**int_decimals

    smoothing = float(int_smoothing)
    exponent = float(int_exponent) / 1000.0

    buy_price = polynomial(
        base_price=base_price,
        total_supply=total_supply,
        initial_supply=initial_supply,
        smoothing=smoothing,
        exponent=exponent
    )

    sell_price = polynomial(
        base_price=base_price,
        total_supply=total_supply - 1,
        initial_supply=initial_supply,
        smoothing=smoothing,
        exponent=exponent
    )
    buy_price = _round_decimal(buy_price, decimal_places=round_decimals)
    if total_supply >= initial_supply:
        rounded_fees = [
            _round_decimal(x * buy_price, decimal_places=round_decimals)
            for x in fees
        ]
        buy_price = buy_price + sum(rounded_fees)
    else:
        rounded_fees = [0 for x in fees]

    if total_supply <= initial_supply:
        # Below the initial_supply, all the revenue goes to the creator, and no
        # one can sell
        sell_price = 0

    sell_price = _round_decimal(sell_price, decimal_places=round_decimals)

    final_sell_price = int(round(sell_price * (10 ** int_decimals)))
    final_buy_price = int(round(buy_price * (10 ** int_decimals)))
    final_fees = [int(round(x * (10 ** int_decimals))) for x in rounded_fees]

    return final_sell_price, final_buy_price, final_fees


def _round_decimal(orig: float, decimal_places: int = 2) -> float:

    factor = 10**decimal_places
    final = round(orig*factor) / factor
    return final
