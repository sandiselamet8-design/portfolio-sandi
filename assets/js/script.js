// =========================================
// 1. TOGGLE MENU MOBILE (HP)
// =========================================
const btnMobile = document.getElementById('btn-mobile');
const menuMobile = document.getElementById('menu-mobile');

// Ketika tombol hamburger diklik, munculkan/sembunyikan menu
if (btnMobile && menuMobile) {
    btnMobile.addEventListener('click', () => {
        menuMobile.classList.toggle('hidden');
    });

    // Ketika salah satu link di dalam menu HP diklik, tutup menunya otomatis
    const mobileLinks = menuMobile.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuMobile.classList.add('hidden');
        });
    });
}

// =========================================
// 2. EFEK NAVBAR SAAT DI-SCROLL
// =========================================
// Membuat navbar memiliki bayangan (shadow) saat halaman digeser ke bawah
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('shadow-sm', 'bg-white/90');
    } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('shadow-sm', 'bg-white/90');
    }
});