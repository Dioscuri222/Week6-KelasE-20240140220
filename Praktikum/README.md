# Nexus Commerce Studio — Tugas Praktikum Pertemuan 6

Proyek web interaktif modern berbasis HTML5, CSS3, dan JavaScript Native (Vanilla JS) dengan tampilan **SaaS Studio / E-Commerce Workbench** yang sepenuhnya berbeda dari gaya vintage Week 5.

Mengimplementasikan dua fitur utama:
1. **Fetch API — Modern Product Catalog (`public/index.html`)**
2. **Form DOM & Event Handling — Caption Studio Workbench (`public/form.html`)**

---

## 🎨 Perbedaan UI/UX dengan Week 5

| Aspek | Week 5 (Referensi Awal) | Nexus Commerce Studio (Week 6 Baru) |
|---|---|---|
| **Tema & Gaya** | Kertas koran vintage / buku catatan retro bergaris | Modern SaaS Studio & E-Commerce Workbench |
| **Palet Warna** | Krem kertas (`#f4efe4`), tinta hitam, merah bata kusam | Slate halus (`#f8fafc`), permukaan putih bersih, aksen indigo cerah (`#4f46e5`), emerald (`#059669`), dan rose alert (`#e11d48`) |
| **Tipografi** | Serif klasik (Georgia) & Typewriter Mono | Tipografi Sans-serif modern (Clean System UI stack) berorientasi keterbacaan tinggi |
| **Navigasi** | Teks biasa dengan underline tebal | Topbar semi-transparan (*glassmorphism backdrop blur*) dengan badge logo dan pill tabs |
| **Monitoring Input** | Kontrol form standar di bawah header | **Dedicated Top Monitoring Panel** dengan live KPI chips (Total Produk, Kategori Aktif, Jumlah Stok Kritis) |
| **Kartu Produk** | Border tebal hitam dengan hard-shadow brutalist | Kartu modern dengan aspect-ratio gambar proporsional, floating category & stock chip, dan hover zoom halus |
| **Halaman Form** | Form kotak tunggal | **Split Workbench Studio**: panel input interaktif di sebelah kiri dan *Live Social Card Preview* (mockup media sosial) di sebelah kanan |

---

## 📋 Pemenuhan Ketentuan Khusus

1. **Bebas Magic Number (`jangan pakai magic number`)**:
   - Seluruh batasan angka (limit fetch data, ambang batas stok kritis, presisi desimal mata uang/rating, batas minimal dan maksimal karakter nama produk, batas harga rupiah, indeks karakter, dan durasi timeout notifikasi) didefinisikan secara transparan di dalam objek konstanta `CONFIG` pada `index.js` dan `FORM_CONFIG` pada `form.js`.
2. **Semua Input Disimpan di Atas (`agar mempermudah untuk monitoring`)**:
   - **Pada UI**: Panel kontrol pencarian, filter kategori, pengurutan, dan indikator KPI ditempatkan di bagian paling atas grid produk. Pada form, monitoring live counter dan parameter input berada di posisi atas yang mudah dipantau.
   - **Pada JavaScript**: Seluruh selektor elemen input DOM dideklarasikan terpusat di bagian atas file skrip.

---

## 📂 Struktur Berkas

```
Praktikum/
├── index.html              # Pengarah otomatis ke public/index.html
├── public/
│   ├── index.html          # Halaman 1: Modern Catalog & Fetch API
│   ├── form.html           # Halaman 2: Studio Form DOM & Live Preview
│   ├── css/
│   │   ├── index.css       # Sistem desain modern, navigasi glass, panel KPI & kartu produk
│   │   └── form.css        # Layout studio workbench, input validasi & social card preview
│   └── js/
│       ├── index.js        # Logika Fetch API, update KPI chips, filter, & render DOM
│       └── form.js         # Logika validasi real-time, format rupiah, & caption generator
├── latihan/
│   └── fetch.js            # Skrip uji coba konektivitas Fetch API (Node.js/Browser)
└── README.md               # Dokumentasi pengerjaan tugas
```

---

## 💻 Cara Menjalankan

1. Buka file [`public/index.html`](public/index.html) langsung di browser pilihan Anda atau gunakan ekstensi **Live Server**.
2. Pastikan terhubung ke internet saat membuka halaman katalog agar Fetch API dapat mengambil data dari DummyJSON.
3. Untuk menguji skrip fetch di terminal:
   ```bash
   node Praktikum/latihan/fetch.js
   ```

---

## 📦 Format Pengumpulan GitHub
- Format repository: `Week6-Kelas[X]-[NIMLengkap]` (contoh: `Week6-KelasA-20230123456`).
- Masukkan berkas proyek di dalam folder `Praktikum` ke dalam repository GitHub baru tersebut.
