import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatCurrency } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { id } from "date-fns/locale"

export interface InvoiceItem {
  name: string
  quantity: number
  price: number
  startDate: Date | string
  endDate: Date | string
  pickupTime?: string
  returnTime?: string
}

export interface InvoiceData {
  id: string
  customerName: string
  customerPhone: string
  createdAt: Date | string
  totalPrice: number
  items: InvoiceItem[]
}

export async function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF()
  
  // Load Logo
  try {
    const response = await fetch('/logo.png')
    const blob = await response.blob()
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
    doc.addImage(base64, 'PNG', 20, 15, 25, 25)
  } catch (e) {
    console.error("Failed to load logo", e)
    // Continue without logo if it fails
  }

  // Header
  // Theme Color: Yellow-500 (#EAB308) -> RGB: 234, 179, 8
  doc.setFillColor(234, 179, 8) 
  doc.rect(0, 0, 210, 50, 'F') 
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text("SAYEQUIPMENT", 55, 25)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text("Rental Alat Outdoor Bojonegoro", 55, 33)
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.text("BUKTI BOOKING", 190, 25, { align: 'right' })
  doc.setFontSize(10)
  doc.text(`#${data.id.slice(0, 8)}`, 190, 33, { align: 'right' })

  // Customer Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text("Pemesan:", 20, 65)
  doc.setFont('helvetica', 'bold')
  doc.text(data.customerName, 20, 70)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customerPhone, 20, 75)

  doc.text("Tanggal Booking:", 190, 65, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  const dateStr = typeof data.createdAt === 'string' ? data.createdAt : format(new Date(data.createdAt), "dd MMMM yyyy", { locale: id })
  doc.text(dateStr, 190, 70, { align: 'right' })

  // Table
  const tableData = data.items.map((item, index) => {
    const start = new Date(item.startDate)
    const end = new Date(item.endDate)
    const duration = differenceInDays(end, start) || 1 // Min 1 day

    let durationInfo = `${format(start, "dd MMM", { locale: id })} - ${format(end, "dd MMM", { locale: id })} (${duration} hari)`
    
    // Add time details
    if (item.pickupTime) {
      durationInfo += `\nAmbil: ${item.pickupTime.padStart(2, '0')}:00`
    }
    if (item.returnTime) {
      durationInfo += `\nKembali: ${item.returnTime.padStart(2, '0')}:00`
    }

    return [
      index + 1,
      item.name,
      durationInfo,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.price * item.quantity) // Assuming price is per item (sometimes per day logic varies but let's stick to simple calc or passed total)
      // Note: In CartClient, price seems to be unit price. But total logic might be complex. 
      // Ideally we should pass calculated line total if available.
      // For now, let's assume price is the cost for that item for the duration OR we calculate it.
      // Wait, in CartClient: formatCurrency(item.price * item.quantity). 
      // If item.price is per day, this is wrong. 
      // In CartClient logic: useCartStore has `price` which is `product.price * duration`.
      // So item.price is already the total price for that item for the duration.
      // Let's assume the passed `price` in `InvoiceItem` is the total price for that line item per unit.
    ]
  })

  autoTable(doc, {
    startY: 85,
    head: [['No', 'Barang', 'Detail Waktu', 'Qty', 'Harga', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [234, 179, 8], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 },
      3: { cellWidth: 20, halign: 'center' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    },
    styles: { cellPadding: 3, fontSize: 9 }
  })

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Pembayaran: ${formatCurrency(data.totalPrice)}`, 190, finalY, { align: 'right' })

  // Terms & Conditions
  const termsY = finalY + 20
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text("Ketentuan Sewa:", 20, termsY)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  const terms = [
    "1. Penyewa wajib meninggalkan identitas asli (KTP/SIM/Kartu Pelajar) sebagai jaminan.",
    "2. Pembayaran dilakukan lunas saat pengambilan barang (Cash/Transfer).",
    "3. Keterlambatan pengembalian akan dikenakan denda sesuai tarif harian yang berlaku.",
    "4. Segala bentuk kerusakan atau kehilangan barang menjadi tanggung jawab penuh penyewa.",
    "5. Cek kelengkapan dan kondisi barang sebelum meninggalkan lokasi. Komplain setelah barang dibawa tidak dilayani."
  ]

  let currentY = termsY + 6
  terms.forEach(term => {
    doc.text(term, 20, currentY)
    currentY += 5
  })

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text("Harap tunjukkan bukti ini saat pengambilan barang.", 105, 280, { align: 'center' })
  doc.text("Terima kasih telah menyewa di SayEquipment!", 105, 285, { align: 'center' })

  doc.save(`booking-${data.id.slice(0, 8)}.pdf`)
}
