Mengimplementasikan dua fitur utama:
1. **Fetch API — Modern Product Catalog (`public/index.html`)**
2. **Form DOM & Event Handling — Caption Studio Workbench (`public/form.html`)**

## Struktur Folder

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