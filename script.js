// --- CẤU HÌNH ---
const heartEmojis = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '💖', '💗', '💓', '🐻', '✨'];

// --- PASSWORD ---
const CORRECT_PASS = "9/2/2004";

// --- NỘI DUNG THƯ (PAGE 2) ---
const finalLetterText = "Gửi em, người anh thích !<br><br>Chúc mừng đã bắt được trái tim anh!<br>Thực ra anh đã muốn trái tim này bị bắt lâu rồi.<br>Có lẽ nó chỉ muốn đứng đợi em.<br><br>Nhân ngày đặc biệt này, anh muốn nói là ...<br>Anh thích em nhiều lắm! Làm người yêu anh nhá? ❤️";

// --- NỘI DUNG PAGE 1 ---
const page1Messages = [
    "Chúc mừng sinh nhật em! 🎂",
    "Chúc em tuổi mới luôn vui vẻ, hạnh phúc và xinh đẹp như hiện tại.",
    "Anh thích em luôn nở nụ cười trên môi...",
    "Hãy giữ mãi nụ cười ấy để anh có thể thấy vui mỗi khi gặp lại em✨"
];

// --- GAME CONFIG ---
let clickCount = 0;
const funnyReactions = [
    { text: "Lêu lêu 😜", img: "meme0.png" },
    { text: "Hụt rồi nhe 🤪", img: "meme1.png" },
    { text: "Chậm quá 🐢", img: "meme2.png" },
    { text: "Bắt em đi 💃", img: "meme3.png" },
    { text: "Cố lên nè 😂", img: "meme4.png" },
    { text: "Sắp được rồi 🤣", img: "meme5.png" },
    { text: "Thương quá 🥰", img: "meme6.png" }
];
const maxDodges = funnyReactions.length;
let autoMoveTimer; let typeWriterTimer; let isLoaded = false;
// 🔥 BIẾN KIỂM TRA ĐÃ CHƠI CHƯA
let isGamePlayed = false;

// Elements
const modelViewer = document.querySelector("#interaction-viewer");
const progressBar = document.querySelector(".progress-bar"); const updateBar = document.querySelector(".update-bar");
const textElement = document.getElementById('typing-text');
const specialHeart = document.getElementById('special-heart');
const winScreen = document.getElementById('win-screen');
const mainInterface = document.getElementById('main-interface');
const bgMusic = document.getElementById('bg-music');
const secretMusic = document.getElementById('secret-music');
const letterMusic = document.getElementById('letter-music');
const envelopeContainer = document.getElementById('envelope-container');
const letterContentArea = document.getElementById('letter-content-area');
const hotspotBtn = document.querySelector('.hotspot-heart-3d');
const wheelModal = document.getElementById('wheel-modal'); const resultModal = document.getElementById('result-modal');
const rainContainer = document.getElementById('rain-container');
const sparkleContainer = document.getElementById('sparkle-container');
const bgVideo = document.getElementById('bg-video');
const loginModal = document.getElementById('login-modal');

// --- HÀM KIỂM TRA MẬT KHẨU ---
window.checkPassword = function() {
    const input = document.getElementById('password-input').value.trim();
    const errorMsg = document.getElementById('error-msg');

    if (input === CORRECT_PASS) {
        loginModal.style.opacity = '0';
        setTimeout(() => { loginModal.classList.add('hidden'); }, 500);
        if(bgMusic) { bgMusic.volume = 0.5; bgMusic.play().catch(e=>{}); }
    } else {
        errorMsg.classList.remove('hidden');
        document.querySelector('.login-box').animate([
            { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
}

// --- LOADING ---
modelViewer.addEventListener('progress', (event) => {
    const percentage = event.detail.totalProgress * 100; updateBar.style.width = `${percentage}%`;
    if (percentage === 100 && !isLoaded) {
        isLoaded = true; progressBar.classList.add('hide');
        setTimeout(playPage1MessageLoop, 500);
        setTimeout(spawnSpecialHeart, 3000);
    }
});

// --- LOGIC CHỮ CHẠY PAGE 1 ---
let p1MsgIndex = 0; let p1CharIndex = 0; let p1IsDeleting = false; let p1TypeTimer;
function playPage1MessageLoop() {
    const currentMessage = page1Messages[p1MsgIndex];
    if (p1IsDeleting) { textElement.innerText = currentMessage.substring(0, p1CharIndex - 1); p1CharIndex--; }
    else { textElement.innerText = currentMessage.substring(0, p1CharIndex + 1); p1CharIndex++; }
    let typeSpeed = p1IsDeleting ? 30 : 80;
    if (!p1IsDeleting && p1CharIndex === currentMessage.length) { typeSpeed = 2500; p1IsDeleting = true; }
    else if (p1IsDeleting && p1CharIndex === 0) { p1IsDeleting = false; p1MsgIndex = (p1MsgIndex + 1) % page1Messages.length; typeSpeed = 500; }
    p1TypeTimer = setTimeout(playPage1MessageLoop, typeSpeed);
}

// --- 🔥 SỰ KIỆN BẤM TIM GẤU (QUÀ BÍ MẬT) 🔥 ---
if (hotspotBtn) {
    hotspotBtn.onclick = (e) => {
        e.preventDefault();

        // KIỂM TRA: Nếu đã chơi rồi thì hiện kết quả luôn
        if (isGamePlayed) {
            resultModal.classList.remove('hidden');
            return; // Dừng lại, không chạy nhạc hay mở vòng quay nữa
        }

        // Nếu CHƯA chơi thì mới chạy nhạc và mở vòng quay
        if(bgMusic) bgMusic.pause();
        if(secretMusic) {
            secretMusic.currentTime = 0;
            secretMusic.volume = 1.0;
            secretMusic.play();
        }
        wheelModal.classList.remove('hidden');
    };
}

// --- GAME TIM BAY ---
function spawnSpecialHeart() {
    specialHeart.classList.remove('hidden'); specialHeart.innerText = "💖";
    specialHeart.classList.add('initial-state'); specialHeart.classList.remove('invisible');
    autoMoveLoop();
}
function autoMoveLoop() {
    moveHeartRandomly();
    autoMoveTimer = setTimeout(autoMoveLoop, Math.random() * 500 + 1500 );
}
function moveHeartRandomly() {
    specialHeart.classList.add('invisible');
    setTimeout(() => {
        specialHeart.style.left = (Math.random() * (window.innerWidth - 100)) + 'px';
        specialHeart.style.top = (Math.random() * (window.innerHeight - 100)) + 'px';
        specialHeart.classList.remove('invisible');
    }, 200);
}
specialHeart.addEventListener('click', (e) => {
    e.stopPropagation(); clearTimeout(autoMoveTimer);
    if (clickCount < maxDodges) {
        const reaction = funnyReactions[clickCount]; moveHeartRandomly(); specialHeart.classList.remove('initial-state');
        specialHeart.innerHTML = `<img src="${reaction.img}" class="game-image"><div class="game-text-overlay">${reaction.text}</div>`;
        clickCount++; autoMoveLoop();
    } else { triggerWin(); }
});

// --- CHIẾN THẮNG & CHUYỂN PAGE 2 ---
function triggerWin() {
    clearTimeout(autoMoveTimer); clearTimeout(p1TypeTimer);
    specialHeart.classList.add('hidden');
    mainInterface.style.display = 'none';
    winScreen.classList.remove('hidden');

    // Tắt toàn bộ âm thanh
    if(bgMusic) bgMusic.pause();
    if(secretMusic) { secretMusic.pause(); secretMusic.currentTime = 0; }

    const videoBg = document.getElementById('bg-video');
    if (videoBg) { videoBg.muted = true; videoBg.play().catch(e=>{}); videoBg.classList.add('blur-mode'); }

    envelopeContainer.style.display = 'block';
}

// --- MỞ THƯ ---
window.openLetter = function() {
    envelopeContainer.style.opacity = '0';
    setTimeout(() => { envelopeContainer.style.display = 'none'; }, 500);
    if (bgVideo) { bgVideo.classList.remove('blur-mode'); bgVideo.classList.add('clear-mode'); }

    setTimeout(() => {
        letterContentArea.classList.remove('hidden');
        if(letterMusic) { letterMusic.volume = 1.0; letterMusic.play().catch(e=>{}); }
        finalLetterElement.innerHTML = ""; letterIndex = 0; startFinalTyping();
    }, 500);
}

let letterIndex = 0;
const finalLetterElement = document.getElementById('final-letter-content');
function startFinalTyping() {
    if (letterIndex < finalLetterText.length) {
        if (finalLetterText.substring(letterIndex, letterIndex + 4) === "<br>") {
            finalLetterElement.innerHTML += "<br>"; letterIndex += 4;
        } else {
            finalLetterElement.innerHTML += finalLetterText.charAt(letterIndex); letterIndex++;
        }
        setTimeout(startFinalTyping, 70);
    }
}

// --- VÒNG QUAY ---
const prizes = ["1 Cái Ôm 🤗", "10k 💸", "Buffet 🦞", "Cái Nịt 🤣", "Trà Sữa 🧋", "Hôn Má 💋"];
const colors = ["#FFB7B2", "#FFF0F5", "#E2F0CB", "#FF9AA2", "#C7CEEA", "#FFDAC1"];
const canvas = document.getElementById("canvas"); const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn"); let startAngle = 0; const arc = Math.PI / (prizes.length / 2);
function drawWheel() { ctx.clearRect(0, 0, canvas.width, canvas.height); const centerX = 160; const centerY = 160; const outsideRadius = 145; const textRadius = 105; for (let i = 0; i < prizes.length; i++) { const angle = startAngle + i * arc; ctx.fillStyle = colors[i]; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false); ctx.lineTo(centerX, centerY); ctx.fill(); ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.stroke(); ctx.save(); ctx.fillStyle = "#4a4a4a"; ctx.font = 'bold 15px Nunito'; ctx.translate(centerX + Math.cos(angle + arc / 2) * textRadius, centerY + Math.sin(angle + arc / 2) * textRadius); ctx.rotate(angle + arc / 2 + Math.PI / 2); const text = prizes[i]; ctx.shadowColor = "rgba(255,255,255,0.8)"; ctx.shadowBlur = 4; ctx.fillText(text, -ctx.measureText(text).width / 2, 0); ctx.restore(); } }
drawWheel();

// 🔥 XỬ LÝ NÚT QUAY 🔥
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    const rotateAmount = 360 * 8 + 120; // Quay vào Buffet
    canvas.style.transform = `rotate(${rotateAmount}deg)`;

    setTimeout(() => {
        resultModal.classList.remove('hidden');
        confettiEffect();
        spinBtn.disabled = false;

        // 🔥 ĐÁNH DẤU ĐÃ CHƠI XONG
        isGamePlayed = true;

    }, 5000);
});

function closeWheel() { wheelModal.classList.add('hidden'); }
function closeResult() { resultModal.classList.add('hidden'); wheelModal.classList.add('hidden'); }

// --- HIỆU ỨNG KHÁC ---
let rainInterval;
function createHeart() { if (!rainContainer) return; const heart = document.createElement('div'); heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]; heart.classList.add('heart-drop'); heart.style.left = Math.random() * 100 + 'vw'; heart.style.fontSize = (Math.random() * 20 + 10) + 'px'; const duration = Math.random() * 3 + 2; heart.style.animationDuration = duration + 's'; rainContainer.appendChild(heart); setTimeout(() => { heart.remove(); }, duration * 1000); }
rainInterval = setInterval(createHeart, 300);
function createSparkle() { if (!sparkleContainer) return; const sparkle = document.createElement('div'); sparkle.classList.add('sparkle'); const randomX = Math.random() * 300 - 150; const randomY = Math.random() * 300 - 150; sparkle.style.left = `calc(50% + ${randomX}px)`; sparkle.style.top = `calc(50% + ${randomY}px)`; const size = Math.random() * 5 + 3; sparkle.style.width = `${size}px`; sparkle.style.height = `${size}px`; sparkle.style.animationDuration = (Math.random() * 1 + 1.5) + 's'; sparkleContainer.appendChild(sparkle); setTimeout(() => { sparkle.remove(); }, 2500); }
setInterval(createSparkle, 150);
function confettiEffect() { for(let i=0; i<30; i++) setTimeout(createHeart, i * 30); }