/* Admin Almira — interaksi sisi tampilan saja.
   Login, simpan, hapus, dan ubah status HARUS diproses server (lihat TODO). */

const SERVICES = {
  1: { nama: 'Baby & Kids Massage', kategori: 'pijat',   harga: 35000,  aktif: true,  deskripsi: 'Pijat lembut untuk bayi hingga anak-anak, disesuaikan dengan tahapan usianya. Membantu si kecil lebih rileks dan nyaman serta mendukung tumbuh kembangnya.', alt: 'Pijat lembut untuk bayi dan anak' },
  2: { nama: 'Baby Spa',            kategori: 'spa',     harga: 85000,  aktif: true,  deskripsi: 'Rangkaian relaksasi lengkap untuk bayi usia 3 bulan–1 tahun: senam ringan (gymball), berenang, mandi air hangat, dan pijat bayi. Melatih motorik dan kekuatan otot sejak dini.', alt: 'Bayi berenang di baby spa' },
  3: { nama: 'Kids Spa',            kategori: 'spa',     harga: 100000, aktif: true,  deskripsi: 'Pengalaman spa yang menyenangkan untuk anak usia 2 tahun ke atas. Sudah termasuk pijat relaksasi, masker coklat, berendam bubble, mandi bilas, dan nail art.', alt: 'Anak berendam bubble di kids spa' },
  4: { nama: 'Massage Terapi',      kategori: 'pijat',   harga: 50000,  aktif: true,  deskripsi: 'Pijat kesehatan untuk membantu meredakan keluhan ringan pada anak dengan teknik yang aman dan menenangkan.', alt: 'Terapi pijat untuk anak' },
  5: { nama: 'Paket Selapan',       kategori: 'terapi',  harga: 75000,  aktif: false, deskripsi: 'Paket perawatan tradisional untuk menyambut selapan (35 hari) si kecil: cukur rambut, mandi bilas, bersihkan lidah dan telinga, pijat lembut, dan potong kuku.', alt: 'Paket perawatan selapan bayi' },
  6: { nama: 'Layanan Lain-lain',   kategori: 'lainnya', harga: 10000,  aktif: true,  deskripsi: 'Perawatan tambahan satuan yang praktis dan higienis.', alt: 'Perawatan tambahan satuan' }
};

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const setError = (fieldId, on) => {
    const f = document.getElementById(fieldId);
    if (!f) return;
    f.classList.toggle('has-error', on);
    const msg = $('.field-error', f);
    if (msg) msg.hidden = !on;
  };

  /* ================= LOGIN ================= */
  const loginForm = $('#login-form');
  if (loginForm) {
    const alertBox = $('#login-alert');
    // Server dapat mengarahkan ke login.html?error=1 setelah login gagal
    if (new URLSearchParams(location.search).get('error')) alertBox.hidden = false;

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const u = $('#username').value.trim();
      const p = $('#password').value;
      setError('f-username', !u);
      setError('f-password', !p);
      if (!u || !p) return;

      // TODO: kirim ke server (POST) — verifikasi password ter-hash di server,
      // buat sesi login, lalu arahkan ke dashboard.html. Jika gagal: alertBox.hidden = false.
      // Redirect di bawah hanyalah demo tampilan dan TIDAK mengamankan halaman admin.
      location.href = 'dashboard.html';
    });
  }

  /* ================= DIALOG HAPUS (daftar & form) ================= */
  const dlg = $('#dlg-delete');
  let onConfirm = null;
  const openDelete = (nama, cb) => {
    $('#dlg-name').textContent = nama;
    onConfirm = cb;
    dlg.showModal();
  };
  if (dlg) {
    $('#dlg-cancel').addEventListener('click', () => dlg.close());
    $('#dlg-confirm').addEventListener('click', () => { dlg.close(); onConfirm && onConfirm(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  /* ================= DAFTAR LAYANAN ================= */
  const rows = $('#rows');
  if (rows) {
    const q = $('#q'), fk = $('#f-kategori'), fs = $('#f-status'), empty = $('#empty');

    const apply = () => {
      const term = q.value.trim().toLowerCase();
      let shown = 0;
      $$('tr', rows).forEach(tr => {
        const ok =
          (!term || tr.dataset.nama.toLowerCase().includes(term)) &&
          (!fk.value || tr.dataset.kategori === fk.value) &&
          (!fs.value || tr.dataset.status === fs.value);
        tr.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      empty.style.display = shown ? 'none' : 'block';
    };
    [q, fk, fs].forEach(el => el.addEventListener('input', apply));

    rows.addEventListener('change', e => {
      if (!e.target.classList.contains('toggle')) return;
      const tr = e.target.closest('tr');
      const on = e.target.checked;
      tr.dataset.status = on ? 'aktif' : 'nonaktif';
      $('.status-text', tr).textContent = on ? 'Aktif' : 'Nonaktif';
      // TODO: simpan status ke server
      apply();
    });

    rows.addEventListener('click', e => {
      const btn = e.target.closest('.btn-delete');
      if (!btn) return;
      const tr = btn.closest('tr');
      openDelete(tr.dataset.nama, () => {
        // TODO: hapus di server, lalu hapus baris
        tr.remove();
        apply();
      });
    });
  }

  /* ================= FORM TAMBAH / UBAH ================= */
  const form = $('#service-form');
  if (form) {
    const id = new URLSearchParams(location.search).get('id');
    const data = id && SERVICES[id];
    const alertBox = $('#form-alert');
    const desk = $('#deskripsi'), count = $('#count');
    const file = $('#foto'), dz = $('#dropzone');
    let hasPhoto = false;

    const updateCount = () => { count.textContent = desk.value.length; };
    desk.addEventListener('input', updateCount);

    if (data) {
      $('#form-title').textContent = 'Ubah Layanan';
      $('#nama').value = data.nama;
      $('#kategori').value = data.kategori;
      $('#harga').value = data.harga;
      desk.value = data.deskripsi;
      $('#alt').value = data.alt;
      $('#status').checked = data.aktif;
      hasPhoto = true; // foto lama sudah tersimpan
      updateCount();
      const del = $('#btn-delete');
      del.hidden = false;
      del.addEventListener('click', () =>
        openDelete(data.nama, () => { /* TODO: hapus di server */ location.href = 'dashboard.html'; }));
    }

    // Unggah foto
    const showFile = f => {
      if (!f) return;
      const okType = ['image/jpeg', 'image/png'].includes(f.type);
      const okSize = f.size <= 2 * 1024 * 1024;
      if (!okType || !okSize) {
        hasPhoto = false;
        file.value = '';
        setError('f-foto', true);
        return;
      }
      const img = new Image();
      img.alt = 'Pratinjau foto layanan';
      img.src = URL.createObjectURL(f);
      dz.replaceChildren(img);
      hasPhoto = true;
      setError('f-foto', false);
    };
    $('#pick').addEventListener('click', () => file.click());
    file.addEventListener('change', () => showFile(file.files[0]));
    ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('drag'); }));
    dz.addEventListener('drop', e => {
      const f = e.dataTransfer.files[0];
      if (f) { const dt = new DataTransfer(); dt.items.add(f); file.files = dt.files; showFile(f); }
    });

    // Validasi
    form.addEventListener('submit', e => {
      e.preventDefault();
      const harga = Number($('#harga').value.replace(/[.\s]/g, ''));
      const checks = {
        'f-nama': !!$('#nama').value.trim(),
        'f-harga': Number.isFinite(harga) && harga > 0,
        'f-deskripsi': !!desk.value.trim(),
        'f-foto': hasPhoto,
        'f-alt': !!$('#alt').value.trim()
      };
      let bad = 0;
      Object.entries(checks).forEach(([fid, ok]) => { setError(fid, !ok); if (!ok) bad++; });

      if (bad) {
        alertBox.textContent = `Periksa kembali: ${bad} kolom belum valid.`;
        alertBox.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      alertBox.hidden = true;
      // TODO: kirim ke server (tambah jika tanpa id, ubah jika ada id), lalu:
      location.href = 'dashboard.html';
    });

    // Hapus pesan error saat pengguna mulai memperbaiki
    $$('.input, .textarea, .select', form).forEach(el =>
      el.addEventListener('input', () => setError(el.closest('.field').id, false)));
  }
});