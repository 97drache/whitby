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
  ticketLinks?: {
    label: string;
    href: string;
  }[];
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

export const tripOverview = {
  title: "Canada Again",
  destination: "온타리오, 캐나다",
  stayAddress: "1445 Coral Spgs Path, ON",
  family: [
    {
      name: "Yongwoon",
      note: "Yireh와 나중 출국 · 함께 귀국",
      departureGroup: "나중 출발",
    },
    {
      name: "Miyoung",
      note: "Yiel과 먼저 출국 · 함께 귀국",
      departureGroup: "먼저 출발",
    },
    {
      name: "Yireh",
      note: "Yongwoon과 나중 출국 · 함께 귀국",
      departureGroup: "나중 출발",
    },
    {
      name: "Yiel",
      note: "Miyoung과 먼저 출국 · 함께 귀국",
      departureGroup: "먼저 출발",
    },
  ] satisfies FamilyMember[],
};

export const itinerary: TripDay[] = [
  {
    id: "outbound-first",
    date: "2026-07-20",
    title: "Miyoung · Yiel 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary:
      "먼저 출발하는 2명의 출국편입니다. 인천 터미널 2에서 출발해 토론토 피어슨 터미널 3에 도착합니다.",
    legs: [
      {
        title: "인천 출발",
        time: "09:35",
        description: "서울/인천국제공항 터미널 2 (ICN)",
        location: "ICN Terminal 2",
      },
      {
        title: "토론토 도착",
        time: "09:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)",
        location: "YYZ Terminal 3",
      },
      {
        title: "숙소 이동",
        time: "도착 후",
        description: "캐나다 유심 연결 후 숙소로 이동합니다.",
        location: "1445 Coral Spgs Path, ON",
      },
    ],
    ticketLinks: [
      { label: "Miyoung eTicket", href: "/documents" },
      { label: "Yiel eTicket", href: "/documents" },
    ],
  },
  {
    id: "outbound-later",
    date: "2026-08-06",
    title: "Yongwoon · Yireh 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary:
      "나중에 출발하는 2명의 출국편입니다. 출발·도착 시각은 먼저 출발편과 같습니다.",
    legs: [
      {
        title: "인천 출발",
        time: "09:35",
        description: "서울/인천국제공항 터미널 2 (ICN)",
        location: "ICN Terminal 2",
      },
      {
        title: "토론토 도착",
        time: "09:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)",
        location: "YYZ Terminal 3",
      },
      {
        title: "가족 합류",
        time: "도착 후",
        description: "먼저 도착한 가족과 숙소에서 만납니다.",
        location: "1445 Coral Spgs Path, ON",
      },
    ],
    ticketLinks: [
      { label: "Yongwoon eTicket", href: "/documents" },
      { label: "Yireh eTicket", href: "/documents" },
    ],
  },
  {
    id: "return-together",
    date: "2026-08-14 (+1)",
    title: "가족 함께 귀국",
    city: "토론토(YYZ) → 인천(ICN)",
    stay: "귀국편",
    summary: "가족 모두 함께 귀국합니다. 2026-08-14 토론토에서 출발해 다음날 인천에 도착합니다.",
    legs: [
      {
        title: "토론토 출발",
        time: "12:55",
        description: "2026-08-14 · 토론토 피어슨 국제공항 터미널 3 (YYZ)",
        location: "YYZ Terminal 3",
      },
      {
        title: "인천 도착",
        time: "16:30 (+1일)",
        description: "2026-08-15 · 서울/인천국제공항 터미널 2 (ICN)",
        location: "ICN Terminal 2",
      },
    ],
    ticketLinks: [
      { label: "가족 귀국 eTicket", href: "/documents" },
    ],
  },
];

export const documents: TravelDocument[] = [
  {
    id: "family-eta",
    title: "가족 eTA",
    category: "입국",
    description: "4명의 eTA 파일",
    holder: "서류 페이지",
    whenNeeded: "공항 / 입국",
    status: "todo",
  },
  {
    id: "family-eticket",
    title: "가족 eTicket",
    category: "항공",
    description: "출국·귀국 eTicket",
    holder: "서류 페이지",
    whenNeeded: "체크인 / 탑승",
    status: "todo",
  },
];

export const uploadSlots: UploadSlot[] = [
  {
    id: "eta-yongwoon",
    person: "Yongwoon",
    documentType: "eTA",
    description: "Yongwoon의 eTA",
  },
  {
    id: "eta-miyoung",
    person: "Miyoung",
    documentType: "eTA",
    description: "Miyoung의 eTA",
  },
  {
    id: "eta-yireh",
    person: "Yireh",
    documentType: "eTA",
    description: "Yireh의 eTA",
  },
  {
    id: "eta-yiel",
    person: "Yiel",
    documentType: "eTA",
    description: "Yiel의 eTA",
  },
  {
    id: "eticket-yongwoon",
    person: "Yongwoon",
    documentType: "eTicket",
    description: "Yongwoon의 eTicket",
  },
  {
    id: "eticket-miyoung",
    person: "Miyoung",
    documentType: "eTicket",
    description: "Miyoung의 eTicket",
  },
  {
    id: "eticket-yireh",
    person: "Yireh",
    documentType: "eTicket",
    description: "Yireh의 eTicket",
  },
  {
    id: "eticket-yiel",
    person: "Yiel",
    documentType: "eTicket",
    description: "Yiel의 eTicket",
  },
];

export const sharedTravelDetails = {
  stayAddress: "1445 Coral Spgs Path, ON",
  rentalCarNumber: "차량번호 입력 예정",
  canadaPhoneNumber: "캐나다 유심 번호 입력 예정",
  returnPlan: "2026-08-14 YYZ 12:55 → 2026-08-15 ICN 16:30",
};
