# Canada Again

가족 캐나다 여행용 간단한 웹앱입니다.

## 포함 내용

- 홈 / 여정 / 서류 메뉴
- 가족 PIN `0114`로 잠기는 서류 영역
- eTA 업로드
- 출국 eTicket / 귀국 eTicket 구분 업로드
- 차량 예약 확인증 업로드
- 캐나다 개인 전화번호 / 차량 번호 입력 및 공유

## 환경 변수

```bash
FAMILY_PIN=0114
FAMILY_SESSION_SECRET=any-long-random-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

`BLOB_READ_WRITE_TOKEN`이 있으면 Vercel Blob private 저장소를 사용합니다.
없으면 로컬 개발에서는 `.data` 폴더를 사용합니다.