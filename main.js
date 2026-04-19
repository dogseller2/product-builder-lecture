
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 테마 초기화
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

document.getElementById('generate').addEventListener('click', () => {
    const numbersDiv = document.getElementById('numbers');
    numbersDiv.innerHTML = '';
    const lottoNumbers = new Set();

    while (lottoNumbers.size < 6) {
        lottoNumbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(lottoNumbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
        numberDiv.textContent = number;
        numbersDiv.appendChild(numberDiv);

        let color;
        if (number <= 10) {
            color = '#fbc400'; // 노란색
        } else if (number <= 20) {
            color = '#69c8f2'; // 파란색
        } else if (number <= 30) {
            color = '#ff7272'; // 빨간색
        } else if (number <= 40) {
            color = '#aaa'; // 회색
        } else {
            color = '#b0d840'; // 초록색
        }
        numberDiv.style.backgroundColor = color;
        numberDiv.style.color = 'white';
    });
});
