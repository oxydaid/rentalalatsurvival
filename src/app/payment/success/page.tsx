export const dynamic = "force-dynamic"

export default async function PaymentSuccessPage(props: {
  searchParams: Promise<{ bookingId?: string }>
}) {
  const searchParams = await props.searchParams
  const bookingId = searchParams?.bookingId
  return (
    <div className="container-custom pt-32 pb-20 min-h-[60vh] flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold text-earth-900 mb-3">Pembayaran Berhasil</h1>
      <p className="text-earth-600 max-w-xl">
        Terima kasih! Kami telah menerima pembayaran Anda. {bookingId ? `ID Pesanan: ${bookingId}. ` : ""}Status pemesanan akan diperbarui otomatis.
      </p>
      <a href="/products" className="mt-8 bg-primary-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors shadow-md hover:shadow-lg">
        Kembali Belanja
      </a>
    </div>
  )
}
