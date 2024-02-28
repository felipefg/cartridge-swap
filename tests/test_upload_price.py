from app import upload_price


def test_should_count_blocks():
    assert upload_price._count_4k_blocks(1) == 1
    assert upload_price._count_4k_blocks(3000) == 1
    assert upload_price._count_4k_blocks(4096) == 1
    assert upload_price._count_4k_blocks(4097) == 2
    assert upload_price._count_4k_blocks(15000) == 4


def test_should_calculate_upload_price():
    assert upload_price.get_upload_price(5000, 100) == 108
