import os
from cartesapp.setup import setup
from .settings import AppSettings

DEFAULT_TOKEN_ADDR = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'


@setup()
def setup_rivemu():
    AppSettings.rivemu_path = os.getenv('RIVEMU_PATH')
    AppSettings.token_addr = os.getenv('TOKEN_ADDR', DEFAULT_TOKEN_ADDR)
    AppSettings.token_decimals = int(os.getenv('TOKEN_DECIMALS', '6'))
