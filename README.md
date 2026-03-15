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

---

## Panduan Lengkap Deploy ke VPS (Ubuntu/Debian)

Panduan ini mencakup dari awal hingga aplikasi siap production menggunakan PM2, MariaDB, Nginx, dan Let's Encrypt.

### 1. Persiapan Server & Install Dependencies Global
Update sistem dan install paket esensial seperti Git:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git unzip ufw -y
```

Setup Firewall (UFW):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Install & Setup MariaDB
Install MariaDB:
```bash
sudo apt install mariadb-server mariadb-client -y
```
Amankan instalasi MariaDB:
```bash
sudo mysql_secure_installation
```
*(Ikuti prompt: set root password, hapus anonymous users, disallow root login remotely, hapus test database)*

Buat Database dan User untuk App:
```bash
sudo mysql -u root -p
```
Di dalam prompt MySQL, jalankan:
```sql
CREATE DATABASE app_db;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password_kuat_anda';
GRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Install Node.js & PM2
Install Node.js (misal versi 20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
Install PM2 secara global:
```bash
sudo npm install -g pm2
```

### 4. Setup Project Menggunakan Git
Buat direktori untuk aplikasi (contoh di `/var/www`):
```bash
sudo mkdir -p /var/www/my-app
sudo chown -R $USER:$USER /var/www/my-app
cd /var/www/my-app
```
Clone repository Anda:
```bash
git clone https://github.com/username-anda/repo-anda.git .
```

Install dependencies proyek:
```bash
npm install
```

### 5. Konfigurasi Environment & Database
Buat file `.env`:
```bash
nano .env
```
Isi dengan konfigurasi Anda:
```env
DATABASE_URL="mysql://app_user:password_kuat_anda@localhost:3306/app_db"
NEXT_PUBLIC_APP_URL="https://domain-anda.com"
# Tambahkan variable lain yang diperlukan dari .env.example
```

Jalankan migrasi Prisma dan seed:
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed # Opsional
```

### 6. Build & Jalankan Aplikasi dengan PM2
Build aplikasi Next.js:
```bash
npm run build
```
Jalankan menggunakan PM2:
```bash
pm2 start npm --name "my-app" -- run start
# Atau jika menggunakan standalone output:
# pm2 start .next/standalone/server.js --name "my-app"
```
Simpan konfigurasi PM2 agar autostart saat server reboot:
```bash
pm2 save
pm2 startup
# Jalankan command output dari perintah `pm2 startup`
```

### 7. Install & Konfigurasi Nginx (Reverse Proxy)
Install Nginx:
```bash
sudo apt install nginx -y
```
Buat konfigurasi virtual host baru:
```bash
sudo nano /etc/nginx/sites-available/my-app
```
Isi konfigurasi Nginx berikut ini supaya aplikasi Next.js bisa diakses melalu domain Anda:
```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Meneruskan alamat IP asli klien
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Aktifkan konfigurasi Nginx baru dan restart layanannya:
```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup HTTPS dengan Let's Encrypt (Certbot)
Install Certbot dan plugin Nginx:
```bash
sudo apt install certbot python3-certbot-nginx -y
```
Dapatkan sertifikat SSL:
```bash
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
```
*(Ikuti instruksi: masukkan email address, setuju terms, pilih opsi redirect (biasanya opsi 2) agar HTTP otomatis dialihkan ke HTTPS).*

Uji coba perpanjangan otomatis SSL:
```bash
sudo certbot renew --dry-run
```

**Selesai!** Aplikasi Next.js Anda kini telah berjalan aman dalam production environment VPS dengan auto-restart PM2, MariaDB, dan telah dilindungi dengan Nginx SSL Let's Encrypt.
