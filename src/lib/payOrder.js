import { connectWallet, ensureSepolia, sendPayment } from './metamask'
import { ordersApi } from '../api/orders'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// Verify with the backend; retry while the backend says the tx isn't confirmed yet.
async function verifyWithRetry(orderId, txHash, tries = 5, delayMs = 3000) {
  for (let i = 0; i < tries; i++) {
    try {
      return await ordersApi.verifyPayment(orderId, txHash)
    } catch (err) {
      const notYet = /not confirmed yet/i.test(err.message || '')
      if (!notYet || i === tries - 1) throw err
      await sleep(delayMs)
    }
  }
}

// Steps: connect wallet -> ensure Sepolia -> send tx (with payData) -> verify on backend.
// `order` must carry payTo, expectedWei and payData. Returns the updated (paid) order.
export async function payForOrder(order) {
  if (!order?.payTo || !order?.expectedWei || !order?.payData) {
    throw new Error('Payment details are missing for this order.')
  }
  await connectWallet()
  await ensureSepolia()
  const txHash = await sendPayment({ to: order.payTo, valueWei: order.expectedWei, data: order.payData })
  try {
    return await verifyWithRetry(order._id, txHash)
  } catch (err) {
    err.txHash = txHash
    err.afterSend = true
    throw err
  }
}

// Turns any payment error into { cancelled, message } for display.
export function describePaymentError(err) {
  const code = err?.code
  if (code === 4001 || code === 'ACTION_REJECTED' || err?.info?.error?.code === 4001) {
    return {
      cancelled: true,
      message: 'Payment cancelled. Your order is saved as unpaid; you can pay from My Orders.',
    }
  }
  if (code === 'INSUFFICIENT_FUNDS' || /insufficient funds/i.test(err?.message || '')) {
    return { cancelled: false, message: 'Insufficient Sepolia ETH in your wallet. Your order is saved as unpaid; top up and pay from My Orders.' }
  }
  if (err?.afterSend) {
    return {
      cancelled: false,
      message: `Payment was sent (tx ${err.txHash}) but could not be verified: ${err.message}`,
    }
  }
  if (code === 'NETWORK_ERROR' || code === 'TIMEOUT') {
    return { cancelled: false, message: 'Network error while paying. Please check your connection and try again.' }
  }
  return { cancelled: false, message: err?.shortMessage || err?.message || 'Payment failed. Please try again.' }
}
