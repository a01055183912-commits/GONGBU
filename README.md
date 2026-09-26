# 프로모션 기획 연습장

백화점 프로모션 기획(3-1) 강의용 학습 웹앱입니다. 모든 숫자는 **교육용 가상 데이터**입니다.

- 탭 6개: 홈 · 용어사전 · 워밍업 게임(강의 따라 7~51장 + 심화 4종) · 실습 가이드 · 이익창출 활동지 · 비교
- 화면은 `index.html` 한 파일이고, `server.js`가 그 파일을 내려 주는 작은 서버입니다(외부 패키지 없음).

## 내 PC에서 실행

```bash
npm start
# http://localhost:3000
```

`index.html`을 브라우저로 바로 열어도 동작합니다(인쇄 버튼은 이 방법에서 가장 잘 됩니다).

## Railway 배포

1. Railway에서 **New Project → Deploy from GitHub repo** → 이 저장소 선택
2. 서비스 **Settings → Source**에서 배포할 브랜치를 고릅니다(현재 작업 브랜치: `claude/focused-carson-tpp7ee`)
3. **Settings → Networking → Generate Domain**으로 주소를 만듭니다
4. 끝. Railway가 `package.json`을 보고 Node로 빌드하고 `npm start`로 실행합니다

설정은 `railway.json`에 들어 있습니다.

| 항목 | 값 |
|---|---|
| 시작 명령 | `node server.js` |
| 포트 | Railway가 주는 `PORT` 환경변수 (따로 설정할 것 없음) |
| 헬스체크 | `/health` → `ok` |
| 재시작 | 실패 시 최대 5회 |

## 참고

- 활동지 입력과 "외웠어요" 체크는 **각 수강생의 브라우저에만** 저장됩니다. 서버에는 아무것도 저장하지 않습니다.
- 게임 점수와 평가 집계표는 새로고침하면 초기화됩니다.
- 글꼴은 Google Fonts에서 불러오고, 연결이 안 되면 기기 기본 글꼴로 보입니다.
