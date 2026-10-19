/**
 * @file index.js — Modern Catalog & Fetch API Studio.
 * Menangani pengambilan data dari DummyJSON API, filter real-time,
 * dan rendering kartu produk interaktif dengan zero magic number.
 */

// ============================================================================
// 1. KONSTANTA KONFIGURASI (ATURAN: TANPA MAGIC NUMBER)
// ============================================================================
const CONFIG = {
  PRODUCTS_FETCH_LIMIT: 24,
  LOW_STOCK_THRESHOLD: 10,
  PRICE_DECIMAL_PLACES: 2,
  RATING_DECIMAL_PLACES: 2,
  EMPTY_COUNT: 0,
  HTTP_STATUS_OK: 200,
  FIRST_CHAR_INDEX: 0,
  REST_CHAR_INDEX: 1,
  API_ENDPOINT: "https://dummyjson.com/products",
};

// ============================================================================
// 2. DOM INPUT & ELEMEN MONITORING (ATURAN: DISIMPAN DI ATAS UNTUK MONITORING)
// ============================================================================
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const kpiTotalEl = document.getElementById("kpiTotal");
const kpiCategoryEl = document.getElementById("kpiCategory");
const kpiLowStockEl = document.getElementById("kpiLowStock");

// State penyimpan produk hasil fetch
let stateProducts = [];

// ============================================================================
// 3. FUNGSI PEMBANTU FORMATTER
// ============================================================================

/**
 * Format angka USD menjadi string representatif.
 * @param {number} usd
 * @returns {string}
 */
function formatUsd(usd) {
  return `$${usd.toFixed(CONFIG.PRICE_DECIMAL_PLACES)}`;
}

/**
 * Format rating dengan presisi tetap.
 * @param {number} rating
 * @returns {string}
 */
function formatRating(rating) {
  return rating.toFixed(CONFIG.RATING_DECIMAL_PLACES);
}

// ============================================================================
// 4. RENDERING DOM
// ============================================================================

/**
 * Merender kartu produk ke dalam grid DOM modern.
 * @param {Array<Object>} products - List produk yang akan dirender.
 */
function renderProducts(products) {
  gridEl.innerHTML = "";

  // Update KPI bar di atas untuk monitoring real-time
  kpiTotalEl.textContent = `Total: ${products.length} Produk`;
  const lowStockCount = products.filter((p) => p.stock < CONFIG.LOW_STOCK_THRESHOLD).length;
  kpiLowStockEl.textContent = `Stok Kritis: ${lowStockCount}`;

  if (products.length === CONFIG.EMPTY_COUNT) {
    statusEl.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
      <div style="font-weight: 600; color: var(--text-main);">Tidak ada produk yang cocok</div>
      <div style="font-size: 13px; margin-top: 4px;">Coba gunakan kata kunci pencarian atau kategori lain.</div>
      <button class="btn-retry" style="background: var(--primary);" onclick="resetFilters()">Reset Filter</button>
    `;
    statusEl.classList.remove("error");
    statusEl.style.display = "block";
    return;
  }

  statusEl.style.display = "none";
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const isLowStock = product.stock < CONFIG.LOW_STOCK_THRESHOLD;

    card.innerHTML = `
      <div class="card-media">
        <span class="chip-category">${product.category}</span>
        <span class="chip-stock ${isLowStock ? "critical" : ""}">
          ${isLowStock ? "⚡ Stok Kritis" : "✓ Tersedia"} (${product.stock})
        </span>
        <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-brand">${product.brand || "Original"}</div>
        <h2 class="card-title">${product.title}</h2>
        <div class="card-rating">★ ${formatRating(product.rating)}</div>
        <div class="card-footer">
          <div class="price-container">
            <span class="price-main">${formatUsd(product.price)}</span>
            <span class="price-discount">Hemat ${Math.round(product.discountPercentage)}%</span>
          </div>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
}

/**
 * Mengisi dropdown pilihan kategori unik dari data produk.
 * @param {Array<Object>} products
 */
function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))].sort();

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(CONFIG.FIRST_CHAR_INDEX).toUpperCase() + cat.slice(CONFIG.REST_CHAR_INDEX);
    categorySelect.appendChild(opt);
  });
}

// ============================================================================
// 5. EVENT HANDLING & LOGIKA FILTER/SORT
// ============================================================================

/**
 * Menyaring dan mengurutkan state produk berdasarkan input pengguna di bagian atas.
 */
function applyFiltersAndSort() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;
  const selectedSort = sortSelect.value;

  // Update indikator kategori pada panel monitoring
  kpiCategoryEl.textContent = selectedCategory 
    ? `Kategori: ${selectedCategory.charAt(CONFIG.FIRST_CHAR_INDEX).toUpperCase() + selectedCategory.slice(CONFIG.REST_CHAR_INDEX)}`
    : "Kategori: Semua";

  // Filter kata kunci & kategori
  let result = stateProducts.filter((product) => {
    const matchKeyword = product.title.toLowerCase().includes(keyword) ||
                         (product.brand && product.brand.toLowerCase().includes(keyword));
    const matchCat = selectedCategory ? product.category === selectedCategory : true;
    return matchKeyword && matchCat;
  });

  // Pengurutan (Sort)
  if (selectedSort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(result);
}

/**
 * Mengembalikan input filter ke keadaan awal.
 */
function resetFilters() {
  searchInput.value = "";
  categorySelect.value = "";
  sortSelect.value = "default";
  applyFiltersAndSort();
}

// ============================================================================
// 6. FETCH API (DENGAN LOADING & ERROR HANDLING)
// ============================================================================

/**
 * Mengambil data produk dari API DummyJSON secara asinkron.
 * Menangani state loading dan kemungkinan kegagalan jaringan/HTTP error.
 */
async function fetchProducts() {
  const url = `${CONFIG.API_ENDPOINT}?limit=${CONFIG.PRODUCTS_FETCH_LIMIT}`;

  try {
    statusEl.innerHTML = `
      <div class="spinner"></div>
      <div>Sedang mengambil data produk dari DummyJSON...</div>
    `;
    statusEl.classList.remove("error");
    statusEl.style.display = "block";
    gridEl.innerHTML = "";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server API merespons dengan status HTTP ${response.status}`);
    }

    const data = await response.json();
    stateProducts = data.products;

    populateCategories(stateProducts);
    renderProducts(stateProducts);
  } catch (error) {
    statusEl.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
      <div style="font-weight: 700;">Gagal Memuat Data Produk</div>
      <div style="font-size: 13px; margin: 4px 0 12px;">${error.message}</div>
      <button class="btn-retry" id="retryFetchBtn">Coba Muat Ulang</button>
    `;
    statusEl.classList.add("error");
    statusEl.style.display = "block";

    const retryBtn = document.getElementById("retryFetchBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", fetchProducts);
    }
    console.error("Kesalahan Fetch:", error);
  }
}

// ============================================================================
// 7. INISIALISASI EVENT LISTENERS
// ============================================================================
searchInput.addEventListener("input", applyFiltersAndSort);
categorySelect.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);

document.addEventListener("DOMContentLoaded", fetchProducts);
