import { CartClient } from "./cart-client"
import { getWhatsappNumber } from "@/app/actions/settings"

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const whatsappNumber = await getWhatsappNumber()

  return <CartClient whatsappNumber={whatsappNumber} />
}
