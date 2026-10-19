/**
 * @file form.js — Modern Form Processing & DOM Event Handling.
 * Menyediakan form interaktif untuk memproses input pengguna, validasi real-time,
 * dan menghasilkan output caption promosi dengan zero magic number.
 */

// ============================================================================
// 1. KONSTANTA VALIDASI & KONFIGURASI (ATURAN: TANPA MAGIC NUMBER)
// ============================================================================
const FORM_CONFIG = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 60,
  MIN_PRICE: 1000,
  MAX_PRICE: 100000000,
  CURRENCY_DECIMAL_DIGITS: 0,
  FIRST_CHAR_INDEX: 0,
  REST_CHAR_INDEX: 1,
  EMPTY_LENGTH: 0,
  FEEDBACK_TIMEOUT_MS: 3000,
};

// ============================================================================
// 2. DOM INPUT & ELEMEN MONITORING (ATURAN: DISIMPAN DI ATAS UNTUK MONITORING)
// ============================================================================
const formEl = document.getElementById("productForm");
const inputNama = document.getElementById("nama");
const inputHarga = document.getElementById("harga");
const selectTemplate = document.getElementById("template");
const namaErrorEl = document.getElementById("nama-error");
const hargaErrorEl = document.getElementById("harga-error");
const charCounterEl = document.getElementById("charCounter");
const captionOutputEl = document.getElementById("caption");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const feedbackBannerEl = document.getElementById("feedbackBanner");

// ============================================================================
// 3. TEMPLATE GENERATOR CAPTION
// ============================================================================
const captionTemplates = {
  promo: (nama, harga, tag) => `⚡ PENAWARAN EKSKLUSIF HARI INI! ⚡

Dapatkan ${nama} dengan harga spesial dan stok terbatas! 🔥

💰 Harga Spesial: ${harga}
🛡️ 100% Produk Original & Bergaransi Resmi
📦 Gratis Ongkir ke Seluruh Indonesia
⏳ Promo berlaku terbatas selama persediaan masih ada!

Pesan sekarang sebelum kehabisan 🛒👇
Hubungi kami via DM / WhatsApp untuk pemesanan cepat.

#${tag} #PromoSpesial #DiskonHariIni #BelanjaOnline #ProdukUnggulan`,

  santai: (nama, harga, tag) => `Hai semuanya! 👋✨

Lagi cari referensi ${nama} yang estetik dan berkualitas tinggi? Produk ini cocok banget buat kebutuhan harian kamu! ☕

Cuma dengan ${harga}, kamu sudah bisa nikmati kualitas terbaik.
Cocok juga dijadikan gift untuk teman atau kerabat terdekat 🎁

Tertarik? Langsung kirim pesan ya, kami siap bantu! 🙌

#${tag} #RekomendasiProduk #KualitasTerbaik #Lifestyle #MustHave`,

  formal: (nama, harga, tag) => `Katalog Resmi Produk Nexus Commerce

Dengan bangga kami merilis seri terbaru: ${nama}.

Informasi Nilai Investasi:
Harga Satuan: ${harga}

Spesifikasi & Keunggulan:
- Telah melalui pengujian mutu berstandar industri
- Didukung garansi purna jual resmi
- Layanan pengiriman korporat aman dan terasuransi

Untuk penawaran resmi dan pemesanan partai besar, silakan hubungi perwakilan layanan pelanggan kami.

#${tag} #KatalogResmi #ProdukStandarIndustri #Profesional`,
};

// ============================================================================
// 4. ATURAN VALIDASI
// ============================================================================
const validationRules = {
  nama: (val) => {
    const trimmed = val.trim();
    if (trimmed.length === FORM_CONFIG.EMPTY_LENGTH) {
      return "Nama produk wajib diisi.";
    }
    if (trimmed.length < FORM_CONFIG.MIN_NAME_LENGTH) {
      return `Nama produk minimal ${FORM_CONFIG.MIN_NAME_LENGTH} karakter (saat ini ${trimmed.length}).`;
    }
    if (trimmed.length > FORM_CONFIG.MAX_NAME_LENGTH) {
      return `Nama produk maksimal ${FORM_CONFIG.MAX_NAME_LENGTH} karakter (saat ini ${trimmed.length}).`;
    }
    if (!/\p{L}/u.test(trimmed)) {
      return "Nama produk wajib mengandung karakter huruf.";
    }
    return "";
  },
  harga: (val) => {
    if (!val || val.trim().length === FORM_CONFIG.EMPTY_LENGTH) {
      return "Harga produk wajib diisi.";
    }
    const num = Number(val);
    if (!Number.isInteger(num)) {
      return "Harga harus berupa angka bulat positif tanpa tanda koma.";
    }
    if (num < FORM_CONFIG.MIN_PRICE) {
      return `Harga minimal Rp ${FORM_CONFIG.MIN_PRICE.toLocaleString("id-ID")}.`;
    }
    if (num > FORM_CONFIG.MAX_PRICE) {
      return `Harga maksimal Rp ${FORM_CONFIG.MAX_PRICE.toLocaleString("id-ID")}.`;
    }
    return "";
  },
};

// ============================================================================
// 5. EVENT HANDLERS & LOGIKA DOM
// ============================================================================

/**
 * Validasi field input secara spesifik dan perbarui DOM secara real-time.
 * @param {string} fieldId - "nama" atau "harga".
 * @returns {boolean} Status validitas input.
 */
function validateField(fieldId) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  const errorMessage = validationRules[fieldId](inputEl.value);

  if (errorMessage) {
    errorEl.innerHTML = `⚠️ <span>${errorMessage}</span>`;
  } else {
    errorEl.innerHTML = "";
  }

  inputEl.setAttribute("aria-invalid", errorMessage ? "true" : "false");
  return errorMessage.length === FORM_CONFIG.EMPTY_LENGTH;
}

/**
 * Memperbarui counter karakter untuk input nama produk.
 */
function updateCharCounter() {
  const currentLength = inputNama.value.length;
  charCounterEl.textContent = `${currentLength}/${FORM_CONFIG.MAX_NAME_LENGTH}`;

  if (currentLength > FORM_CONFIG.MAX_NAME_LENGTH) {
    charCounterEl.style.color = "var(--rose)";
  } else {
    charCounterEl.style.color = "var(--text-light)";
  }
}

/**
 * Format string nama menjadi hashtag PascalCase (contoh: "sepatu lari pro" -> "SepatuLariPro").
 * @param {string} text
 * @returns {string}
 */
function toPascalCaseHashtag(text) {
  return text
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((word) => word.length > FORM_CONFIG.EMPTY_LENGTH)
    .map((word) => word.charAt(FORM_CONFIG.FIRST_CHAR_INDEX).toUpperCase() + word.slice(FORM_CONFIG.REST_CHAR_INDEX))
    .join("");
}

/**
 * Format angka ke dalam mata uang Rupiah Indonesia.
 * @param {number} value
 * @returns {string}
 */
function formatRupiah(value) {
  return Number(value).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: FORM_CONFIG.CURRENCY_DECIMAL_DIGITS,
  });
}

/**
 * Tampilkan notifikasi umpan balik sementara (Toast feedback).
 * @param {string} message
 * @param {boolean} isSuccess
 */
function showFeedback(message, isSuccess = true) {
  feedbackBannerEl.innerHTML = `<span>${isSuccess ? "✓" : "⚠️"}</span> <span>${message}</span>`;
  feedbackBannerEl.className = `toast-feedback show ${isSuccess ? "success" : "error"}`;

  setTimeout(() => {
    feedbackBannerEl.className = "toast-feedback";
  }, FORM_CONFIG.FEEDBACK_TIMEOUT_MS);
}

// ============================================================================
// 6. EVENT LISTENER REGISTRATIONS
// ============================================================================

// Real-time input handling saat pengguna mengetik
inputNama.addEventListener("input", () => {
  validateField("nama");
  updateCharCounter();
});

inputHarga.addEventListener("input", () => {
  validateField("harga");
});

// Event Submit Form
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNamaValid = validateField("nama");
  const isHargaValid = validateField("harga");

  if (!isNamaValid || !isHargaValid) {
    if (!isNamaValid) {
      inputNama.focus();
    } else {
      inputHarga.focus();
    }
    showFeedback("Silakan perbaiki kesalahan pada input sebelum melanjutkan.", false);
    return;
  }

  // Pengambilan nilai input via DOM
  const namaVal = inputNama.value.trim();
  const hargaFormatted = formatRupiah(inputHarga.value);
  const selectedTemplateKey = selectTemplate.value;
  const hashtag = toPascalCaseHashtag(namaVal);

  // Manipulasi DOM untuk menampilkan hasil output
  const templateFn = captionTemplates[selectedTemplateKey];
  const generatedCaption = templateFn(namaVal, hargaFormatted, hashtag);

  captionOutputEl.value = generatedCaption;
  copyBtn.disabled = false;
  showFeedback("Caption berhasil di-generate secara dinamis!", true);
});

// Event Salin ke Clipboard
copyBtn.addEventListener("click", async () => {
  if (!captionOutputEl.value) return;

  try {
    await navigator.clipboard.writeText(captionOutputEl.value);
    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = "<span>✓</span> <span>Tersalin ke Clipboard!</span>";
    showFeedback("Teks caption berhasil disalin ke clipboard.", true);

    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
    }, FORM_CONFIG.FEEDBACK_TIMEOUT_MS);
  } catch (err) {
    showFeedback("Gagal menyalin teks ke clipboard.", false);
  }
});

// Event Reset Form
resetBtn.addEventListener("click", () => {
  formEl.reset();
  namaErrorEl.textContent = "";
  hargaErrorEl.textContent = "";
  inputNama.removeAttribute("aria-invalid");
  inputHarga.removeAttribute("aria-invalid");
  captionOutputEl.value = "";
  copyBtn.disabled = true;
  updateCharCounter();
  showFeedback("Form telah direset ke kondisi awal.", true);
});

// Inisialisasi awal saat load
updateCharCounter();
