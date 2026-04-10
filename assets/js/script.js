(function() {
    // 1. SOUND ENGINE (Respon Suara)
    const synth = window.speechSynthesis;
    function bicara(teks, lang = 'id-ID') {
        if (synth.speaking) synth.cancel(); 
        const pesan = new SpeechSynthesisUtterance(teks);
        pesan.lang = lang;
        pesan.rate = 1.0;
        synth.speak(pesan);
    }

    // Teks respon dua bahasa
    const respon = {
        id: {
            beranda: "Kembali ke beranda.",
            tentang: "Membuka profil profesional Sandi.",
            keahlian: "Menampilkan daftar keahlian kamu.",
            pengalaman: "Membuka riwayat pengalaman kerja.",
            proyek: "Menampilkan portofolio proyek kamu.",
            galeri: "Membuka galeri foto dan sertifikat.",
            kontak: "Menuju bagian kontak.",
            tema: "Tema berhasil diubah.",
            bahasa: "Bahasa diganti ke Inggris.",
            error: "Maaf, perintah tidak dimengerti."
        },
        en: {
            beranda: "Back to home.",
            tentang: "Opening Sandi's professional profile.",
            keahlian: "Showing your skills list.",
            pengalaman: "Opening work experience.",
            proyek: "Showing your projects.",
            galeri: "Opening gallery and certificates.",
            kontak: "Going to contact section.",
            tema: "Theme changed successfully.",
            bahasa: "Language changed to Indonesian.",
            error: "Sorry, I didn't catch that."
        }
    };

    // Cek bahasa aktif di HTML kamu
    const getActiveLang = () => {
        const enElements = document.querySelectorAll('.lang-en');
        // Jika elemen English tidak hidden, berarti sedang mode EN
        const isEn = Array.from(enElements).some(el => !el.classList.contains('lang-hidden'));
        return isEn ? 'en' : 'id';
    };

    // 2. LOGIKA KONTROL (TEMA & BAHASA)
    const handleTema = () => {
        const btnTema = document.getElementById('theme-toggle') || document.getElementById('theme-toggle-mobile');
        if (btnTema) {
            btnTema.click(); // Klik tombol asli agar ikon & logic Tailwind jalan
            const current = getActiveLang();
            bicara(respon[current].tema, current === 'en' ? 'en-US' : 'id-ID');
        }
    };

    const handleBahasa = () => {
        const btnLang = document.getElementById('lang-toggle-btn') || document.getElementById('lang-toggle-mobile');
        if (btnLang) {
            const current = getActiveLang();
            btnLang.click(); // Klik tombol bahasa asli
            // Ucapkan konfirmasi dalam bahasa tujuan
            if (current === 'id') {
                bicara(respon.en.bahasa, 'en-US');
            } else {
                bicara(respon.id.bahasa, 'id-ID');
            }
        }
    };

    // 3. FITUR SUARA (VOICE CONTROL)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID'; // Default pendengaran Indonesia
        
        const btnBicara = document.getElementById('btn-bicara');
        const micPulse = document.getElementById('mic-pulse');

        if (btnBicara) {
            const startListening = () => {
                try {
                    if (navigator.vibrate) navigator.vibrate(50);
                    recognition.start();
                    btnBicara.classList.add('bg-red-600', 'scale-110', 'ring-4', 'ring-red-300');
                } catch(e) {}
            };

            const stopListening = () => {
                recognition.stop();
                btnBicara.classList.remove('bg-red-600', 'scale-110', 'ring-4', 'ring-red-300');
            };

            btnBicara.addEventListener('mousedown', (e) => { e.preventDefault(); startListening(); });
            window.addEventListener('mouseup', stopListening);
            btnBicara.addEventListener('touchstart', (e) => { e.preventDefault(); startListening(); });
            btnBicara.addEventListener('touchend', stopListening);
        }

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            const current = getActiveLang();
            const langCode = current === 'en' ? 'en-US' : 'id-ID';
            const scrollOpt = { behavior: 'smooth', block: 'start' };

            // A. LOGIKA TEMA & BAHASA
            if (command.includes("tema") || command.includes("gelap") || command.includes("terang") || command.includes("mode")) {
                handleTema();
            } 
            else if (command.includes("bahasa") || command.includes("language") || command.includes("inggris") || command.includes("indonesia")) {
                handleBahasa();
            }
            // B. NAVIGASI SECTION (Sesuai ID di HTML kamu)
            else if (command.includes("tentang") || command.includes("profil") || command.includes("about")) {
                document.getElementById('tentang')?.scrollIntoView(scrollOpt);
                bicara(respon[current].tentang, langCode);
            } 
            else if (command.includes("keahlian") || command.includes("skill")) {
                document.getElementById('keahlian')?.scrollIntoView(scrollOpt);
                bicara(respon[current].keahlian, langCode);
            }
            else if (command.includes("pengalaman") || command.includes("kerja") || command.includes("experience")) {
                document.getElementById('pengalaman')?.scrollIntoView(scrollOpt);
                bicara(respon[current].pengalaman, langCode);
            }
            else if (command.includes("proyek") || command.includes("tugas") || command.includes("project")) {
                document.getElementById('proyek')?.scrollIntoView(scrollOpt);
                bicara(respon[current].proyek, langCode);
            }
            else if (command.includes("galeri") || command.includes("foto") || command.includes("gallery")) {
                document.getElementById('galeri')?.scrollIntoView(scrollOpt);
                bicara(respon[current].galeri, langCode);
            }
            else if (command.includes("kontak") || command.includes("hubung") || command.includes("contact")) {
                document.getElementById('kontak')?.scrollIntoView(scrollOpt);
                bicara(respon[current].kontak, langCode);
            }
            else if (command.includes("atas") || command.includes("beranda") || command.includes("home")) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                bicara(respon[current].beranda, langCode);
            } 
            else {
                bicara(respon[current].error, langCode);
            }
        };
    }
})();
(function() {
    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');

    let lastY = 0;
    let isPinching = false; // Status cubitan untuk klik

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        // Mirroring canvas agar gerakan tangan sesuai (kiri kamera = kiri layar)
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            const indexTip = landmarks[8];  // Ujung Telunjuk
            const thumbTip = landmarks[4];  // Ujung Jempol

            // --- 1. LOGIKA SCROLL NATURAL ---
            // Menghitung selisih posisi Y. 
            // Jika tangan bergerak ke atas (nilai Y mengecil), deltaY positif (scroll ke bawah)
            const currentY = indexTip.y;
            const deltaY = (lastY - currentY) * window.innerHeight;

            // Threshold (0.01) agar tidak goyang saat tangan diam
            if (Math.abs(lastY - currentY) > 0.01) {
                window.scrollBy({
                    top: deltaY * 2.5, // Kalibrasi kecepatan scroll
                    behavior: 'auto'
                });
            }
            lastY = currentY;

            // --- 2. LOGIKA KLIK (PINCH) ---
            const distance = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);

            // Jarak cubitan (0.04)
            if (distance < 0.04) {
                if (!isPinching) {
                    isPinching = true;
                    
                    // Koordinat klik (Mirroring X)
                    const screenX = (1 - indexTip.x) * window.innerWidth;
                    const screenY = indexTip.y * window.innerHeight;

                    const element = document.elementFromPoint(screenX, screenY);
                    if (element) {
                        element.click();
                        // Feedback visual
                        element.style.boxShadow = "0 0 15px #0ea5e9";
                        setTimeout(() => element.style.boxShadow = "none", 500);
                    }
                }
            } else {
                isPinching = false;
            }

            // Gambarkan rangka tangan untuk panduan user
            // Karena canvas di-mirror, penggambaran harus hati-hati
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#0ea5e9', lineWidth: 2});
            drawLandmarks(canvasCtx, landmarks, {color: '#ffffff', lineWidth: 1, radius: 2});
        }
        canvasCtx.restore();
    }

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });

    camera.start();
    // Pastikan semua elemen sudah ter-load
window.addEventListener('load', function() {
    const btnMaster = document.getElementById('btn-ai-master');
    const aiMenu = document.getElementById('ai-menu');
    const iconPlus = document.getElementById('icon-plus');
    const canvasKamera = document.getElementById('output_canvas');
    const btnKameraToggle = document.getElementById('btn-kamera-toggle');

    if (btnMaster) {
        btnMaster.onclick = function(e) {
            e.preventDefault();
            // Cek apakah menu sedang hidden
            const isHidden = aiMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Tampilkan Menu
                aiMenu.classList.remove('hidden');
                setTimeout(() => {
                    aiMenu.classList.remove('translate-y-5', 'opacity-0');
                    iconPlus.style.transform = "rotate(45deg)";
                }, 10);
                console.log("Menu AI Terbuka");
            } else {
                // Sembunyikan Menu
                aiMenu.classList.add('translate-y-5', 'opacity-0');
                iconPlus.style.transform = "rotate(0deg)";
                setTimeout(() => {
                    aiMenu.classList.add('hidden');
                }, 300);
                console.log("Menu AI Tertutup");
            }
        };
    }

    // Logika khusus tombol kamera agar kotak biru muncul/hilang
    if (btnKameraToggle) {
        btnKameraToggle.onclick = function() {
            if (canvasKamera) {
                canvasKamera.classList.toggle('hidden');
                // Ubah warna icon jadi biru jika aktif
                btnKameraToggle.classList.toggle('text-sky-600');
                btnKameraToggle.classList.toggle('text-slate-400');
            }
        };
    }
});

})();
