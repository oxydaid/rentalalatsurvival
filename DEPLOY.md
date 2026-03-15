# Panduan Deployment Manual

Berikut adalah cara deploy aplikasi ini ke hosting (VPS atau cPanel dengan Node.js Support) tanpa Docker.

## Persiapan Lingkungan (Server)

Pastikan server Anda memiliki:
- **Node.js** (Versi 18 atau 20 direkomendasikan)
- **MySQL Database**

## Metode 1: Upload Source Code (Direkomendasikan)

Cara ini paling umum. Anda mengupload kode sumber, lalu build di server.

1. **Siapkan File**
   Compress/Zip semua file project ini, **KECUALI**:
   - Folder `node_modules`
   - Folder `.next`
   - Folder `.git`

2. **Upload ke Server**
   - Upload file zip ke server Anda.
   - Extract file tersebut.

3. **Install Dependencies**
   Di terminal server (atau console cPanel), jalankan:
   ```bash
   npm install
   ```

4. **Setup Database**
   - Buat file `.env` di server (bisa copy dari `.env.example` jika ada, atau buat baru).
   - Isi `DATABASE_URL` dengan koneksi database server Anda.
     Contoh: `DATABASE_URL="mysql://user:password@localhost:3306/nama_database"`
   
   - Jalankan migrasi database:
     ```bash
     npx prisma generate
     npx prisma migrate deploy
     ```
   
   - (Opsional) Isi data awal:
     ```bash
     npx prisma db seed
     ```

5. **Build Aplikasi**
   ```bash
   npm run build
   ```

6. **Jalankan Aplikasi**
   ```bash
   npm start
   ```
   Aplikasi akan berjalan di port 3000 (default).

---

## Metode 2: Upload Hasil Build (Standalone)

Jika Anda ingin build di komputer lokal dan hanya upload hasilnya (lebih hemat resource server).

1. **Build di Lokal**
   Pastikan di `next.config.ts` sudah ada `output: "standalone"`.
   Jalankan:
   ```bash
   npm run build
   ```

2. **Siapkan Folder Deploy**
   Akan muncul folder `.next/standalone`. Folder ini berisi server minimal.
   Namun, Anda perlu meng-copy folder `public` dan `.next/static` agar gambar dan style termuat.

   Struktur folder yang harus di-zip:
   - Copy folder `public` -> ke dalam `.next/standalone/public`
   - Copy folder `.next/static` -> ke dalam `.next/standalone/.next/static`
   
   *Catatan: Folder `.next/standalone` sudah berisi `node_modules` yang dibutuhkan.*

3. **Upload & Run**
   - Zip isi folder `.next/standalone` (yang sudah ditambah public & static tadi).
   - Upload ke server.
   - Set Environment Variable `DATABASE_URL` dan `PORT` (jika perlu).
   - Jalankan:
     ```bash
     node server.js
     ```

## Catatan Penting

- **File Uploads**: Aplikasi ini menyimpan gambar upload di folder `public/uploads`. Pastikan folder ini memiliki izin tulis (write permission) di server.
- **Persistent Data**: Jika Anda redeploy (hapus folder lama, upload baru), pastikan folder `public/uploads` **DIBACKUP** atau jangan ditimpa, agar gambar-gambar produk tidak hilang.
