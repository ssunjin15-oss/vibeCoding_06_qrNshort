# QRnShort (프로젝트06)

## 프로젝트 개요
URL을 다루는 두 가지 기능을 한곳에 모은 웹 앱입니다.

- **QR코드**: URL을 QR코드 이미지로 변환 (5주차 프로젝트04 URL2QR 결과물을 `url2qr` 폴더로 재사용)
- **URL단축**: 긴 URL을 OpenAPI로 짧은 URL로 변환 (`urlShort` 폴더에 새로 구현)

| 구분 | 주소 |
|---|---|
| QRnShort 배포 | https://ssunjin15-oss.github.io/vibeCoding_06_qrNshort/ |
| 5주차 URL2QR 배포 | https://ssunjin15-oss.github.io/vibeCoding_04_url2qr/ |

## 폴더 구조
```
vibeCoding_06_qrNshort/
├─ index.html, style.css     메인 화면 (기능 선택 버튼 2개)
├─ url2qr/                   프로젝트04 결과물 (URL → QR코드)
│  ├─ index.html, style.css, script.js
│  └─ img/logo.png
└─ urlShort/                 URL단축 기능 (신규)
   └─ index.html, style.css, script.js
```

## 기능 명세서

### 1. 메인 화면
| ID | 기능 | 동작 |
|---|---|---|
| M-1 | 'QR코드' 버튼 | `url2qr/index.html`로 이동 |
| M-2 | 'URL단축' 버튼 | `urlShort/index.html`로 이동 |
| M-3 | 5주차 배포본 링크 | 5주차 URL2QR 배포 주소를 새 탭으로 열기 |

### 2. QR코드 (url2qr)
| ID | 기능 | 동작 |
|---|---|---|
| Q-1 | URL 입력 | `https://` 생략 가능, 형식이 틀리면 오류 안내 |
| Q-2 | QR 생성 | 확인을 누르면 입력창이 하단으로 이동하고 정중앙에 QR 표시 |
| Q-3 | JPG 저장 | QR을 클릭하면 JPG 파일로 다운로드 |
| Q-4 | 배경 효과 | 마우스 위치에 따라 그라데이션 색상 변화 |

### 3. URL단축 (urlShort)
| ID | 기능 | 동작 |
|---|---|---|
| S-1 | URL 입력창 | 긴 URL 입력, Enter 키로도 실행 |
| S-2 | 단축하기 버튼 | 입력창이 비어 있으면 비활성화 |
| S-3 | 단축 요청 | OpenAPI에 요청하고 결과를 읽기 전용 출력 상자에 표시 |
| S-4 | 복사 버튼 | 결과를 클립보드에 복사하고 '복사하였습니다' 알림창 표시 |
| S-5 | 오류 처리 | 모든 API가 실패하면 안내 문구 표시 |

## 사용한 OpenAPI
| 순서 | API | 방식 | 비고 |
|---|---|---|---|
| 1순위 | da.gd | GET, 텍스트 응답 | CORS 허용, GitHub Pages에서 동작 확인 |
| 2순위 | clck.ru | GET, 텍스트 응답 | 1순위 실패 시 사용 |
| 3순위 | is.gd | JSONP | 2순위 실패 시 사용 |

**CORS 대응**: 브라우저 보안 정책(CORS) 때문에 일부 단축 API는 GitHub Pages에서 호출이 막힙니다. 그래서 CORS를 허용하는 API를 1순위로 두고, 실패하면 다음 API로 자동 전환하도록 구성했습니다.
