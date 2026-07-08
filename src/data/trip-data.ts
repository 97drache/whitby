export type FamilyMember = {
  name: string;
  note?: string;
  departureGroup?: string;
};

export type TripLeg = {
  title: string;
  time: string;
  description: string;
  location?: string;
  reference?: string;
};

export type TripDay = {
  id: string;
  date: string;
  title: string;
  city: string;
  stay: string;
  summary: string;
  legs: TripLeg[];
};

export type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  due: string;
  owner: string;
};

export type TravelDocument = {
  id: string;
  title: string;
  category: string;
  description: string;
  holder: string;
  whenNeeded: string;
  status: "ready" | "todo" | "check";
  href?: string;
};

export type UploadSlot = {
  id: string;
  person: string;
  documentType: "eTA" | "eTicket";
  description: string;
};

export type HandyInfo = {
  title: string;
  items: {
    label: string;
    value: string;
  }[];
};

export const tripOverview = {
  title: "우리 가족 캐나다 여행",
  subtitle:
    "항공편, 서류, 숙소, 차량번호를 한곳에 모아 누구나 쉽게 찾아볼 수 있는 가족 여행 페이지입니다.",
  destination: "온타리오, 캐나다",
  travelWindow: "인천(ICN) ↔ 토론토(YYZ)",
  countdownLabel: "부모님도 아이들도 편하게 볼 수 있도록 한글로 정리했습니다.",
  family: [
    {
      name: "Yongwoon",
      note: "Yireh와 함께 나중에 출국하고, 귀국은 가족과 함께합니다.",
      departureGroup: "나중 출발",
    },
    {
      name: "Miyoung",
      note: "Yiel과 함께 먼저 출국합니다.",
      departureGroup: "먼저 출발",
    },
    {
      name: "Yireh",
      note: "Yongwoon과 함께 나중에 출국합니다.",
      departureGroup: "나중 출발",
    },
    {
      name: "Yiel",
      note: "Miyoung과 함께 먼저 출국합니다.",
      departureGroup: "먼저 출발",
    },
  ] satisfies FamilyMember[],
  highlights: [
    "먼저 출발: Miyoung, Yiel",
    "나중 출발: Yongwoon, Yireh",
    "귀국은 가족 모두 함께",
  ],
};

export const quickLinks = [
  { label: "에어캐나다", href: "https://www.aircanada.com/" },
  {
    label: "캐나다 eTA",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",
  },
  { label: "구글 지도", href: "https://maps.google.com/" },
  {
    label: "숙소 위치",
    href: "https://maps.google.com/?q=1445+Coral+Spgs+Path,+ON",
  },
];

export const itinerary: TripDay[] = [
  {
    id: "outbound-first",
    date: "먼저 출발",
    title: "Miyoung · Yiel 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary:
      "먼저 출발하는 2명의 출국편입니다. 인천 터미널 2에서 출발해 토론토 피어슨 터미널 3에 도착합니다.",
    legs: [
      {
        title: "인천 출발",
        time: "09:35",
        description: "서울/인천국제공항 터미널 2 (ICN)에서 출발합니다.",
        location: "ICN Terminal 2",
      },
      {
        title: "토론토 도착",
        time: "09:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)에 도착합니다.",
        location: "YYZ Terminal 3",
      },
      {
        title: "숙소 이동",
        time: "도착 후",
        description: "캐나다 유심을 연결하고 숙소로 이동합니다.",
        location: "1445 Coral Spgs Path, ON",
      },
    ],
  },
  {
    id: "outbound-later",
    date: "나중 출발",
    title: "Yongwoon · Yireh 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary:
      "나중에 출발하는 2명의 출국편입니다. 출발·도착 시간은 먼저 출발편과 같습니다.",
    legs: [
      {
        title: "인천 출발",
        time: "09:35",
        description: "서울/인천국제공항 터미널 2 (ICN)에서 출발합니다.",
        location: "ICN Terminal 2",
      },
      {
        title: "토론토 도착",
        time: "09:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)에 도착합니다.",
        location: "YYZ Terminal 3",
      },
      {
        title: "가족 합류",
        time: "도착 후",
        description: "먼저 도착한 가족과 숙소에서 만납니다.",
        location: "1445 Coral Spgs Path, ON",
      },
    ],
  },
  {
    id: "return-together",
    date: "귀국",
    title: "가족 함께 귀국",
    city: "토론토(YYZ) → 인천(ICN)",
    stay: "귀국편",
    summary:
      "가족 모두 함께 귀국합니다. 토론토에서 출발해 다음날 인천에 도착합니다.",
    legs: [
      {
        title: "토론토 출발",
        time: "12:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)에서 출발합니다.",
        location: "YYZ Terminal 3",
      },
      {
        title: "인천 도착",
        time: "16:30 (+1일)",
        description: "서울/인천국제공항 터미널 2 (ICN)에 다음날 도착합니다.",
        location: "ICN Terminal 2",
      },
      {
        title: "입국 후 체크",
        time: "도착 후",
        description: "여권, eTicket, 입국 서류를 함께 확인합니다.",
      },
    ],
  },
];

export const checklist: ChecklistItem[] = [
  {
    id: "passports",
    title: "여권 확인",
    description: "가족 전원 여권 유효기간을 확인하고 사본도 준비합니다.",
    due: "출국 6주 전",
    owner: "가족",
  },
  {
    id: "eta",
    title: "캐나다 eTA 준비",
    description: "4명 각각의 eTA 파일을 Documents에 올려둡니다.",
    due: "출국 4주 전",
    owner: "Miyoung",
  },
  {
    id: "eticket",
    title: "eTicket 모으기",
    description: "먼저 출발 2명, 나중 출발 2명, 귀국편 eTicket을 준비합니다.",
    due: "출국 2주 전",
    owner: "Miyoung",
  },
  {
    id: "sim",
    title: "캐나다 유심 번호 공유",
    description: "현지에서 개통한 캐나다 전화번호를 이 페이지에 적어둡니다.",
    due: "입국 당일",
    owner: "가족",
  },
  {
    id: "car",
    title: "렌터카 번호 기록",
    description: "차량을 받은 뒤 차량번호를 입력해 가족이 함께 보게 합니다.",
    due: "픽업 당일",
    owner: "Yongwoon",
  },
];

export const documents: TravelDocument[] = [
  {
    id: "family-eta",
    title: "가족 eTA",
    category: "입국",
    description: "4명의 eTA 파일을 각각 준비합니다.",
    holder: "Documents 페이지 (가족 PIN)",
    whenNeeded: "공항 / 입국 심사",
    status: "todo",
  },
  {
    id: "family-eticket",
    title: "가족 eTicket",
    category: "항공",
    description: "출국·귀국 eTicket을 사람별로 올려둡니다.",
    holder: "Documents 페이지 (가족 PIN)",
    whenNeeded: "체크인 / 탑승",
    status: "todo",
  },
  {
    id: "home-address",
    title: "숙소 주소",
    category: "숙소",
    description: "가족이 머무는 온타리오 주소입니다.",
    holder: "홈 / 정보 페이지",
    whenNeeded: "입국 후 이동",
    status: "ready",
  },
  {
    id: "shared-trip-notes",
    title: "공유할 현지 정보",
    category: "현지",
    description: "캐나다 전화번호와 렌터카 번호를 함께 확인합니다.",
    holder: "홈 / 정보 페이지",
    whenNeeded: "여행 중",
    status: "check",
  },
];

export const uploadSlots: UploadSlot[] = [
  {
    id: "eta-yongwoon",
    person: "Yongwoon",
    documentType: "eTA",
    description: "Yongwoon의 eTA 파일을 업로드하세요.",
  },
  {
    id: "eta-miyoung",
    person: "Miyoung",
    documentType: "eTA",
    description: "Miyoung의 eTA 파일을 업로드하세요.",
  },
  {
    id: "eta-yireh",
    person: "Yireh",
    documentType: "eTA",
    description: "Yireh의 eTA 파일을 업로드하세요.",
  },
  {
    id: "eta-yiel",
    person: "Yiel",
    documentType: "eTA",
    description: "Yiel의 eTA 파일을 업로드하세요.",
  },
  {
    id: "eticket-yongwoon",
    person: "Yongwoon",
    documentType: "eTicket",
    description: "Yongwoon의 eTicket 파일을 업로드하세요.",
  },
  {
    id: "eticket-miyoung",
    person: "Miyoung",
    documentType: "eTicket",
    description: "Miyoung의 eTicket 파일을 업로드하세요.",
  },
  {
    id: "eticket-yireh",
    person: "Yireh",
    documentType: "eTicket",
    description: "Yireh의 eTicket 파일을 업로드하세요.",
  },
  {
    id: "eticket-yiel",
    person: "Yiel",
    documentType: "eTicket",
    description: "Yiel의 eTicket 파일을 업로드하세요.",
  },
];

export const sharedTravelDetails = {
  stayAddress: "1445 Coral Spgs Path, ON",
  rentalCarNumber: "차량번호 입력 예정",
  canadaPhoneNumber: "캐나다 유심 번호 입력 예정",
  returnPlan: "가족 모두 함께 귀국 (YYZ 12:55 → ICN 16:30 +1일)",
};

export const infoSections: HandyInfo[] = [
  {
    title: "숙소",
    items: [
      { label: "주소", value: "1445 Coral Spgs Path, ON" },
      { label: "지도 팁", value: "출국 전에 구글지도에 주소를 저장해 두세요" },
      { label: "귀국", value: "가족 모두 함께 귀국합니다" },
    ],
  },
  {
    title: "현지에서 바로 쓰는 정보",
    items: [
      { label: "비상전화", value: "911" },
      { label: "화폐", value: "캐나다 달러 (CAD)" },
      { label: "콘센트", value: "Type A/B, 120V" },
    ],
  },
  {
    title: "공유할 번호",
    items: [
      { label: "캐나다 전화번호", value: "캐나다 유심 번호 입력 예정" },
      { label: "렌터카 번호", value: "픽업 후 차량번호 입력" },
      {
        label: "공항",
        value: "출국/귀국 모두 ICN 터미널 2 · YYZ 터미널 3",
      },
    ],
  },
];
