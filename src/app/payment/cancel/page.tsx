export const dynamic = "force-dynamic"

export default async function PaymentCancelPage(props: {
  searchParams: Promise<{ bookingId?: string }>
}) {
  const searchParams = await props.searchParams
  const bookingId = searchParams?.bookingId
  return (
    <div className="container-custom pt-32 pb-20 min-h-[60vh] flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-earth-900 mb-3">Pembayaran Dibatalkan</h1>
      <p className="text-earth-600 max-w-xl">
        Transaksi dibatalkan atau belum selesai diproses. {bookingId ? `ID Pesanan: ${bookingId}. ` : ""}Anda dapat mencoba lagi atau hubungi admin.
      </p>
      <a href="/(public)/cart" className="mt-8 bg-white text-earth-900 border-2 border-earth-200 px-6 py-3 rounded-lg font-bold hover:bg-earth-50 transition-colors">
        Kembali ke Keranjang
      </a>
    </div>
  )
}
