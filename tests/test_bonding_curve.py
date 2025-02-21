from app import bonding_curve

TOKEN_DECIMALS = 10**6


def test_poly_should_return_base_below_initial_supply():
    base_price = 10

    price = bonding_curve.polynomial(
        base_price=base_price,
        total_supply=10,
        initial_supply=1000,
        smoothing=5000,
        exponent=2
    )

    assert price == base_price


def test_poly_should_be_high_after_initial_supply():
    base_price = 10

    price = bonding_curve.polynomial(
        base_price=base_price,
        total_supply=5000,
        initial_supply=1000,
        smoothing=5000,
        exponent=2
    )

    assert price > base_price


def test_usdc_prices_below_initial_supply():
    base_price = int(10 * TOKEN_DECIMALS)
    smoothing = 5000
    exponent = 2000

    sell, buy, fees = bonding_curve.get_prices(
        int_base_price=base_price,
        total_supply=10,
        initial_supply=1000,
        int_smoothing=smoothing,
        int_exponent=exponent,
        int_decimals=6,
        fees=[0.1, 0.025],
    )

    assert isinstance(sell, int)
    assert isinstance(buy, int)
    assert isinstance(fees, list)
    assert sell == 0
    assert buy == base_price


def test_usdc_prices_above_initial_supply():
    base_price = int(10 * TOKEN_DECIMALS)
    smoothing = 5000
    exponent = 2000

    sell, buy, fees = bonding_curve.get_prices(
        int_base_price=base_price,
        total_supply=5000,
        initial_supply=1000,
        int_smoothing=smoothing,
        int_exponent=exponent,
        int_decimals=6,
        fees=[0.1, 0.025],
    )

    assert isinstance(sell, int)
    assert isinstance(buy, int)
    assert isinstance(fees, list)
    assert buy > base_price
    assert sell < buy
