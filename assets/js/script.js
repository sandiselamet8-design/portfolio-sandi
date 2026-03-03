// =========================================
// 1. TOGGLE MENU MOBILE (HP) YANG LEBIH SMART
// =========================================
const btnMobile = document.getElementById('btn-mobile');
const menuMobile = document.getElementById('menu-mobile');

if (btnMobile && menuMobile) {
    // Memunculkan/menyembunyikan menu saat tombol diklik
    btnMobile.addEventListener('click', (event) => {
        event.stopPropagation(); // Mencegah bentrok dengan klik layar
        menuMobile.classList.toggle('hidden');
    });

    // Menutup menu otomatis jika salah satu link diklik
    const mobileLinks = menuMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuMobile.classList.add('hidden');
        });
    });

    // FITUR TAMBAHAN: Menutup menu jika user mengeklik area kosong di luar menu
    document.addEventListener('click', (event) => {
        // Jika menu sedang terbuka, dan area yang diklik BUKAN menu atau tombolnya
        if (!menuMobile.classList.contains('hidden') && !menuMobile.contains(event.target) && !btnMobile.contains(event.target)) {
            menuMobile.classList.add('hidden');
        }
    });
}


// =========================================
// 2. EFEK NAVBAR SAAT DI-SCROLL (ANTI-LAG)
// =========================================
// Menggunakan ID yang lebih spesifik agar tidak salah deteksi elemen
const navbar = document.getElementById('navbar');

if (navbar) {
    // Tambahkan { passive: true } agar scroll di HP jadul tetap mulus
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            // Cukup mainkan efek shadow dan blur agar Dark Mode tidak rusak
            navbar.classList.add('shadow-md', 'backdrop-blur-xl');
            navbar.classList.remove('shadow-sm', 'border-transparent');
        } else {
            navbar.classList.remove('shadow-md', 'backdrop-blur-xl');
            navbar.classList.add('shadow-sm', 'border-transparent');
        }
    }, { passive: true });
}
