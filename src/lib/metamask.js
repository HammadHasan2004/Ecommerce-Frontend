import { BrowserProvider } from 'ethers'
import { SEPOLIA_CHAIN_ID_HEX } from './config'

export const hasMetaMask = () => typeof window !== 'undefined' && !!window.ethereum

export async function connectWallet() {
  if (!hasMetaMask()) throw new Error('MetaMask not found. Please install the MetaMask extension.')
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  return accounts[0]
}

export async function ensureSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    })
  } catch (err) {
    // 4902 = chain not added to this wallet yet
    if (err?.code === 4902 || err?.data?.originalError?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: 'Sepolia',
          rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
          nativeCurrency: { name: 'SepoliaETH', symbol: 'SepoliaETH', decimals: 18 },
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        }],
      })
    } else {
      throw err
    }
  }
}

// Sends the transfer, waits for it to be mined, and returns the tx hash.
export async function sendPayment({ to, valueWei, data }) {
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const tx = await signer.sendTransaction({ to, value: BigInt(valueWei), data })
  try {
    await tx.wait()
  } catch (err) {
    err.txHash = tx.hash
    throw err
  }
  return tx.hash
}
