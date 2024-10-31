## 쇼핑몰 구매 데이터 대시보드

### 실행방법
```cmd
cd apps
yarn install
yarn start-server
yarn start-client
```

### 설명
- tailwindcss, typescript, react, recharts 를 이용해 코드를 작성하였습니다.
- `.env` 파일의 `VITE_ENABLE_MSW` 값을 `true`로 지정하면 mock service worker로 실행됩니다.
- `yarn workspace frontend test:coverage` 명령어를 이용해 테스트 커버리지를 확인하실 수 있습니다.