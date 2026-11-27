/**
 * public/js/main.js
 * 1. Navigasi mobile (hamburger)
 * 2. Halaman Layanan: filter kategori + pencarian
 * 3. Halaman Layanan: modal Reservasi Baby Spa -> dikirim lewat WhatsApp
 *    (dibuka oleh tombol apa pun yang punya atribut data-reservasi)
 *
 * Tidak butuh library. Aman dipakai di semua halaman publik:
 * tiap bagian hanya jalan kalau elemennya ada di halaman.
 */
(function () {
  'use strict';

  var WA_NUMBER = '6281332487575'; // format internasional tanpa + / 0 di depan

  /* ------------------------------------------------------------------
   * 1. NAVIGASI MOBILE
   * ---------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');

  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });

    // tutup saat salah satu link diklik
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // tutup saat klik di luar menu
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) setNav(false);
    });

    // tutup dengan tombol Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });

    // kembali ke desktop -> reset
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ------------------------------------------------------------------
   * 2. FILTER & PENCARIAN (layanan.html)
   * ---------------------------------------------------------------- */
  var catalog = document.querySelector('.catalog');

  if (catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll('.card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter]'));
    var searchInput = document.getElementById('search');
    var noResult = document.querySelector('.no-result');
    var activeFilter = 'semua';

    var applyFilter = function () {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var shown = 0;

      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
        var matchCat = activeFilter === 'semua' || cats.indexOf(activeFilter) !== -1;
        var matchText = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        var visible = matchCat && matchText;
        card.hidden = !visible;
        if (visible) shown++;
      });

      if (noResult) noResult.classList.toggle('show', shown === 0);
    };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeFilter = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('active', on);
          c.setAttribute('aria-pressed', String(on));
        });
        applyFilter();
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilter);
  }

  /* ------------------------------------------------------------------
   * 3. MODAL RESERVASI BABY SPA (layanan.html)
   * ---------------------------------------------------------------- */
  if (document.querySelector('[data-reservasi]')) {
    var overlay = null;
    var lastFocus = null;
    var form, fields = {};

    // helper kecil untuk membuat elemen (pakai textContent -> aman dari XSS)
    var el = function (tag, attrs, text) {
      var n = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (text) n.textContent = text;
      return n;
    };

    var makeField = function (id, label, control, hint) {
      var wrap = el('div', { 'class': 'field', 'data-field': id });
      wrap.appendChild(el('label', { 'for': id }, label));
      wrap.appendChild(control);
      var err = el('p', { 'class': 'field-error', id: id + '-error', hidden: '' });
      wrap.appendChild(err);
      if (hint) wrap.appendChild(el('p', { 'class': 'field-hint' }, hint));
      fields[id] = { wrap: wrap, input: control, error: err };
      return wrap;
    };

    var todayISO = function () {
      var d = new Date();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + m + '-' + day;
    };

    var setError = function (id, msg) {
      var f = fields[id];
      f.wrap.classList.toggle('error', !!msg);
      f.input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) {
        f.input.setAttribute('aria-describedby', id + '-error');
        f.error.textContent = msg;
        f.error.hidden = false;
      } else {
        f.input.removeAttribute('aria-describedby');
        f.error.textContent = '';
        f.error.hidden = true;
      }
      return !msg;
    };

    // Jam pelayanan setiap hari 08.00-16.00 (slot per jam)
    var fillHours = function () {
      var sel = fields.jam.input;
      var isToday = fields.hari.input.value === todayISO();
      var nowH = new Date().getHours();
      var keep = sel.value;
      sel.innerHTML = '';
      sel.appendChild(el('option', { value: '' }, 'Pilih jam'));
      for (var h = 8; h <= 16; h++) {
        var label = String(h).padStart(2, '0') + '.00';
        var opt = el('option', { value: label }, label);
        if (isToday && h <= nowH) opt.disabled = true;
        sel.appendChild(opt);
      }
      if (keep) sel.value = keep;
    };

    var validators = {
      ortu: function () {
        return fields.ortu.input.value.trim().length >= 2 ? '' : 'Nama orang tua wajib diisi.';
      },
      anak: function () {
        return fields.anak.input.value.trim().length >= 2 ? '' : 'Nama anak wajib diisi.';
      },
      usia: function () {
        var v = fields.usia.input.value.trim();
        if (!v) return 'Usia anak wajib diisi.';
        if (!/^\d+([.,]\d+)?$/.test(v)) return 'Usia harus berupa angka.';
        if (parseFloat(v.replace(',', '.')) <= 0) return 'Usia harus lebih dari 0.';
        return '';
      },
      hari: function () {
        var v = fields.hari.input.value;
        if (!v) return 'Hari reservasi wajib diisi.';
        if (v < todayISO()) return 'Tanggal tidak boleh sebelum hari ini.';
        return '';
      },
      jam: function () {
        return fields.jam.input.value ? '' : 'Jam reservasi wajib dipilih.';
      }
    };

    var buildModal = function () {
      overlay = el('div', { 'class': 'modal-overlay' });
      var modal = el('div', {
        'class': 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title'
      });

      var close = el('button', { type: 'button', 'class': 'modal-close', 'aria-label': 'Tutup' }, '\u00D7');
      modal.appendChild(close);
      modal.appendChild(el('h2', { id: 'modal-title' }, 'Reservasi Baby Spa'));
      modal.appendChild(el('p', { 'class': 'modal-desc' },
        'Isi data, lalu kirim lewat WhatsApp untuk konfirmasi jadwal.'));

      form = el('form', { novalidate: '' });

      form.appendChild(makeField('ortu', 'Nama orang tua *',
        el('input', { id: 'ortu', type: 'text', placeholder: 'Nama lengkap orang tua', autocomplete: 'name' })));
      form.appendChild(makeField('anak', 'Nama anak *',
        el('input', { id: 'anak', type: 'text', placeholder: 'Nama anak' })));

      // Usia + satuan
      var rowUsia = el('div', { 'class': 'field-row wide-left' });
      rowUsia.appendChild(makeField('usia', 'Usia anak *',
        el('input', { id: 'usia', type: 'text', inputmode: 'decimal', placeholder: 'mis. 6' })));
      var satuan = el('select', { id: 'satuan' });
      satuan.appendChild(el('option', { value: 'bulan' }, 'Bulan'));
      satuan.appendChild(el('option', { value: 'tahun' }, 'Tahun'));
      var fSat = makeField('satuan', 'Satuan', satuan);
      fSat.removeChild(fields.satuan.error);
      rowUsia.appendChild(fSat);
      form.appendChild(rowUsia);

      // Hari + jam
      var rowJadwal = el('div', { 'class': 'field-row' });
      rowJadwal.appendChild(makeField('hari', 'Hari reservasi *',
        el('input', { id: 'hari', type: 'date', min: todayISO() })));
      rowJadwal.appendChild(makeField('jam', 'Jam reservasi *',
        el('select', { id: 'jam' }), 'Sesuai jam pelayanan 08.00-16.00'));
      form.appendChild(rowJadwal);

      form.appendChild(el('button', { type: 'submit', 'class': 'btn btn-block' }, 'Reservasi via WhatsApp'));
      modal.appendChild(form);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      fillHours();

      // validasi saat user selesai mengisi
      ['ortu', 'anak', 'usia', 'hari', 'jam'].forEach(function (id) {
        fields[id].input.addEventListener('blur', function () { setError(id, validators[id]()); });
        fields[id].input.addEventListener('input', function () {
          if (fields[id].wrap.classList.contains('error')) setError(id, validators[id]());
        });
      });
      fields.hari.input.addEventListener('change', fillHours);

      close.addEventListener('click', closeModal);
      overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeModal(); });
      form.addEventListener('submit', onSubmit);
    };

    var onSubmit = function (e) {
      e.preventDefault();
      var firstBad = null;
      ['ortu', 'anak', 'usia', 'hari', 'jam'].forEach(function (id) {
        var ok = setError(id, validators[id]());
        if (!ok && !firstBad) firstBad = fields[id].input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var tgl = new Date(fields.hari.input.value + 'T00:00:00');
      var tglText = tgl.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });

      var msg =
        'Halo Almira, saya ingin reservasi Baby Spa.\n\n' +
        'Nama orang tua: ' + fields.ortu.input.value.trim() + '\n' +
        'Nama anak: ' + fields.anak.input.value.trim() + '\n' +
        'Usia anak: ' + fields.usia.input.value.trim() + ' ' + fields.satuan.input.value + '\n' +
        'Hari reservasi: ' + tglText + '\n' +
        'Jam reservasi: ' + fields.jam.input.value + '\n\n' +
        'Mohon konfirmasi jadwalnya. Terima kasih.';

      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      closeModal();
    };

    var openModal = function (trigger) {
      if (!overlay) buildModal();
      lastFocus = trigger || document.activeElement;
      overlay.classList.add('open');
      document.body.classList.add('modal-open');
      fields.ortu.input.focus();
    };

    var closeModal = function () {
      if (!overlay) return;
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      form.reset();
      Object.keys(fields).forEach(function (id) { if (validators[id]) setError(id, ''); });
      fillHours();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    // Escape + jebakan fokus (Tab tetap di dalam modal)
    document.addEventListener('keydown', function (e) {
      if (!overlay || !overlay.classList.contains('open')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab') return;
      var f = overlay.querySelectorAll('button, input, select');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Semua tombol ber-atribut data-reservasi membuka form
    document.querySelectorAll('[data-reservasi]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });
  }
})();