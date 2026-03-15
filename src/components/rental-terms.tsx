import { prisma } from "@/lib/prisma"
import { AlertCircle, Clock, FileText, CheckCircle, AlertTriangle, Percent } from "lucide-react"

export async function RentalTerms() {
  let terms: any[] = []
  try {
    terms = await prisma.rentalterm.findMany({
      orderBy: { createdAt: 'asc' }
    })
  } catch {
    terms = []
  }

  // If no terms in DB, show fallback (or empty)
  // But ideally we should seed some default terms if empty, 
  // or just show what's there. 
  // For now we just map what's there.

  return (
    <section className="container-custom py-16" id="terms">
      <div className="bg-white rounded-3xl shadow-lg border border-earth-100 overflow-hidden">
        <div className="bg-earth-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1600&q=80')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">KETENTUAN SEWA-MENYEWA</h2>
            <p className="text-earth-200 text-lg italic">"Sebelum booking, mohon disimak ketentuan dulu ya bosku"</p>
          </div>
        </div>
        
        <div className="p-6 md:p-12">
            {terms.length === 0 ? (
               <p className="text-center text-gray-500">Belum ada ketentuan sewa yang ditambahkan.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {terms.map((term, index) => (
                        <div key={term.id} className="flex gap-4">
                            <div className="bg-primary-100 p-3 h-fit rounded-xl text-primary-700 flex-shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-earth-900 mb-2">Poin {index + 1}</h3>
                                <p className="text-earth-600 leading-relaxed whitespace-pre-line">{term.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </section>
  )
}
