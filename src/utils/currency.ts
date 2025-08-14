// Currency conversion utilities
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD'

let cachedRate: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function getUSDToINRRate(): Promise<number> {
  // Check cache first
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
    return cachedRate.rate
  }

  try {
    const response = await fetch(EXCHANGE_RATE_API)
    const data = await response.json()
    const rate = data.rates.INR || 83.5 // Fallback rate
    
    // Cache the rate
    cachedRate = { rate, timestamp: Date.now() }
    return rate
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    return 83.5 // Fallback rate (approximate USD to INR)
  }
}

export function formatCurrency(amount: number, currency: 'USD' | 'INR'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
}

export async function convertUSDToINR(usdAmount: number): Promise<number> {
  const rate = await getUSDToINRRate()
  return Math.round(usdAmount * rate)
}

export function validateCurrency(currency: string): currency is 'USD' | 'INR' {
  return currency === 'USD' || currency === 'INR'
}