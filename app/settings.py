# App Framework settings

# Files with definitions to import
FILES = ['setup','cartridge','replay','scoreboard'] # * Required

# Index outputs in inspect indexer queries
INDEX_OUTPUTS = True # Defaul: False

ENABLE_DAPP_RELAY = True # Defaul: False

ENABLE_WALLET = True # Defaul: False (required to set ENABLE_DAPP_RELAY)

STORAGE_PATH = None

class AppSettings:
    rivemu_path = None
    cartridges_path = "cartridges"
    scoreboard_ttl = 7776000 # 90 days
    token_addr = None
    protocol_addr = '0x0000000000000000000000000000000000000000'
    treasury_addr = '0xffffffffffffffffffffffffffffffffffffffff'
    developer_fee = 0.1
    treasury_fee = 0.025
    token_decimals = 6
