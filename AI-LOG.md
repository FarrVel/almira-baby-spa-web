# Log Penggunaan AI (`AI-LOG.md`)

**Proyek:** Website Profil dan Katalog Almira Baby and Kids Spa  
**Kelompok:** PWEB (M) - Kelompok 14  
**Mata Kuliah:** ER234302 Pemrograman Web (M)  

> **Pernyataan Kelompok:**  
> Sesuai peraturan mata kuliah, setiap bantuan atau potongan kode yang dihasilkan dengan bantuan kecerdasan buatan (AI) dicatat pada dokumen ini. Seluruh anggota kelompok bertanggung jawab membaca, menguji, memahami cara kerja kode baris demi baris, dan siap menjelaskannya pada saat ujian lisan.

---

## Panduan Pencatatan

Setiap kali anggota kelompok menggunakan AI untuk membantu pembuatan kerangka halaman, kueri SQL, fungsi JavaScript, maupun *debugging*, wajib menambahkan entri baru pada tabel di bawah ini dengan rincian:
1. **Tanggal & Penanggung Jawab**: Siapa anggota yang meminta bantuan AI.
2. **Berkas / Fitur Terkait**: Path file atau modul yang dikerjakan.
3. **Prompt / Tujuan Penggunaan**: Ringkasan apa yang ditanyakan atau diminta ke AI.
4. **Hasil & Modifikasi Kelompok**: Penjelasan bagian mana yang dipakai, disesuaikan, dan bagaimana cara kerjanya.

---

## Riwayat Penggunaan AI

| No | Tanggal | Anggota | Berkas / Komponen | Prompt / Tujuan Penggunaan | Hasil & Penjelasan Pemahaman Kode |
| :-: | :---: | :--- | :--- | :--- | :--- |
| 1 | 20 Nov 2026 | Farrel Aryasatya Raharjo | Setup Repositori, Struktur Folder, `README.md`, `AI-LOG.md`, `.gitignore`, `.env.example`, `vercel.json`, `package.json` | Membuat inisialisasi awal (*project setup*) sesuai struktur folder proposal, dokumentasi `README.md`, template `AI-LOG.md`, konfigurasi routing `vercel.json`, serta menyiapkan daftar branch proyek. | AI hanya membantu menyiapkan kerangka folder kosong (*placeholder*) dan konfigurasi awal repositori. Seluruh implementasi kode fitur dikerjakan oleh masing-masing anggota kelompok pada branch terkait. |
| 2 | *DD Mmm 2026* | *[Nama Anggota]* | *[Contoh: `public/js/admin.js`]* | *[Contoh: Membantu fungsi validasi ukuran file foto maks 2MB]* | *[Penjelasan cara kerja kode yang digunakan]* |

---

## Pemetaan Pemahaman Kode Anggota (Persiapan Ujian Lisan)

| Anggota | NRP | Bagian Kode yang Dikuasai & Dijelaskan Saat Ujian Lisan |
| :--- | :---: | :--- |
| **Farrel Aryasatya Raharjo** | `5053251036` | Struktur HTML semantik & tag SEO (`public/*.html`), tata letak responsif `360px` (`public/css/style.css`), pengambilan data katalog dinamis (`public/js/main.js`), dan konfigurasi deployment (`vercel.json`). |
| **Nathan Alden** | `5053251024` | Antarmuka Panel Admin (`public/admin/*.html`, `public/css/admin.css`), logika interaksi CRUD & validasi formulir dengan pesan error langsung di halaman (`public/js/admin.js`). |
| **Deara Briliana Putri** | `5053251027` | Skema & relasi data SQLite/Turso (`database/schema.sql`, `database/seed.sql`), autentikasi hash password `bcrypt` (`api/auth.js`), operasi CRUD backend (`api/layanan.js`), dan validasi unggah gambar (`api/upload.js`). |
