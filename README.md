# Website Profil dan Katalog Almira Baby and Kids Spa

Repositori proyek akhir mata kuliah **ER234302 Pemrograman Web (M)** — Semester Gasal 2026/2027.

---

## Informasi Proyek & Kelompok

| Atribut | Keterangan |
| :--- | :--- |
| **Judul Proyek** | Website Profil dan Katalog Almira Baby and Kids Spa |
| **Nama Kelompok** | PWEB (M) - Kelompok 14 |
| **Mitra UMKM** | Almira Baby and Kids Spa (Mojosari, Kab. Mojokerto) |
| **Narahubung Mitra** | Bidan Yunis Irna Tristanti |
| **Dosen Pengampu** | 1. Muhammad Alfian, S.Tr.Kom., M.Tr.<br>2. Bintang Nuralamsyah, S.Kom., M.Kom. |

### Anggota Kelompok & Pembagian Peran

| No | Nama Lengkap | NRP | Peran Utama | Tanggung Jawab Teknis |
| :-: | :--- | :---: | :---: | :--- |
| 1 | **Farrel Aryasatya Raharjo** | `5053251036` | Front-end | Halaman publik statis, integrasi katalog, SEO dasar, responsivitas `360px`, & deployment Vercel |
| 2 | **Nathan Alden** | `5053251024` | UI/UX Design | Wireframe, desain antarmuka Panel Admin, interaksi form CRUD, & validasi pesan error di halaman |
| 3 | **Deara Briliana Putri** | `5053251027` | Back-end | Skema database SQLite (Turso/LibSQL), endpoint API serverless (`/api/auth`, `/api/layanan`, `/api/upload`), & keamanan hash password (`bcrypt`) |

---

## Ringkasan Proyek

**Almira Baby and Kids Spa** adalah UMKM layanan perawatan bayi dan anak di Kecamatan Mojosari, Kabupaten Mojokerto yang berdiri sejak Maret 2022 dan melayani sekitar 250 pelanggan per bulan.

Website ini dibangun untuk menyelesaikan dua masalah utama mitra:
1. Menampilkan katalog lengkap layanan (**Baby & Kids Massage**, **Baby Spa**, **Kids Spa**, dan **Massage Terapi**) beserta rincian harga, foto, lokasi Google Maps, dan tombol reservasi WhatsApp (`081332487575`) yang dapat diakses **maksimal 2 kali klik dari halaman utama**.
2. Menyediakan **Panel Admin berformulir tervalidasi** agar pengelola mitra dapat menambah, mengubah, dan menonaktifkan layanan serta harga secara mandiri tanpa bantuan programmer.

> **Catatan Ruang Lingkup:** Website tidak mencakup sistem pembayaran online maupun formulir reservasi di dalam web (seluruh pemesanan/reservasi tetap diarahkan ke WhatsApp resmi mitra).

---

## Struktur Direktori

```text
almira-baby-spa-web/
├── .gitignore
├── .env.example
├── AI-LOG.md                  # Catatan penggunaan AI (wajib)
├── README.md                  # Dokumentasi proyek
├── vercel.json                # Konfigurasi deploy Vercel
├── package.json
├── public/                    # File statis (Front-end)
│   ├── index.html             # 1. Halaman Beranda
│   ├── profil.html            # 2. Halaman Profil
│   ├── layanan.html           # 3. Halaman Paket Layanan
│   ├── kontak.html            # 4. Halaman Kontak
│   ├── admin/
│   │   ├── login.html         # 5a. Halaman Login Admin
│   │   └── dashboard.html     # 5b. Halaman Panel Admin (CRUD)
│   ├── assets/
│   │   ├── images/            # Logo mitra, foto tempat, foto layanan, og-image (SEO)
│   │   └── icons/             # Ikon WhatsApp, Instagram, Maps, dll.
│   ├── css/
│   │   ├── style.css          # Gaya utama + media queries (responsif 360px)
│   │   └── admin.css          # Gaya khusus Panel Admin
│   └── js/
│       ├── main.js            # Navigasi mobile, fetch data layanan ke katalog
│       └── admin.js           # Validasi form error di halaman, logic CRUD & upload
├── api/                       # Backend / Serverless Functions (untuk Vercel)
│   ├── auth.js                # Endpoint login, logout, cek sesi (password di-hash)
│   ├── layanan.js             # Endpoint GET, POST, PUT, DELETE data layanan
│   └── upload.js              # Endpoint unggah foto layanan (maks 2 MB, JPG/PNG)
└── database/
    ├── schema.sql             # Query pembuatan tabel admin & layanan
    └── seed.sql               # Data awal pricelist asli dari mitra
```

---

## Arsitektur Teknis & Mitigasi Deployment Vercel

Proyek ini menggunakan **HTML, CSS, JavaScript**, database **SQLite**, dan di-*deploy* ke **Vercel** (`vercel.app`). Untuk mengantisipasi sifat *ephemeral filesystem* (penyimpanan sementara) pada Serverless Vercel:

1. **Database SQLite Permanen (Turso / LibSQL)**:
   - Menggunakan `@libsql/client` yang 100% kompatibel dengan sintaks SQLite.
   - Saat pengembangan lokal dapat menggunakan file SQLite lokal (`file:./database/local.db`), sedangkan di produksi Vercel terhubung ke instance gratis **Turso Cloud SQLite** sehingga perubahan CRUD dari Panel Admin tersimpan permanen.
2. **Penyimpanan Unggah Foto Layanan (Vercel Blob / Cloudinary)**:
   - Foto layanan yang diunggah melalui `/api/upload` (format `JPG/PNG`, ukuran maks `2 MB`) disimpan ke **Vercel Blob** (atau Cloudinary Free Tier).
   - URL publik hasil unggahan disimpan ke kolom `foto_path` pada tabel `layanan`.

---

## Spesifikasi & Daftar Periksa Wajib

- [x] **Skema Database (`database/schema.sql`)**:
  - Tabel `layanan`: `id`, `nama_layanan`, `kategori` (*Baby & Kids Massage*, *Baby Spa*, *Kids Spa*, *Massage Terapi*), `harga`, `deskripsi` (maks 300 karakter), `foto_path`, `alt_text`, dan `status_aktif` (boolean).
  - Tabel `admin`: menyimpan `username` dan `password_hash` menggunakan `bcrypt`.
- [ ] **Validasi Formulir Panel Admin (`public/js/admin.js` & `api/layanan.js`)**:
  - Menampilkan pesan error langsung di halaman (*inline error message*) jika ada kolom kosong, `harga` bukan angka atau `< 0`, deskripsi `> 300` karakter, atau format/ukuran foto tidak sesuai (`JPG/PNG`, maks `2 MB`).
- [ ] **SEO Dasar di Semua Halaman Publik**:
  - Tag `<title>` unik per halaman, `<meta name="description">`, atribut `alt` pada setiap gambar, dan `<meta property="og:image">`.
- [ ] **Responsivitas & Navigasi**:
  - Tampilan rapi pada lebar layar ponsel `360 px` tanpa *horizontal scroll*.
  - Tombol WhatsApp (`081332487575`) dan tautan Google Maps dapat diakses maksimal **2 kali klik** dari Beranda.

---

## Daftar Branch & Alur Kerja Git

| Nama Branch | Kegunaan |
| :--- | :--- |
| `main` | Branch produksi utama (terhubung ke deployment utama Vercel & dilindungi *Branch Protection*) |
| `develop` | Branch integrasi untuk menggabungkan fitur sebelum dinaikkan ke `main` |
| `feat/frontend-public` | Pengembangan halaman publik (`index`, `profil`, `layanan`, `kontak`), SEO, dan responsivitas `360px` |
| `feat/ui-ux-admin` | Pengembangan tampilan & interaksi Panel Admin (`login`, `dashboard`, validasi form inline) |
| `feat/backend-api-db` | Pengembangan koneksi database SQLite/Turso (`schema.sql`, `seed.sql`) dan endpoint `/api/*` |

---

## Cara Menjalankan Proyek Secara Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/FarrVel/almira-baby-spa-web.git
   cd almira-baby-spa-web
   ```
2. **Instal dependensi**:
   ```bash
   npm install
   ```
3. **Salin konfigurasi environment**:
   ```bash
   cp .env.example .env
   ```
4. **Jalankan server pengembangan lokal**:
   ```bash
   npm run dev
   ```
