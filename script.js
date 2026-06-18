// =========================================================
// 1. HEXAGON DASHBOARD & AI CORE PANEL
// =========================================================
let activeHexData = null; 

function selectHex(element, title, desc, colorVar, targetUrl, accuracy, latency, statusLabel) {
    // 1. ล้างสถานะ Active ออกจากรังผึ้งทุกตัว
    document.querySelectorAll('.hex-box').forEach(hex => hex.classList.remove('active'));
    
    // 2. ใส่สถานะ Active ให้ตัวที่ถูกคลิก
    element.classList.add('active');

    // 3. บันทึกชุดข้อมูล
    activeHexData = { title, desc, colorVar, targetUrl, accuracy, latency, statusLabel };
    
    // 4. เรียกฟังก์ชันอัปเดตหน้าจอ
    renderHexInfo();
}

function renderHexInfo() {
    if (!activeHexData) return;

    const { title, desc, colorVar, targetUrl, accuracy, latency, statusLabel } = activeHexData;

    // --- จัดการ UI แสดงผล (สลับ Idle -> Active) ---
    const activeUI = document.getElementById('activeUI');
    const idleUI = document.getElementById('idleUI');
    if (idleUI) idleUI.style.display = 'none';
    if (activeUI) activeUI.style.display = 'flex';

    // --- อัปเดตข้อความ ---
    const titleEl = document.getElementById('d-title');
    const descEl = document.getElementById('d-desc');
    if (titleEl) titleEl.innerHTML = title;
    if (descEl) descEl.innerHTML = desc;
    
    // --- อัปเดต Metrics ---
    const accEl = document.getElementById('metric-accuracy');
    const latEl = document.getElementById('metric-latency');
    if (accEl) accEl.innerText = accuracy || '--';
    if (latEl) latEl.innerText = latency || '--';

    // --- อัปเดต Tag และ Status ---
    const tagElement = document.getElementById('activeTag');
    if (tagElement) {
        tagElement.innerHTML = 'SYSTEM STATUS: ' + statusLabel;
        tagElement.style.color = colorVar;
    }

    const statusPill = document.getElementById('mock-status-pill');
    if (statusPill) {
        statusPill.innerText = statusLabel;
        statusPill.style.color = colorVar;
    }

    // --- อัปเดตธีมสีหลักของ Panel (ส่งค่าไป CSS Variable) ---
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.style.setProperty('--panel-theme-color', colorVar);
    }

    // --- อัปเดตปุ่ม Action ---
    const dBtn = document.getElementById('d-btn');
    if (dBtn) {
        dBtn.style.backgroundColor = colorVar;
        // เช็คให้ตัวหนังสือเป็นสีดำถ้าสีพื้นเป็นสีสว่าง
        dBtn.style.color = (colorVar.includes('core') || colorVar.includes('FFD700') || colorVar.includes('or')) ? '#000' : '#fff';
        dBtn.onclick = function() {
            window.location.href = targetUrl;
        };
    }

    // --- อัปเดตกราฟ Sparkline (สุ่มคลื่นจำลอง) ---
    const sparklinePath = document.getElementById('sparkline-path');
    if (sparklinePath) {
        sparklinePath.style.stroke = colorVar;
        const randomY1 = Math.floor(Math.random() * 35) + 10;
        const randomY2 = Math.floor(Math.random() * 35) + 10;
        sparklinePath.setAttribute('d', `M 0 40 Q 50 ${randomY1} 100 45 T 200 ${randomY2} T 300 30`);
    }

    // --- เปลี่ยนรูปภาพ Mockup ตามหัวข้อ (Object Map) ---
    const imageDisplay = document.getElementById('d-image');
    if (imageDisplay) {
        const imageMap = {
            'AI CORE ENGINE': 'https://mindphp.com/images/articles/202001/0001.png',
            'icuCare ENGINE': 'https://mindphp.com/images/articles/202001/0001.png',
            'orCare ENGINE': 'https://mindphp.com/images/articles/202001/0001.png',
            'CareLink SYSTEM': 'https://mindphp.com/images/articles/202001/0001.png',
            'Carehub DATABASE': 'https://mindphp.com/images/articles/202001/0001.png',
            'Custom ENGINE': 'https://mindphp.com/images/articles/202001/0001.png'
        };
        
        // ถ้ารูปตรงกับใน Map ให้แสดงผล ถ้าไม่มีให้คงเดิมไว้
        if (imageMap[title]) {
            imageDisplay.src = imageMap[title];
        }
    }
}

// =========================================================
// 2. IDH SLIDER SYSTEM (Manual Navigation)
// =========================================================
let idhCurrentIndex = 0;
const idhSlides = document.querySelectorAll('.idh-slide');
const idhDots = document.querySelectorAll('.indicator-dot');
const totalIdhSlides = idhSlides.length;

function updateSlideUI() {
    if (totalIdhSlides === 0) return;

    // ล้างสถานะทั้งหมดก่อน
    idhSlides.forEach(s => s.classList.remove('active'));
    idhDots.forEach(d => d.classList.remove('active'));
    
    // ใส่สถานะให้สไลด์ปัจจุบัน
    if (idhSlides[idhCurrentIndex]) idhSlides[idhCurrentIndex].classList.add('active');
    if (idhDots[idhCurrentIndex]) idhDots[idhCurrentIndex].classList.add('active');
}

function manualChangeSlide(direction) {
    if (totalIdhSlides === 0) return;
    
    idhCurrentIndex += direction;
    
    // วนลูปสไลด์
    if (idhCurrentIndex < 0) {
        idhCurrentIndex = totalIdhSlides - 1;
    } else if (idhCurrentIndex >= totalIdhSlides) {
        idhCurrentIndex = 0;
    }
    
    updateSlideUI();
}

function goToSlide(index) {
    idhCurrentIndex = index;
    updateSlideUI();
}

// Initialize Slider เริ่มทำงานครั้งแรก
updateSlideUI();


// =========================================================
// 3. SCROLL ANIMATION (Reveal Effects)
// =========================================================
const observerOptions = { 
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px" 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // หากต้องการให้แสดงเอฟเฟกต์แค่ครั้งเดียวตอนเลื่อนผ่าน ให้เอาคอมเมนต์บรรทัดล่างออก
            // observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));