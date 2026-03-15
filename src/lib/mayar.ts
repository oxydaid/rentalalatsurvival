interface CreateMayarPaymentParams {
  amount: number
  name: string
  email: string
  mobile: string
  description?: string
  redirectUrl?: string
}

interface MayarPaymentApiResponse {
  statusCode?: number
  messages?: string
  data?: {
    id?: string
    transaction_id?: string
    transactionId?: string
    link?: string
    url?: string
    amount?: number
  }
}

export async function createMayarPayment({ amount, name, email, mobile, description, redirectUrl }: CreateMayarPaymentParams) {
  const apiKey = process.env.MAYAR_API_KEY

  if (!apiKey) {
    throw new Error("Missing MAYAR_API_KEY")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount")
  }

  const isSandbox = apiKey.includes("club") || process.env.MAYAR_ENV === "sandbox";
  const baseUrl = isSandbox ? "https://api.mayar.club" : "https://api.mayar.id";
  const response = await fetch(`${baseUrl}/hl/v1/payment/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      name,
      email,
      mobile,
      description: description || "Payment for Booking",
      redirectUrl: redirectUrl || (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    }),
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as MayarPaymentApiResponse | null

  if (!response.ok) {
    throw new Error(payload?.messages || "Failed to create Mayar Payment")
  }

  const link = payload?.data?.link || payload?.data?.url

  if (!link) {
    throw new Error("Invalid response from Mayar Payment API")
  }

  return {
    amount: amount,
    url: link,
  }
}