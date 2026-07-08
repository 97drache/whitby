# Canada Again

가족 캐나다 여행용 웹앱입니다.

## 포함 내용

- 홈 / 여정 / 서류 메뉴
- 가족 PIN `0114`로 잠기는 서류 영역
- 인원별 eTA 업로드
- 인원별 출국·귀국 eTicket 업로드 (왕복 2장)
- 인천공항·토론토공항 호텔 예약 확인서 업로드
- 차량 예약 확인증 업로드
- 캐나다 개인 전화번호 / 차량 번호 입력 및 공유

## 환경 변수

```bash
FAMILY_PIN=0114
FAMILY_SESSION_SECRET=any-long-random-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## 서류 영구 저장 (중요)

Vercel에 배포할 때 **Blob 스토어를 연결하지 않으면** 업로드한 서류가 배포(커밋·푸시)마다 사라집니다.

1. [Vercel 대시보드](https://vercel.com/dashboard) → 프로젝트 선택
2. **Storage** → **Create Database** → **Blob** 선택
3. 프로젝트에 연결하면 `BLOB_READ_WRITE_TOKEN`이 자동으로 설정됩니다
4. 다시 배포하면 서류가 Blob에 영구 저장됩니다

로컬 개발에서는 `.data` 폴더에 저장됩니다.
