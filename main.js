const imageUpload = document.getElementById("imageUpload");
const dropZone = document.getElementById("dropZone");
const previewImage = document.getElementById("previewImage");
const analyzeButton = document.getElementById("analyzeButton");
const resetButton = document.getElementById("resetButton");
const emptyState = document.getElementById("emptyState");
const results = document.getElementById("results");

const faceTypes = [
    {
        name: "왕이 될 상",
        summary: "첫인상부터 중심을 잡는 힘이 있고, 중요한 순간에 존재감이 커지는 타입입니다.",
        traits: ["카리스마", "리더십", "큰 그림", "무대 체질"]
    },
    {
        name: "고양이 상",
        summary: "차분하고 세련된 분위기가 강해서 볼수록 매력이 쌓이는 타입입니다.",
        traits: ["시크함", "센스", "독립적", "은근한 인기"]
    },
    {
        name: "대박날 상",
        summary: "밝은 기운과 타이밍 운이 같이 들어오는 느낌이라 기회가 잘 붙는 타입입니다.",
        traits: ["행운", "친화력", "상승세", "긍정 에너지"]
    },
    {
        name: "강아지 상",
        summary: "편안하고 다정한 인상으로 처음 만난 사람도 쉽게 마음을 여는 타입입니다.",
        traits: ["다정함", "호감형", "순한 매력", "팀워크"]
    },
    {
        name: "배우상",
        summary: "표정의 결이 풍부하고 사진마다 다른 분위기가 살아나는 타입입니다.",
        traits: ["표현력", "분위기", "몰입감", "화면 장악"]
    },
    {
        name: "첫사랑 상",
        summary: "깨끗하고 부드러운 인상이 오래 기억에 남는 타입입니다.",
        traits: ["청량함", "순수함", "편안함", "기억력"]
    }
];

const colors = [
    ["봄 웜 브라이트", "복숭아, 코랄, 아이보리처럼 밝고 생기 있는 컬러가 잘 어울려요."],
    ["여름 쿨 라이트", "라벤더, 하늘색, 로즈 핑크처럼 맑고 부드러운 컬러가 잘 맞아요."],
    ["가을 웜 뮤트", "올리브, 카멜, 브릭처럼 차분하고 깊이 있는 컬러가 분위기를 살려요."],
    ["겨울 쿨 딥", "블랙, 버건디, 로열 블루처럼 대비감 있는 컬러가 인상을 또렷하게 해요."],
    ["뉴트럴 클린", "화이트, 그레이, 데님처럼 깔끔한 컬러를 안정적으로 소화하는 타입이에요."]
];

const mbtis = [
    ["ENFP", "표정에서 에너지와 호기심이 느껴져요."],
    ["INFJ", "조용하지만 깊게 생각하는 분위기가 있어요."],
    ["ENTJ", "목표가 보이면 빠르게 밀고 가는 인상입니다."],
    ["ISFP", "부드럽고 감각적인 결이 강한 타입입니다."],
    ["ESTP", "순발력과 현장감이 살아 있는 분위기입니다."],
    ["INTP", "관찰력과 독특한 취향이 느껴지는 타입입니다."]
];

const sajus = [
    ["불꽃 추진형", "시작이 빠르고 흐름을 직접 만드는 타입."],
    ["물결 감성형", "사람과 분위기를 섬세하게 읽는 타입."],
    ["나무 성장형", "꾸준히 올라가며 결국 결과를 만드는 타입."],
    ["금빛 승부형", "기준이 뚜렷하고 결정적 순간에 강한 타입."],
    ["흙빛 안정형", "주변을 편안하게 만들고 신뢰를 쌓는 타입."]
];

const luckyLines = [
    ["웃는 얼굴이 기회를 부릅니다.", "프로필 사진을 바꾸기 좋은 날."],
    ["오늘은 말보다 분위기가 먼저 통합니다.", "부드러운 색 옷을 입으면 호감도가 올라가요."],
    ["작게 시작한 일이 크게 번질 수 있어요.", "미뤄둔 연락을 보내기 좋은 타이밍."],
    ["자신감 있는 선택이 운을 엽니다.", "조금 과감한 스타일링도 잘 받는 날."],
    ["차분한 태도가 매력을 더합니다.", "정리된 배경에서 사진을 찍어보세요."]
];

let selectedImageData = null;

imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        loadImage(file);
    }
});

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragging");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        loadImage(file);
    }
});

analyzeButton.addEventListener("click", async () => {
    if (!selectedImageData) return;

    analyzeButton.disabled = true;
    analyzeButton.textContent = "분석 중...";

    const signature = await getImageSignature(selectedImageData);
    renderResult(signature);

    analyzeButton.disabled = false;
    analyzeButton.textContent = "다시 결과 보기";
});

resetButton.addEventListener("click", () => {
    imageUpload.value = "";
    selectedImageData = null;
    previewImage.removeAttribute("src");
    dropZone.classList.remove("has-image");
    analyzeButton.disabled = true;
    analyzeButton.textContent = "결과 보기";
    emptyState.hidden = false;
    results.hidden = true;
});

document.getElementById("privacyButton").addEventListener("click", () => {
    alert("업로드한 이미지는 서버로 전송하거나 저장하지 않으며, 브라우저 안에서 미리보기와 결과 생성에만 사용됩니다.");
});

document.getElementById("termsButton").addEventListener("click", () => {
    alert("본 서비스는 재미용 테스트입니다. 결과는 실제 관상, 성격, 운세, 외모 평가를 보장하지 않습니다.");
});

function loadImage(file) {
    const reader = new FileReader();

    reader.onload = () => {
        selectedImageData = reader.result;
        previewImage.src = selectedImageData;
        dropZone.classList.add("has-image");
        analyzeButton.disabled = false;
        emptyState.hidden = false;
        results.hidden = true;
    };

    reader.readAsDataURL(file);
}

function pick(list, seed, offset = 0) {
    return list[Math.abs(seed + offset) % list.length];
}

async function getImageSignature(src) {
    const image = await createImage(src);
    const canvas = document.createElement("canvas");
    const size = 64;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = size;
    canvas.height = size;
    context.drawImage(image, 0, 0, size, size);

    const pixels = context.getImageData(0, 0, size, size).data;
    let red = 0;
    let green = 0;
    let blue = 0;
    let contrast = 0;

    for (let i = 0; i < pixels.length; i += 4) {
        red += pixels[i];
        green += pixels[i + 1];
        blue += pixels[i + 2];
        contrast += Math.abs(pixels[i] - pixels[i + 1]) + Math.abs(pixels[i + 1] - pixels[i + 2]);
    }

    const count = pixels.length / 4;
    const brightness = Math.round((red + green + blue) / (count * 3));
    const warmth = Math.round((red - blue) / count);
    const seed = Math.round(red * 3 + green * 5 + blue * 7 + contrast * 11 + brightness * 13 + warmth * 17);

    return { seed, brightness, warmth, contrast: Math.round(contrast / count) };
}

function createImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
    });
}

function renderResult(signature) {
    const type = pick(faceTypes, signature.seed);
    const color = pick(colors, signature.seed, signature.warmth);
    const mbti = pick(mbtis, signature.seed, signature.brightness);
    const saju = pick(sajus, signature.seed, signature.contrast);
    const lucky = pick(luckyLines, signature.seed, signature.brightness + signature.contrast);
    const score = Math.min(99, Math.max(72, 72 + Math.abs(signature.seed % 28)));
    const extraTraits = [
        signature.brightness > 132 ? "맑은 인상" : "깊은 분위기",
        signature.warmth > 0 ? "따뜻한 톤" : "쿨한 무드",
        signature.contrast > 58 ? "또렷한 존재감" : "부드러운 호감"
    ];

    document.getElementById("faceType").textContent = type.name;
    document.getElementById("faceSummary").textContent = type.summary;
    document.getElementById("beautyScore").textContent = score;
    document.getElementById("scoreFill").style.width = `${score}%`;
    document.getElementById("personalColor").textContent = color[0];
    document.getElementById("colorHint").textContent = color[1];
    document.getElementById("mbti").textContent = mbti[0];
    document.getElementById("mbtiHint").textContent = mbti[1];
    document.getElementById("saju").textContent = saju[0];
    document.getElementById("sajuHint").textContent = saju[1];
    document.getElementById("luckyLine").textContent = lucky[0];
    document.getElementById("luckyHint").textContent = lucky[1];

    const traits = document.getElementById("traits");
    traits.innerHTML = "";
    [...type.traits, ...extraTraits].forEach((trait) => {
        const item = document.createElement("span");
        item.textContent = `#${trait}`;
        traits.appendChild(item);
    });

    emptyState.hidden = true;
    results.hidden = false;
}
