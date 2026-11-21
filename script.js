const produk = [
    { id: 1,  nama: "Juventus Home",          klub: "Juventus",          liga: "Serie A",        harga: 1099000, foto: ["img/juventus-1.webp", "img/juventus-2.webp", "img/juventus-3.webp"] },
    { id: 2,  nama: "AC Milan Home",          klub: "AC Milan",          liga: "Serie A",        harga: 1099000, foto: ["img/milan-1.webp", "img/milan-2.webp", "img/milan-3.webp"] },
    { id: 3,  nama: "Inter Milan Home",       klub: "Inter Milan",       liga: "Serie A",        harga: 1099000, foto: ["img/inter-1.webp", "img/inter-2.webp", "img/inter-3.webp"] },
    { id: 4,  nama: "AS Roma Home",           klub: "AS Roma",           liga: "Serie A",        harga: 999000,  foto: ["img/roma-1.webp", "img/roma-2.webp", "img/roma-3.webp"] },
    { id: 5,  nama: "Real Madrid Home",       klub: "Real Madrid",       liga: "La Liga",        harga: 1199000, foto: ["img/madrid-1.webp", "img/madrid-2.webp", "img/madrid-3.webp"] },
    { id: 6,  nama: "Barcelona Home",         klub: "FC Barcelona",      liga: "La Liga",        harga: 1199000, foto: ["img/barca-1.webp", "img/barca-2.webp", "img/barca-3.webp"] },
    { id: 7,  nama: "Manchester United Home", klub: "Manchester United", liga: "Premier League", harga: 1149000, foto: ["img/mu-1.webp", "img/mu-2.webp", "img/mu-3.webp"] },
    { id: 8,  nama: "Liverpool Home",         klub: "Liverpool",         liga: "Premier League", harga: 1149000, foto: ["img/lfc-1.avif", "img/lfc-2.avif", "img/lfc-3.avif"] },
    { id: 9,  nama: "Timnas Indonesia Home",  klub: "Timnas Indonesia",  liga: "Timnas",         harga: 899000,  foto: ["img/idn-1.webp", "img/idn-2.webp", "img/idn-3.webp"] },
    { id: 10, nama: "Timnas Italia Home",     klub: "Timnas Italia",     liga: "Timnas",         harga: 999000,  foto: ["img/ita-1.webp", "img/ita-2.webp", "img/ita-3.webp"] }
];

// ----- Fungsi bantu -----
function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function cariProduk(id) {
    return produk.find(p => p.id == id);
}

function htmlFoto(p, indeks) {
    return `<img class="foto" src="${p.foto[indeks]}" alt="${p.nama}">`;
}

// ----- Keranjang (disimpan di localStorage) -----
function ambilKeranjang() {
    try {
        return JSON.parse(localStorage.getItem("keranjang")) || {};
    } catch (e) {
        return {};
    }
}

function simpanKeranjang(keranjang) {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    updateJumlah();
}

function updateJumlah() {
    const keranjang = ambilKeranjang();
    let total = 0;
    for (const kunci in keranjang) {
        total += keranjang[kunci];
    }
    document.getElementById("jumlah-keranjang").textContent = total;
}

// ----- Halaman katalog (index.html) -----
const tombolFilter = document.querySelectorAll(".filter button");
const petaLiga = { "#serie-a": "Serie A", "#la-liga": "La Liga", "#premier-league": "Premier League", "#timnas": "Timnas" };

function tampilkanProduk(liga) {
    const wadah = document.getElementById("daftar-produk");
    if (!wadah) return;
    wadah.innerHTML = "";

    produk
        .filter(p => liga === "semua" || p.liga === liga)
        .forEach(p => {
            const kartu = document.createElement("a");
            kartu.className = "kartu";
            kartu.href = "produk.html?id=" + p.id;
            kartu.innerHTML = `
                <div class="kartu-gambar">${htmlFoto(p, 0)}</div>
                <div class="kartu-isi">
                    <span class="badge">${p.liga}</span>
                    <h3 class="nama">${p.nama}</h3>
                    <p class="harga-kartu">${rupiah(p.harga)}</p>
                    <span class="kartu-footer">Lihat Detail →</span>
                </div>
            `;
            wadah.appendChild(kartu);
        });
}

// Menandai tombol filter yang aktif, lalu menampilkan produk liga itu
function pilihLiga(liga) {
    tombolFilter.forEach(t => t.classList.toggle("aktif", t.dataset.liga === liga));
    tampilkanProduk(liga);
}

tombolFilter.forEach(t => {
    t.addEventListener("click", () => pilihLiga(t.dataset.liga));
});

// Link sidebar seperti index.html#serie-a ikut memfilter katalog
function filterDariAlamat() {
    const liga = petaLiga[location.hash] || "semua";
    pilihLiga(liga);

    const koleksi = document.getElementById("koleksi");
    if (koleksi && liga !== "semua") {
        koleksi.scrollIntoView();
    }
}

// ----- Halaman detail (produk.html) -----
function tampilkanDetail() {
    const wadah = document.getElementById("detail");
    if (!wadah) return;

    const p = cariProduk(new URLSearchParams(location.search).get("id"));
    if (!p) {
        wadah.innerHTML = "<p>Produk tidak ditemukan. <a href='index.html'>Kembali ke koleksi</a></p>";
        return;
    }

    document.title = p.nama + " - La Maglia";
    let ukuran = "M";

    wadah.innerHTML = `
        <div class="detail-gambar">
            <div id="area-foto" class="slider-foto"></div>
            <button id="foto-kiri" class="panah kiri" aria-label="Foto sebelumnya">&#8249;</button>
            <button id="foto-kanan" class="panah kanan" aria-label="Foto berikutnya">&#8250;</button>
            <span id="nomor-foto" class="nomor-foto"></span>
        </div>
        <div class="detail-info">
            <span class="badge">${p.liga}</span>
            <h1>${p.nama}</h1>
            <p class="harga-detail">${rupiah(p.harga)}</p>
            <p class="deskripsi">Jersey kandang ${p.klub} dengan bahan ringan dan nyaman dipakai, cocok untuk menonton pertandingan maupun dipakai sehari-hari.</p>

            <h4>Pilih Ukuran</h4>
            <div class="ukuran">
                <button>S</button>
                <button class="aktif">M</button>
                <button>L</button>
                <button>XL</button>
            </div>

            <button id="tambah" class="btn btn-putih">Tambah ke Keranjang</button>
            <p id="pesan" class="pesan"></p>
        </div>
    `;

    // Slider foto: posisi = nomor foto yang tampil (mulai dari 0)
    const jumlahFoto = p.foto.length;
    let posisi = 0;

    function tampilkanFoto() {
        document.getElementById("area-foto").innerHTML = htmlFoto(p, posisi);
        document.getElementById("nomor-foto").textContent = (posisi + 1) + " / " + jumlahFoto;
    }

    // arah: -1 = foto sebelumnya, 1 = foto berikutnya (berputar lewat %)
    function gantiFoto(arah) {
        posisi = (posisi + arah + jumlahFoto) % jumlahFoto;
        tampilkanFoto();
    }

    document.getElementById("foto-kiri").addEventListener("click", () => gantiFoto(-1));
    document.getElementById("foto-kanan").addEventListener("click", () => gantiFoto(1));
    tampilkanFoto();

    // Pilih ukuran
    const tombolUkuran = wadah.querySelectorAll(".ukuran button");
    tombolUkuran.forEach(tombol => {
        tombol.addEventListener("click", () => {
            tombolUkuran.forEach(t => t.classList.toggle("aktif", t === tombol));
            ukuran = tombol.textContent;
        });
    });

    // Tambah ke keranjang (kunci: "idProduk-ukuran", contoh "1-M")
    document.getElementById("tambah").addEventListener("click", () => {
        const keranjang = ambilKeranjang();
        const kunci = p.id + "-" + ukuran;
        keranjang[kunci] = (keranjang[kunci] || 0) + 1;
        simpanKeranjang(keranjang);
        document.getElementById("pesan").textContent = "✓ " + p.nama + " (" + ukuran + ") masuk keranjang";
    });
}

// ----- Halaman keranjang (keranjang.html) -----
function tampilkanKeranjang() {
    const wadah = document.getElementById("isi-keranjang");
    if (!wadah) return;

    const keranjang = ambilKeranjang();
    const daftarKunci = Object.keys(keranjang);
    let total = 0;
    wadah.innerHTML = "";

    if (daftarKunci.length === 0) {
        wadah.innerHTML = "<p class='kosong'>Keranjang masih kosong. <a href='index.html'>Belanja dulu yuk!</a></p>";
    }

    daftarKunci.forEach(kunci => {
        const [id, ukuran] = kunci.split("-");
        const p = cariProduk(id);
        if (!p) return;
        const jumlah = keranjang[kunci];
        total += p.harga * jumlah;

        const baris = document.createElement("div");
        baris.className = "baris";
        baris.innerHTML = `
            <div class="thumb">${htmlFoto(p, 0)}</div>
            <div class="info">
                <h3><a href="produk.html?id=${p.id}">${p.nama}</a></h3>
                <p>Ukuran: ${ukuran}</p>
                <p class="harga-kartu">${rupiah(p.harga)}</p>
            </div>
            <div class="jumlah">
                <button class="kecil">-</button>
                <span>${jumlah}</span>
                <button class="kecil">+</button>
            </div>
            <button class="hapus">Hapus</button>
        `;
        const tombol = baris.querySelectorAll("button");
        tombol[0].addEventListener("click", () => ubahJumlah(kunci, -1));
        tombol[1].addEventListener("click", () => ubahJumlah(kunci, 1));
        tombol[2].addEventListener("click", () => ubahJumlah(kunci, -jumlah)); // hapus = kurangi sebanyak jumlahnya
        wadah.appendChild(baris);
    });

    document.getElementById("total").textContent = rupiah(total);
}

function ubahJumlah(kunci, perubahan) {
    const keranjang = ambilKeranjang();
    keranjang[kunci] += perubahan;
    if (keranjang[kunci] <= 0) {
        delete keranjang[kunci];
    }
    simpanKeranjang(keranjang);
    tampilkanKeranjang();
}

const tombolBayar = document.getElementById("bayar");
if (tombolBayar) {
    tombolBayar.addEventListener("click", () => {
        if (Object.keys(ambilKeranjang()).length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        alert("Terima kasih! Pesanan kamu diterima.");
        simpanKeranjang({}); // kosongkan keranjang
        tampilkanKeranjang();
    });
}

// ----- Sidebar menu -----
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function aturMenu(buka) {
    sidebar.classList.toggle("aktif", buka);
    overlay.classList.toggle("aktif", buka);
}

document.getElementById("tombol-menu").addEventListener("click", () => aturMenu(true));
document.getElementById("tutup-menu").addEventListener("click", () => aturMenu(false));
overlay.addEventListener("click", () => aturMenu(false));
sidebar.querySelectorAll("nav a").forEach(a => a.addEventListener("click", () => aturMenu(false)));

// ----- Mode terang / gelap (default: gelap) -----
const tombolTema = document.getElementById("tombol-tema");

function aturTema(terang) {
    document.body.classList.toggle("terang", terang);
    tombolTema.textContent = terang ? "🌙 Mode Gelap" : "☀️ Mode Terang";
    localStorage.setItem("tema", terang ? "terang" : "gelap");
}

tombolTema.addEventListener("click", () => {
    aturTema(!document.body.classList.contains("terang"));
});

// ----- Dijalankan saat halaman dibuka -----
aturTema(localStorage.getItem("tema") === "terang");
updateJumlah();
filterDariAlamat();
window.addEventListener("hashchange", filterDariAlamat);
tampilkanDetail();
tampilkanKeranjang();
