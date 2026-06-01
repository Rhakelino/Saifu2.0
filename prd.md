# Product Requirement Document (PRD)
## Inisiatif: Transformasi PWA (Progressive Web App) - Saifu

| Atribut | Detail |
| :--- | :--- |
| **Nama Produk** | Saifu (Personal Finance App) |
| **Fitur / Inisiatif** | Implementasi Progressive Web App (PWA) |
| **Status** | Approved / Ready for Development |
| **Versi** | 1.0 |
| **Penulis** | Kaell (AI Assistant) |

---

## 1. Latar Belakang & Tujuan
**Saifu** sebagai aplikasi pelacak keuangan pribadi (*personal finance tracker*) membutuhkan aksesibilitas yang cepat, andal, dan siap sedia kapan pun pengguna ingin mencatat transaksi mereka. Seringkali, pencatatan keuangan dilakukan secara impulsif tepat setelah transaksi terjadi di dunia nyata—di mana kondisi jaringan tidak selalu stabil (misal: di dalam basement toko, pasar, atau daerah minim sinyal).

Dengan mengubah Saifu menjadi **Progressive Web App (PWA)**, kita menjembatani celah antara web app biasa dan native mobile app. Pengguna dapat menginstal Saifu langsung ke layar utama perangkat mereka tanpa melalui App Store/Play Store, menikmati loading yang instan, serta memastikan aplikasi tetap berfungsi dalam skenario offline atau jaringan buruk.

### Tujuan Utama (Objectives):
* **Installability:** Menyediakan opsi bagi pengguna untuk menambahkan Saifu ke *Homescreen* (Android/iOS) dan *Desktop App* (macOS/Windows).
* **Instant Loading & Performance:** Mempercepat waktu muat aplikasi (*Time to Interactive*) dengan melakukan caching pada core assets menggunakan Service Worker.
* **Offline Resilience:** Memastikan *App Shell* dan data esensial tetap dapat diakses meskipun perangkat tidak terhubung ke internet.

---

## 2. User Stories & Skenario Pengguna

### 2.1. Instalasi Aplikasi
* **User Story:** Sebagai pengguna Saifu, saya ingin menginstal aplikasi langsung dari browser ke layar utama ponsel saya, sehingga saya bisa mengakses Saifu dengan satu ketukan layaknya aplikasi bawaan.
* **Kriteria Penerimaan (Acceptance Criteria):**
  * Muncul prompt otomatis (*Add to Home Screen*) jika browser mendukung.
  * Aplikasi berjalan dalam mode `standalone` (tanpa URL bar browser, navigation bar bottom bawaan browser, dsb.) setelah diinstal.

### 2.2. Penggunaan Saat Offline (Akses Data Terakhir)
* **User Story:** Sebagai pengguna yang sedang berada di daerah susah sinyal, saya ingin tetap bisa membuka Saifu untuk melihat total saldo dan riwayat transaksi terakhir yang berhasil disinkronkan.
* **Kriteria Penerimaan (Acceptance Criteria):**
  * Ketika aplikasi dibuka tanpa koneksi internet, aplikasi tidak menampilkan halaman error default browser (*"No Internet"*).
  * Aplikasi memuat *App Shell* (UI utama, layout Sidebar/Navbar, tema Dark Mode) dan menampilkan data cache terakhir dari Supabase.
  * Terdapat indikator visual halus yang menginformasikan pengguna bahwa mereka sedang dalam mode offline.

---

## 3. Cakupan Fitur & Persyaratan (Scope & Requirements)

### 3.1. Fase 1: Core PWA (Minimum Viable Product - MVP)
Fase ini berfokus pada pemenuhan standar dasar kelayakan PWA agar dapat diinstal dan lolos audit Lighthouse.

1. **Web App Manifest (`manifest.json` / `manifest.ts`):**
   * Mengonfigurasi metadata dasar aplikasi: `name`, `short_name`, `description`, `start_url`, `theme_color`, dan `background_color` (disesuaikan dengan palet warna Dark Mode Saifu).
   * Menyediakan icon set yang valid (minimal resolusi `192x192` dan `512x512` dengan format PNG maskable).
2. **Service Worker Registration:**
   * Registrasi otomatis Service Worker pada *entry point* aplikasi Next.js menggunakan library wrapper modern (direkomendasikan `@ducanh2912/next-pwa` atau `@serwist/next`).
3. **Static Assets Caching (Stale-While-Revalidate):**
   * Melakukan pre-cache terhadap bundle JS, berkas CSS Tailwind, fonts, ikon komponen **Shadcn/UI**, dan static images utama di folder `/public`.

### 3.2. Fase 2: Offline Data Capabilities & UI Handling (Peningkatan)
Fase ini berfokus pada peningkatan UX ketika koneksi terputus.

1. **Supabase Local Cache / Cache-Control:**
   * Mengatur agar request data esensial (seperti total saldo bulan ini) memanfaatkan mekanisme caching browser, sehingga saat offline, data terakhir tetap muncul (*read-only*).
2. **Offline Detection State:**
   * Komponen global berbasis React State (`navigator.onLine`) untuk memantau status jaringan.
   * Memunculkan banner kecil (*toast* atau *badge* topbar) bertuliskan: *"Anda sedang offline. Beberapa fitur sinkronisasi dinonaktifkan sementara."*
3. **Mencegah Form Submission Saat Offline:**
   * Tombol "Simpan Transaksi" otomatis masuk ke mode disabled atau dialihkan ke penyimpanan lokal (*IndexedDB*) jika terdeteksi offline (tergantung kompleksitas arsitektur Drizzle + Supabase).

---

## 4. Spesifikasi Teknis & Stack Integrasi

* **Framework Utama:** Next.js (App Router).
* **PWA Plugin:** `@ducanh2912/next-pwa` (Sangat disarankan karena sangat stabil untuk Next.js App Router dan minim boilerplate).
* **Styling & UI:** Tailwind CSS & Shadcn/UI.
* **State & Data Layer:** Supabase Client SDK & Drizzle ORM (untuk pengelolaan skema query).
* **Keamanan:** Wajib HTTPS secara penuh (ditangani otomatis oleh Vercel saat production deployment).

---

## 5. Metrik Keberhasilan & Pengujian

### 5.1. Kriteria Sukses Teknis
1. **Lighthouse PWA Audit:** Skor pengujian PWA pada Google Lighthouse DevTools mencapai nilai **> 90%** dan berstatus hijau (Lolos verifikasi *Installable* dan *Registers a service worker*).
2. **Cross-Platform Install:** Berhasil memicu prompt "Install" di Google Chrome (Desktop/Android) dan opsi "Add to Home Screen" melalui Safari (iOS).

### 5.2. Skenario Pengujian Manual (QA Checklist)
1. Aktifkan *Airplane Mode* pada perangkat ponsel yang sudah terinstal Saifu.
2. Buka aplikasi Saifu dari homescreen.
3. **Hasil yang diharapkan:** Aplikasi terbuka instant, struktur UI (Sidebar/Navbar/Dark Mode) utuh, dan data dashboard terakhir tetap terbaca. Tidak ada crash atau blank page.
4. Nonaktifkan *Airplane Mode*.
5. **Hasil yang diharapkan:** Aplikasi mendeteksi jaringan kembali online dan banner indikator offline hilang secara otomatis.

---

## 6. Rencana Implementasi Singkat (Saran Developer Workflow)

1. **Setup Aset:** Ekspor logo Saifu menjadi ukuran `192x192` dan `512x512` piksel, simpan di folder `public/icons/`.
2. **Install Library:** Eksekusi `npm i @ducanh2912/next-pwa` di workspace proyek.
3. **Konfigurasi `next.config.js`:** Bungkus konfigurasi next dengan plugin PWA tersebut.
4. **Buat Manifest Berkas:** Tambahkan file `manifest.json` di folder `public/` atau manfaatkan fitur Route Handler `app/manifest.ts` bawaan Next.js.
5. **Deploy & Verifikasi:** Push ke branch staging/production di Vercel, lalu jalankan audit Lighthouse.
