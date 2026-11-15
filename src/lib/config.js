// Fixed demo rate: Sepolia ETH has no real price. Keep in sync with PKR_PER_ETH in the backend .env.
export const PKR_PER_ETH = 800000

export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7'

export const etherscanTxUrl = (hash) => `https://sepolia.etherscan.io/tx/${hash}`

export const shortAddress = (addr) =>
  addr && addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr || ''

export const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/
