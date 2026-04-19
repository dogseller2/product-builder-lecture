const URL = "https://teachablemachine.withgoogle.com/models/P0Fbrol1v/";

let model, labelContainer, maxPredictions;
let uploadedImageElement = null;

// 테마 관리
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '라이트 모드';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '라이트 모드' : '다크 모드';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 모델 미리 로드
async function loadModel() {
    if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

// 이미지 업로드 핸들러
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${e.target.result}" id="uploaded-image">`;
        uploadedImageElement = document.getElementById('uploaded-image');
        
        // 결과창 초기화
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '분석 준비 중...';
        
        const startBtn = document.getElementById('start-btn');
        startBtn.style.display = 'inline-block';
        startBtn.textContent = '판별하기';

        await loadModel();
        labelContainer.innerHTML = '이미지가 로드되었습니다. 판별하기를 눌러주세요.';
    };
    reader.readAsDataURL(file);
}

// 판별하기
async function predict() {
    if (!model || !uploadedImageElement) return;

    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = true;
    startBtn.textContent = '분석 중...';

    const prediction = await model.predict(uploadedImageElement);
    
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        let emoji = className.includes("강아지") ? "🐶" : "🐱";
        
        const div = document.createElement("div");
        div.className = 'result-item';
        div.innerHTML = `
            <span>${emoji} ${className}</span>
            <span>${probability}%</span>
        `;
        labelContainer.appendChild(div);
    }

    startBtn.disabled = false;
    startBtn.textContent = '다시 판별하기';
}

// 페이지 로드 시 모델 로드 시작
loadModel();
