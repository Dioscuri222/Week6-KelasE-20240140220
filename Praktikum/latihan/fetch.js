/**
 * @file fetch.js — Skrip latihan pengujian Fetch API ke DummyJSON.
 * Dibuat tanpa magic number untuk menguji konektivitas dan struktur respons data produk.
 */

// Konstanta konfigurasi pengujian
const TEST_CONFIG = {
  ENDPOINT: "https://dummyjson.com/products",
  LIMIT: 5,
};

async function testFetchProducts() {
  const url = `${TEST_CONFIG.ENDPOINT}?limit=${TEST_CONFIG.LIMIT}`;
  console.log(`[INFO] Menghubungi API: ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[SUCCESS] Berhasil mengambil ${data.products.length} produk.`);
    console.log("[DATA CONTOH]:", data.products.map((p) => ({
      id: p.id,
      title: p.title,
      price: `$${p.price}`,
      stock: p.stock,
      category: p.category,
    })));
  } catch (err) {
    console.error("[ERROR] Gagal melakukan fetch:", err.message);
  }
}

// Jalankan fungsi pengujian
testFetchProducts();
