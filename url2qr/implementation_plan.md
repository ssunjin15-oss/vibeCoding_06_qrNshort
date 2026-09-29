# 구현계획: URL2QR (프로젝트04)

## 목표
URL을 입력하면 QR코드로 변환하고, QR코드를 JPG 파일로 저장할 수 있는 웹사이트를 만든다.

## 요구사항 (5주차 2교시 프롬프트)
1. 화면 상단 좌측에 로고 표시 (img/logo.png)
2. 중앙에 심플한 URL 입력창
3. URL 입력 후 확인을 누르면 입력창이 하단으로 내려가고, 화면 정중앙에 QR코드 생성
4. QR코드를 클릭하면 JPG 파일로 다운로드
5. 로고와 어울리는 밝은 톤, 그라데이션 배경, 마우스 위치에 따라 그라데이션 색상 변화

## 파일 구성
| 파일 | 역할 |
|---|---|
| index.html | 화면 구조 (로고, QR 영역, URL 입력 폼) |
| style.css | 밝은 톤 디자인, 그라데이션, 입력창 이동 레이아웃 |
| script.js | URL 검증, QR 생성, JPG 저장, 마우스 그라데이션 |
| img/logo.png | 로고 이미지 (강의 준비파일) |

## 구현 방법
- QR 생성: qrcode-generator 라이브러리(jsDelivr CDN)로 QR 데이터를 만들고 canvas에 직접 그림
- JPG 저장: canvas에 흰 배경과 여백을 넣어 그린 뒤 `toDataURL("image/jpeg")`로 다운로드
- 레이아웃 전환: 생성 성공 시 `.done` 클래스를 붙여 QR 영역 표시, 입력창을 하단으로 이동
- 배경: CSS 변수(--mx, --my, --hue)를 mousemove 이벤트로 갱신해 radial-gradient 위치와 색상 변경
- URL 검증: `http(s)://`가 없으면 `https://`를 붙이고, 도메인에 점(.)이 없으면 오류 안내

## 배포
- 저장소: vibeCoding_04_url2qr
- 주소: https://ssunjin15-oss.github.io/vibeCoding_04_url2qr/
