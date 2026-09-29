// URL단축: OpenAPI로 긴 URL을 짧게 변환
// 1순위 da.gd (CORS 지원), 실패 시 2순위 clck.ru, 3순위 is.gd(JSONP)

const input = document.getElementById("url-input");
const shortenBtn = document.getElementById("shorten-btn");
const output = document.getElementById("result-output");
const copyBtn = document.getElementById("copy-btn");
const errorMsg = document.getElementById("error-msg");

// 입력 필드가 비어 있으면 '단축하기' 버튼 비활성화
function updateButtonState() {
  shortenBtn.disabled = input.value.trim() === "";
}
input.addEventListener("input", updateButtonState);
updateButtonState();

// Enter 키로도 단축
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !shortenBtn.disabled) shortenBtn.click();
});

function normalizeUrl(value) {
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.href;
  } catch (e) {
    return null;
  }
}

// 3순위: is.gd OpenAPI (JSONP)
function shortenWithIsgd(longUrl, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const callbackName = "isgdCallback_" + Date.now();
    const script = document.createElement("script");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("is.gd 응답 시간 초과"));
    }, timeoutMs);

    function cleanup() {
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      if (data && data.shorturl) resolve(data.shorturl);
      else reject(new Error((data && data.errormessage) || "is.gd 단축 실패"));
    };

    script.src =
      "https://is.gd/create.php?format=json&callback=" + callbackName +
      "&url=" + encodeURIComponent(longUrl);
    script.onerror = () => {
      cleanup();
      reject(new Error("is.gd 네트워크 오류"));
    };
    document.body.appendChild(script);
  });
}

// 1순위: da.gd OpenAPI (fetch, 결과를 텍스트로 반환)
async function shortenWithDagd(longUrl, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://da.gd/s?url=" + encodeURIComponent(longUrl), {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("da.gd 응답 오류 " + res.status);
    const text = (await res.text()).trim();
    if (!/^https?:\/\//.test(text)) throw new Error("da.gd 단축 실패");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

// 2순위: clck.ru OpenAPI (fetch, 결과를 텍스트로 반환)
async function shortenWithClck(longUrl, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("https://clck.ru/--?url=" + encodeURIComponent(longUrl), {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("clck.ru 응답 오류 " + res.status);
    const text = (await res.text()).trim();
    if (!/^https?:\/\//.test(text)) throw new Error("clck.ru 단축 실패");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

shortenBtn.addEventListener("click", async () => {
  errorMsg.textContent = "";
  const longUrl = normalizeUrl(input.value);
  if (!longUrl) {
    errorMsg.textContent = "올바른 URL을 입력해 주세요. (예: https://www.sdu.ac.kr)";
    return;
  }

  shortenBtn.disabled = true;
  shortenBtn.textContent = "단축 중...";
  output.value = "";
  copyBtn.disabled = true;

  try {
    let shortUrl = null;
    const apis = [shortenWithDagd, shortenWithClck, shortenWithIsgd];
    for (const api of apis) {
      try {
        shortUrl = await api(longUrl);
        break;
      } catch (apiError) {
        console.warn(apiError.message, "→ 다음 API로 재시도");
      }
    }
    if (!shortUrl) throw new Error("모든 단축 API 실패");
    output.value = shortUrl;
    copyBtn.disabled = false;
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "URL 단축에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    shortenBtn.textContent = "단축하기";
    updateButtonState();
  }
});

// '복사' 클릭 → 클립보드 복사 후 알림창
copyBtn.addEventListener("click", async () => {
  const text = output.value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // 구형 브라우저 대비
    output.select();
    document.execCommand("copy");
  }
  alert("복사하였습니다");
});
