# Saifu UI/UX Redesign Blueprint (Mobile-First Web App)

Dokumen ini berfungsi sebagai panduan utama bagi AI (Antigravity) untuk merombak total tampilan visual dan layout aplikasi Saifu tanpa mengubah business logic, database schema (Drizzle ORM), maupun auth/state management yang sudah ada.

---

## 1. Design System & Aesthetics

### Color Palette & Theme
- **Theme:** Strict Dark Mode, mengusung kesan premium, bersih, dan modern.
- **Background Utama:** `bg-zinc-950` atau `bg-slate-950`.
- **Surface / Card / Container:** `bg-zinc-900` atau `bg-neutral-900` dengan border tipis `border-zinc-800`.
- **Text Hierarchy:**
  - Primary text: `text-zinc-50` (Sangat kontras/putih bersih).
  - Secondary text: `text-zinc-400` atau `text-muted-foreground` (Untuk label, deskripsi, dan tanggal).
- **Accent Color (Financial Theme):** 
  - Pemasukan (Income): `text-emerald-500` / `bg-emerald-500/10`
  - Pengeluaran (Expense): `text-rose-500` / `bg-rose-500/10`
  - Aksentuasi Utama (Button/Active state): `bg-zinc-100 text-zinc-900` atau warna monokrom kontras.

### Typography & Component Standards
- **Font:** Clean sans-serif (Inter atau Geist Sans). Font-weight harus kontras (e.g., `font-bold` untuk angka nominal, `font-normal` atau `font-medium` untuk teks biasa).
- **Component Style:** Mengikuti standar Shadcn/UI (radius `rounded-2xl` untuk card besar, `rounded-xl` untuk button/input). 
- **Interactions:** Setiap tombol interaktif wajib memiliki mikro-interaksi visual saat ditekan: `active:scale-95 transition-all duration-200`.

---

## 2. Layout & Mobile-First Constraints

Untuk memberikan *user experience* (UX) seperti aplikasi mobile *native* (PWA) namun tetap elegan saat dibuka di desktop, aturan layout berikut wajib diterapkan:

- **The Mobile Frame (Desktop Center):** Di layar desktop (`md:` ke atas), seluruh aplikasi harus terbungkus dalam container maksimal seukuran layar HP: `max-w-md mx-auto min-h-screen bg-zinc-950 shadow-2xl border-x border-zinc-800/50`.
- **Sticky Top Header:** Header setinggi `h-14` atau `h-16` yang bersifat `sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900`. Berisi nama halaman di kiri, dan profil avatar/notifikasi di kanan.
- **Sticky Bottom Navigation:** Navigasi utama diletakkan di bawah screen, `fixed bottom-0 z-50 w-full max-w-md bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800/60 pb-safe`.
- **Scrollable Area:** Area konten di antara Header dan Bottom Nav harus bisa di-scroll dengan mulus (`overflow-y-auto`) dengan padding bawah yang cukup agar konten tidak tertutup navigasi bawah (`pb-24`).

---

## 3. Page & Component Breakdown

### A. Global Layout Components
1. **Bottom Navigation Bar:**
   - Terdiri dari 4-5 menu utama: **Dashboard (Home), Transaksi (List), Budget (Target), dan Pengaturan (Settings)**.
   - Menggunakan ikon dari `lucide-react` (ukuran `w-5 h-5`).
   - Menu yang aktif diberi warna terang (`text-zinc-50`), menu tidak aktif diberi warna redup (`text-zinc-500`).
2. **Action Floating Button (Optional):**
   - Tombol cepat "+" untuk tambah transaksi cepat, diletakkan menonjol di tengah Bottom Nav atau melayang di atasnya.

### B. Dashboard Page (`/dashboard` atau `/`)
1. **Hero Balance Card:**
   - Card utama yang menampilkan "Total Saldo" dengan ukuran font besar (`text-3xl font-bold tracking-tight`).
   - Di bawahnya ada sub-card mini berjejer horizontal (Flex row) untuk **Pemasukan** (hijau) dan **Pengeluaran** (merah) bulan ini dengan layout yang ringkas.
2. **Minimalist Chart Section:**
   - Grafik tren keuangan yang bersih, tanpa grid lines yang ramai. Cukup visualisasi garis (*line*) atau balok (*bar*) yang minimalis.
3. **Recent Transactions Preview:**
   - Menampilkan maksimal 3-5 transaksi terakhir. 
   - Setiap baris transaksi berisi: Ikon Kategori (berbentuk lingkaran `rounded-full`), Nama Transaksi & Tanggal (bertingkat), dan Nominal di ujung kanan dengan warna sesuai jenis (hijau/merah).

### C. Transaction Page (`/transactions`)
1. **Filter & Search:**
   - Input pencarian yang *sleek* dengan ikon kaca pembesar di dalam input.
   - Horizontal scrolling untuk filter kategori atau bulan (`flex overflow-x-auto scrollbar-none gap-2`).
2. **Grouped List:**
   - Transaksi dikelompokkan berdasarkan hari (e.g., "Hari ini", "Kemarin", "22 Mei 2026").
   - Menghilangkan *border* tabel tradisional, diganti dengan list berbasis `div` yang bersih dan memiliki padding `py-3` yang lega untuk disentuh jari.
3. **Transaction Sheet / Modal:**
   - Form untuk menambah/mengedit transaksi wajib muncul dalam bentuk **Drawer / Bottom Sheet** (muncul slide-up dari bawah layar) jika diakses di mobile, atau Dialog minimalis di tengah.

---

## 4. Technical Constraints & Instructions for AI

Saat mengimplementasikan kode berdasarkan blueprint ini, AI wajib mematuhi aturan teknis berikut:

- **Preserve Business Logic:** Jangan pernah menghapus, mengubah nama fungsi, atau memodifikasi *state*, *props API*, fungsi *Supabase authentication*, jalannya *fetching data*, atau skema *Drizzle ORM*.
- **Focus Scope:** Perubahan hanya boleh menyentuh bagian *styling* Tailwind CSS, penataan struktur tag HTML (`div`, `header`, `nav`, dll), dan penggantian komponen UI visual (`/components` dan `/app`).
- **Tailwind Efficiency:** Gunakan utilitas Tailwind secara efisien. Hindari penumpukan *class* yang tidak perlu yang bisa memperlambat performa render halaman mobile.