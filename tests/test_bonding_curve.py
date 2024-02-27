from app import bonding_curve

USDC_UNIT = 10**6


def test_poly_should_return_base_below_initial_supply():
    base_price = 10

    price = bonding_curve.polynomial(
        base_price=base_price,
        total_supply=10,
        initial_supply=1000,
        smoothing=5000,
        exponent=2
    )

    assert isinstance(price, int)
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

    assert isinstance(price, int)
    assert price > base_price


def test_usdc_prices_below_initial_supply():
    base_price = int(10 * USDC_UNIT)
    smoothing = 5000
    exponent = 2000

    sell, buy = bonding_curve.get_prices(
        int_base_price=base_price,
        total_supply=10,
        initial_supply=1000,
        int_smoothing=smoothing,
        int_exponent=exponent,
        decimals=6,
        total_fees=0.1
    )

    assert isinstance(sell, int)
    assert isinstance(buy, int)
    assert sell == 0
    assert buy == base_price


def test_usdc_prices_above_initial_supply():
    base_price = int(10 * USDC_UNIT)
    smoothing = 5000
    exponent = 2000

    sell, buy = bonding_curve.get_prices(
        int_base_price=base_price,
        total_supply=5000,
        initial_supply=1000,
        int_smoothing=smoothing,
        int_exponent=exponent,
        decimals=6,
        total_fees=0.1
    )

    assert isinstance(sell, int)
    assert isinstance(buy, int)
    assert buy > base_price
    assert sell < buy
