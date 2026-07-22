# Saifu 2.0

Saifu adalah aplikasi manajer keuangan pribadi berfokus pada kecepatan, offline-first (PWA), dan desain monokrom presisi. Dirancang secara mobile-first dengan tampilan layaknya terminal profesional.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4
- **Database & ORM:** PostgreSQL + Drizzle ORM
- **Autentikasi:** `better-auth`
- **State Management (Server State):** `@tanstack/react-query` v5
- **PWA:** `@ducanh2912/next-pwa`
- **UI Components:** `lucide-react`, `recharts`, `sonner`

## 🎨 Design System (Monokrom Presisi)

- **Warna:** HANYA menggunakan hitam, putih, dan skala abu-abu. Tidak ada warna lain.
- **Tipografi:** 
  - `Sora`: Untuk judul, UI label, dan body text.
  - `DM Mono`: WAJIB untuk semua angka nominal (Rupiah), ID, dan timestamp.
- **Layout:** Mobile-first (lebar dasar 375px). Max-width container desktop adalah 430px (centered).

## 🚀 Fitur Utama

- **Progressive Web App (PWA):** Dapat diinstal ke homescreen, support loading instan, dan memiliki ketahanan saat koneksi offline.
- **Multi-Wallet Management:** Kelola beberapa dompet sekaligus.
- **Transaksi Real-time:** Pencatatan cepat untuk pemasukan dan pengeluaran.
- **Laporan & Ekspor:** Lihat visualisasi data (chart) dan ekspor laporan ke format lain.

## 💻 Cara Menjalankan

1. Clone repositori ini.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` ke `.env.local` (jika ada) dan isi variabel yang dibutuhkan (Database URL, Auth secrets).
4. Jalankan migrasi Drizzle:
   ```bash
   npx drizzle-kit push
   ```
5. Mulai development server:
   ```bash
   npm run dev
   ```

Aplikasi dapat diakses di `http://localhost:3000`.
