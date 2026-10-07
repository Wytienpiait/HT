// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Piano key animation on click
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', function() {
        this.style.transform = 'translateY(5px)';
        setTimeout(() => {
            this.style.transform = 'translateY(0)';
        }, 150);
    });
});

// Video stats counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 20);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

// Lazy loading animation for video cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.video-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});


// Dữ liệu bài hát (Bạn có thể thêm bớt bài hát tại đây)
const songData = {
    classical: [
        "Für Elise - Beethoven",
        "Moonlight Sonata (1st Movement) - Beethoven",
        "Canon in D - Pachelbel",
        "Turkish March - Mozart",
        "Mariage d'Amour - Paul de Senneville",
        "Hugarian Sonata - Paul de Senneville",
        "Nocturne in C Sharp Minor - Chopin",
        "Waltz in A Minor - Chopin",
        "Carmen Habenera - Bizet",

    ],
    ballad: [
        "Can't Help Falling in Love - Elvis Presley",
        "My Heart Will Go On - James Horner & Will Jennings - Titanic(Celine Dion)",
        "Kiss The Rain - Yiruma",
        "River Flows in You - Yiruma",
        "Proud of You - Fiona Fung",
         "One Summer's Day - Joe Hisaishi - Spirited Away(Piano Version)"

    ],
    pop: [
        "Perfect - Ed Sheeran",
        "Until I Found You - Stephen Sanchez",
        "Someone You Loved - Lewis Capaldi",
        "I think they call this love - Ellot James Reay"

    ],
    
    jazz: [
        "Fly Me To The Moon",
        "Jingle Bells",
        "Merry go round of life - Joe Hisaishi - Howl's Moving Castle(Piano Version)",
        "Take Five",
        "What a Wonderful World"
    ]
};

// Hàm mở Modal
function openModal(style) {
    const modal = document.getElementById("songModal");
    const title = document.getElementById("modalTitle");
    const list = document.getElementById("songList");

    // Xóa danh sách cũ
    list.innerHTML = "";

    // Đặt tên tiêu đề (Viết hoa chữ cái đầu)
    title.innerText = "Danh sách nhạc " + style.charAt(0).toUpperCase() + style.slice(1);

    // Lấy danh sách bài hát từ dữ liệu
    const songs = songData[style];

    if (songs) {
        songs.forEach(song => {
            let li = document.createElement("li");
            li.innerText = song;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = "<li>Chưa có bài hát nào.</li>";
    }

    // Hiển thị Modal (dùng Flex để dễ canh giữa)
    modal.style.display = "flex";
}

// Hàm đóng Modal
function closeModal() {
    document.getElementById("songModal").style.display = "none";
}

// Đóng Modal khi bấm ra ngoài vùng nội dung
window.onclick = function(event) {
    const modal = document.getElementById("songModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// --- VIRTUAL PIANO LOGIC ---

// 1. Khởi tạo Audio Context (Bộ xử lý âm thanh của trình duyệt)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 2. Tần số các nốt nhạc (Hz)
const noteFrequencies = {
    "C4": 261.63,
    "Cs4": 277.18,
    "D4": 293.66,
    "Ds4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "Fs4": 369.99,
    "G4": 392.00,
    "Gs4": 415.30,
    "A4": 440.00,
    "As4": 466.16,
    "B4": 493.88,
    "C5": 523.25
};

function playSound(note) {
    if (!audioCtx) return;

    // Tạo bộ dao động (Oscillator) - tạo ra sóng âm
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Chọn loại sóng âm: 'triangle' nghe giống tiếng đàn piano điện tử nhất
    oscillator.type = 'triangle'; 
    oscillator.frequency.value = noteFrequencies[note];

    // Hiệu ứng âm lượng (Giảm dần)
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    // Kết nối: Nguồn âm -> Bộ chỉnh âm -> Loa
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Phát âm thanh
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5); // Tự tắt sau 1.5s
}

// 3. Xử lý sự kiện Click chuột / Chạm tay
const keys = document.querySelectorAll(".key");

keys.forEach(key => {
    key.addEventListener("mousedown", () => {
        const note = key.getAttribute("data-note");
        playSound(note);
        key.classList.add("active"); // Hiệu ứng lún phím
        setTimeout(() => key.classList.remove("active"), 100);
    });
});

// 4. Xử lý sự kiện Bàn phím máy tính
document.addEventListener("keydown", (e) => {
    if (e.repeat) return; // Chặn giữ phím liên tục
    const keyChar = e.key.toLowerCase();
    const keyElement = document.querySelector(`.key[data-key="${keyChar}"]`);

    if (keyElement) {
        const note = keyElement.getAttribute("data-note");
        playSound(note);
        keyElement.classList.add("active");
        setTimeout(() => keyElement.classList.remove("active"), 100);
    }
});