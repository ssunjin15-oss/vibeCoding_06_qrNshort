// URL2QR: URL을 QR코드로 변환 (QR 라이브러리: qrcode-generator, jsDelivr CDN)

const form = document.getElementById("url-form");
const input = document.getElementById("url-input");
const errorMsg = document.getElementById("error-msg");
const main = document.getElementById("main");
const canvas = document.getElementById("qr-canvas");
const qrCard = document.getElementById("qr-card");
const qrUrlText = document.getElementById("qr-url");
const guide = document.getElementById("guide");

// 한글 등이 포함된 URL도 처리
qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];

// 입력값 정리: http(s)가 없으면 https:// 붙이기
function normalizeUrl(value) {
  let url = value.trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.href;
  } catch (e) {
    return null;
  }
}

// 캔버스에 QR코드 그리기 (흰 배경 + 여백 포함 → JPG 저장에 적합)
function drawQR(text) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();

  const count = qr.getModuleCount();
  const size = 600; // 고해상도로 그린 뒤 CSS로 축소
  const margin = 40;
  const cell = (size - margin * 2) / count;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000000";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          Math.floor(margin + c * cell),
          Math.floor(margin + r * cell),
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const url = normalizeUrl(input.value);
  if (!url) {
    errorMsg.textContent = "올바른 URL을 입력해 주세요. (예: https://www.sdu.ac.kr)";
    return;
  }

  try {
    drawQR(url);
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "QR코드 생성 중 오류가 발생했습니다. URL 길이를 줄여 다시 시도해 주세요.";
    return;
  }

  qrUrlText.textContent = url;
  guide.textContent = "다른 URL로 다시 만들기";
  main.classList.add("done");
});

// QR코드 클릭 → JPG 다운로드
qrCard.addEventListener("click", () => {
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
  link.download = `qrcode_${stamp}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  document.body.appendChild(link);
  link.click();
  link.remove();
});

// 마우스 위치에 따라 그라데이션 색상이 조금씩 변함
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  const hue = 30 + (x / 100) * 40 + (y / 100) * 20; // 노랑~주황~연두 범위
  const root = document.documentElement.style;
  root.setProperty("--mx", x + "%");
  root.setProperty("--my", y + "%");
  root.setProperty("--hue", hue.toFixed(0));
});
