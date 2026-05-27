# Design System — Finance App (Mobile First)

> Tema: **Monokrom Presisi** — Terinspirasi dari estetika terminal Bloomberg dan jam tangan mewah hitam. Bersih, serius, dan tajam. Tidak ada warna berlebihan. Hanya hitam, putih, dan abu-abu dengan kontras tinggi.

---

## 1. Filosofi Desain

| Prinsip | Penjelasan |
|---|---|
| **Monokrom Mutlak** | Hanya gunakan hitam, putih, dan skala abu-abu. Tidak ada warna biru, hijau, ungu, atau aksen warna lain. |
| **Mobile First** | Semua layout didesain untuk lebar 375px lalu di-scale up. |
| **Tipografi sebagai Hierarki** | Ukuran, bobot, dan spasi huruf adalah satu-satunya alat untuk membedakan informasi. |
| **Kepadatan Terkontrol** | Setiap elemen punya ruang napas. Tidak sesak, tidak terlalu longgar. |
| **Micro-interaction Halus** | Animasi kecil pada tap, transisi state, dan loading — semua smooth, tidak berlebihan. |

---

## 2. Palet Warna

```css
:root {
  /* Background */
  --bg-base:        #0A0A0A;   /* Hitam utama — latar belakang app */
  --bg-card:        #141414;   /* Hitam card — sedikit lebih terang */
  --bg-elevated:    #1E1E1E;   /* Hitam elevated — modal, dropdown */
  --bg-input:       #1A1A1A;   /* Hitam input field */

  /* Border */
  --border-subtle:  #2A2A2A;   /* Garis tipis antar section */
  --border-default: #383838;   /* Border card dan elemen interaktif */
  --border-strong:  #505050;   /* Border focused/active state */

  /* Teks */
  --text-primary:   #F5F5F5;   /* Putih utama — judul, angka besar */
  --text-secondary: #A0A0A0;   /* Abu terang — label, caption */
  --text-tertiary:  #606060;   /* Abu gelap — placeholder, disabled */
  --text-inverse:   #0A0A0A;   /* Hitam — teks di atas tombol putih */

  /* Aksen (tetap monokrom) */
  --accent-white:   #FFFFFF;   /* Tombol CTA utama */
  --accent-dim:     #D0D0D0;   /* State hover tombol putih */

  /* Semantik (hanya kecerahan, bukan hue) */
  --positive:       #E8E8E8;   /* Pemasukan — putih terang */
  --negative:       #707070;   /* Pengeluaran — abu-abu gelap */
  --chart-line:     #C8C8C8;   /* Garis chart */
  --chart-fill:     rgba(255,255,255,0.04); /* Fill area chart */
}
```

---

## 3. Tipografi

```css
/* Import di <head> */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700&display=swap');

:root {
  --font-display: 'Sora', sans-serif;    /* Judul, angka besar, UI label */
  --font-mono:    'DM Mono', monospace;  /* Angka transaksi, kode, timestamp */
}
```

### Skala Tipografi

| Token | Size | Weight | Font | Penggunaan |
|---|---|---|---|---|
| `--text-hero` | 36px | 700 | Sora | Total Saldo |
| `--text-title` | 20px | 600 | Sora | Judul section |
| `--text-body` | 14px | 400 | Sora | Teks deskripsi |
| `--text-label` | 11px | 500 | Sora | Label uppercase |
| `--text-mono-lg` | 18px | 500 | DM Mono | Nominal transaksi |
| `--text-mono-sm` | 12px | 400 | DM Mono | Timestamp, ID |

**Aturan:**
- Label kategori (TOTAL SALDO, PEMASUKAN) → UPPERCASE, letter-spacing: 0.12em
- Angka nominal → selalu pakai `font-family: var(--font-mono)`
- Line-height body: 1.6 · Line-height heading: 1.2

---

## 4. Spacing & Layout

```css
:root {
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   16px;
  --space-lg:   24px;
  --space-xl:   32px;
  --space-2xl:  48px;

  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  20px;
  --radius-pill: 999px;

  --page-padding: 20px;        /* Padding kiri-kanan halaman */
  --card-padding: 20px 20px;   /* Padding dalam card */
}
```

**Grid:**
- Layout 1 kolom, full-width untuk mobile
- 2 kolom grid hanya untuk stat card (Pemasukan / Pengeluaran)
- Max-width container: 430px, centered di desktop

---

## 5. Komponen

### 5.1 Header / App Bar

```
┌─────────────────────────────────────────────┐
│  [Logo/Icon]              [Avatar] [Logout]  │
│  px: 20px · py: 14px · bg: --bg-base        │
│  Sticky, backdrop-blur: 12px saat scroll     │
└─────────────────────────────────────────────┘
```

- **Tinggi:** 56px
- **Logo:** monogram atau ikon outline putih, 28px
- **Avatar:** lingkaran 32px, border 1.5px `--border-default`
- **Separator:** garis bawah `--border-subtle` yang muncul saat scroll

---

### 5.2 Balance Card (Kartu Total Saldo)

```
┌─────────────────────────────────────────────┐
│  TOTAL SALDO            [↓ Export]           │
│                                              │
│  Rp 0                                        │
│  ─────────────────────────────────────────  │
│  [↗ PEMASUKAN]    [↙ PENGELUARAN]           │
│     Rp 0               Rp 0                 │
└─────────────────────────────────────────────┘
```

**Spesifikasi:**
- Background: `--bg-card`
- Border: 1px `--border-subtle`
- Border-radius: `--radius-lg`
- Padding: 24px 20px
- Label "TOTAL SALDO": `--text-label`, `--text-tertiary`, letter-spacing 0.12em
- Angka saldo: `--text-hero`, `--text-primary`, `font-family: var(--font-mono)`
- Divider: border-top 1px `--border-subtle` sebelum stat row

**Tombol Export:**
- Background: transparan
- Border: 1px `--border-default`
- Border-radius: `--radius-pill`
- Teks: 11px, `--text-secondary`
- Ikon: 12px
- Hover: background `--bg-elevated`

**Stat Card (Pemasukan/Pengeluaran):**
- Background: `--bg-elevated`
- Border-radius: `--radius-md`
- Icon container: 32x32px, border-radius: 8px
  - Pemasukan: background `rgba(255,255,255,0.1)`, ikon putih
  - Pengeluaran: background `rgba(255,255,255,0.06)`, ikon abu-abu
- Label: 10px uppercase, `--text-tertiary`
- Nominal: 14px mono, Pemasukan → `--text-primary`, Pengeluaran → `--text-secondary`

---

### 5.3 Chart Section (Tren Keuangan)

```
┌─────────────────────────────────────────────┐
│  ↗ Tren Keuangan                             │
│                                              │
│  [7H]  1B  1T                                │
│                                              │
│  4 ·····················                    │
│  3 ·····················                    │
│  2 ·····················     ___            │
│  1 ················/···/···/                │
│    ─────────────────────────────            │
│    Sen  Sel  Rab  Kam  Jum  Sab  Min        │
└─────────────────────────────────────────────┘
```

**Spesifikasi:**
- Background: `--bg-card`
- Padding: 20px
- Chart line: 1.5px, `--chart-line`
- Chart area fill: `--chart-fill` (gradient ke bawah)
- Grid lines: 1px dashed `--border-subtle`
- Y-axis label: 11px mono, `--text-tertiary`
- X-axis label: 10px, `--text-tertiary`
- Tooltip: background `--bg-elevated`, border `--border-default`, teks mono

**Tab Filter (7H / 1B / 1T):**
- Container: background `--bg-elevated`, border-radius: `--radius-pill`
- Tab aktif: background `--accent-white`, teks `--text-inverse`, border-radius: `--radius-pill`
- Tab nonaktif: teks `--text-tertiary`
- Transisi: 150ms ease

---

### 5.4 Tombol Tambah (FAB)

```
       ┌──────────┐
       │    +     │   48x48px, border-radius: 50%
       │          │   bg: --accent-white
       └──────────┘   color: --text-inverse
                      box-shadow: 0 4px 20px rgba(255,255,255,0.15)
```

- **Ukuran:** 52x52px
- **Shadow:** `0 4px 24px rgba(255,255,255,0.12)`
- **Ikon:** 22px, tebal
- **Hover/Active:** scale(0.94), shadow mengecil
- **Posisi:** center di navbar, float naik 12px dari navbar

---

### 5.5 Bottom Navigation Bar

```
┌───────────────────────────────────────────────┐
│  [N]        [⊞]      [  +  ]    [ ]   [💳]   │
│  Notif    Beranda            (empty) Dompet    │
│            ● aktif                             │
└───────────────────────────────────────────────┘
```

**Spesifikasi:**
- Background: `--bg-card`
- Border-top: 1px `--border-subtle`
- Backdrop-filter: blur(20px)
- Height: 68px (+ safe area inset bawah)
- Icon aktif: putih `--text-primary`, indicator dot 4px di bawah ikon
- Icon nonaktif: `--text-tertiary`
- Label: 10px, hanya muncul di state aktif
- Transisi ikon: 120ms ease

---

### 5.6 List Item Transaksi

```
┌─────────────────────────────────────────────┐
│  [ikon]  Nama Merchant         + Rp 50.000  │
│          kat · 14:30               masuk    │
└─────────────────────────────────────────────┘
```

**Spesifikasi:**
- Padding: 14px 0
- Divider bawah: 1px `--border-subtle`
- Ikon container: 40x40px, `--bg-elevated`, `--radius-md`
- Nama: 14px Sora, `--text-primary`
- Meta (kategori · waktu): 11px mono, `--text-tertiary`
- Nominal positif: `--text-primary`
- Nominal negatif: `--text-secondary`
- Tap state: background flash `rgba(255,255,255,0.04)`

---

## 6. Animasi & Transisi

| Elemen | Efek | Durasi | Easing |
|---|---|---|---|
| Card mount | fadeIn + slideUp 8px | 300ms | ease-out |
| Tab filter switch | background slide | 150ms | ease |
| Chart data change | path morphing | 400ms | ease-in-out |
| FAB tap | scale 0.92 | 100ms | ease |
| Skeleton loading | shimmer horizontal | 1.2s loop | linear |
| Number counter | count up dari 0 | 600ms | ease-out |
| Navbar icon | scale 1→1.1→1 | 200ms | ease |

```css
/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--border-default) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  border-radius: var(--radius-sm);
}
```

---

## 7. Status & Feedback States

| State | Visual |
|---|---|
| **Empty state** | Ikon outline besar abu-abu + teks `--text-tertiary` |
| **Loading** | Skeleton shimmer (bukan spinner) |
| **Error** | Border `--border-strong` + teks `--text-secondary` |
| **Success toast** | Popup bawah: `--bg-elevated`, border `--border-default`, ikon ✓ putih |
| **Disabled** | Opacity 0.35, pointer-events none |

---

## 8. Checklist Implementasi

- [ ] Semua warna pakai CSS custom properties (tidak ada hardcode hex di luar `:root`)
- [ ] Tidak ada warna selain hitam/putih/abu — tidak ada biru, hijau, merah, ungu
- [ ] Semua angka Rupiah pakai `font-family: var(--font-mono)`
- [ ] Viewport meta: `width=device-width, initial-scale=1`
- [ ] Touch target minimum 44x44px untuk semua elemen interaktif
- [ ] Smooth scroll: `scroll-behavior: smooth`
- [ ] Safe area: `padding-bottom: env(safe-area-inset-bottom)` di navbar
- [ ] Font di-load dengan `display=swap` untuk performa
- [ ] Animasi dihormati: `@media (prefers-reduced-motion: reduce)` menonaktifkan semua transisi

---

*Generated for: Finance App Redesign · Mobile First · Monochrome Precision*
