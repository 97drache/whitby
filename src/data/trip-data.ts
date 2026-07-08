export type FamilyMember = {
  name: string;
  note?: string;
};

export type TripLeg = {
  title: string;
  time: string;
  description: string;
  location?: string;
};

export type TripDay = {
  id: string;
  date: string;
  title: string;
  city: string;
  stay: string;
  summary: string;
  legs: TripLeg[];
  ticketLinks?: { label: string; href: string }[];
};

export type UploadSlot = {
  id: string;
  person: string;
  documentType: string;
  description: string;
  category: "eta" | "eticket" | "hotel" | "car";
};

export type SharedDetails = {
  canadaPhoneNumber: string;
  carNumber: string;
};

const familyMembers = ["Yongwoon", "Miyoung", "Yireh", "Yiel"] as const;

export const tripOverview = {
  title: "Canada Again",
  destination: "Ontario, Canada",
  stayAddress: "1445 Coral Spgs Path, ON",
  family: [
    { name: "Miyoung", note: "Yiel과 먼저 출국" },
    { name: "Yiel", note: "Miyoung과 먼저 출국" },
    { name: "Yongwoon", note: "Yireh와 나중 출국" },
    { name: "Yireh", note: "Yongwoon과 나중 출국" },
  ] satisfies FamilyMember[],
};

export const itinerary: TripDay[] = [
  {
    id: "outbound-first",
    date: "2026-07-20",
    title: "Miyoung · Yiel 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary: "먼저 출발하는 2명의 출국 일정입니다.",
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
    ],
    ticketLinks: [{ label: "eTicket 보기", href: "/documents" }],
  },
  {
    id: "incheon-airport-hotel",
    date: "2026-08-05",
    title: "인천공항 호텔 숙박",
    city: "인천",
    stay: "Howard Johnson by Wyndham Incheon Airport",
    summary: "Yongwoon · Yireh — 출국 전날 인천공항 근처에서 숙박합니다.",
    legs: [
      {
        title: "체크인",
        time: "8월 5일 15:00",
        description: "Howard Johnson by Wyndham Incheon Airport",
        location: "인천",
      },
      {
        title: "체크아웃",
        time: "8월 6일 11:00",
        description: "출국 당일 호텔에서 하원 후 공항으로 이동",
        location: "인천",
      },
    ],
    ticketLinks: [{ label: "호텔 예약 확인서", href: "/documents" }],
  },
  {
    id: "outbound-later",
    date: "2026-08-06",
    title: "Yongwoon · Yireh 출국",
    city: "인천(ICN) → 토론토(YYZ)",
    stay: "1445 Coral Spgs Path, ON",
    summary: "나중에 출발하는 2명의 출국 일정입니다.",
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
    ],
    ticketLinks: [{ label: "eTicket 보기", href: "/documents" }],
  },
  {
    id: "toronto-airport-hotel",
    date: "2026-08-13",
    title: "토론토공항 호텔 숙박",
    city: "미시소가 (ON)",
    stay: "Hilton Toronto Airport Hotel & Suites",
    summary: "가족 모두 귀국 전날 토론토 공항 근처에서 숙박합니다.",
    legs: [
      {
        title: "체크인",
        time: "8월 13일 15:00",
        description: "Hilton Toronto Airport Hotel & Suites",
        location: "Mississauga, ON",
      },
      {
        title: "체크아웃",
        time: "8월 14일 12:00",
        description: "귀국 당일 호텔에서 하원 후 공항으로 이동",
        location: "Mississauga, ON",
      },
    ],
    ticketLinks: [{ label: "호텔 예약 확인서", href: "/documents" }],
  },
  {
    id: "return-together",
    date: "2026-08-14 (+1)",
    title: "가족 함께 귀국",
    city: "토론토(YYZ) → 인천(ICN)",
    stay: "귀국편",
    summary: "가족 모두 함께 귀국합니다.",
    legs: [
      {
        title: "토론토 출발",
        time: "12:55",
        description: "토론토 피어슨 국제공항 터미널 3 (YYZ)",
        location: "YYZ Terminal 3",
      },
      {
        title: "인천 도착",
        time: "16:30 (+1일)",
        description: "서울/인천국제공항 터미널 2 (ICN)",
        location: "ICN Terminal 2",
      },
    ],
    ticketLinks: [{ label: "eTicket 보기", href: "/documents" }],
  },
];

export const uploadSlots: UploadSlot[] = [
  ...familyMembers.map((person) => ({
    id: `eta-${person.toLowerCase()}`,
    person,
    documentType: "eTA",
    description: `${person} eTA`,
    category: "eta" as const,
  })),
  ...familyMembers.flatMap((person) => [
    {
      id: `eticket-outbound-${person.toLowerCase()}`,
      person,
      documentType: "출국 eTicket",
      description: `${person} 출국 항공권`,
      category: "eticket" as const,
    },
    {
      id: `eticket-return-${person.toLowerCase()}`,
      person,
      documentType: "귀국 eTicket",
      description: `${person} 귀국 항공권`,
      category: "eticket" as const,
    },
  ]),
  {
    id: "hotel-incheon-airport",
    person: "Yongwoon · Yireh",
    documentType: "인천공항 호텔 예약",
    description: "Howard Johnson by Wyndham Incheon Airport 확인서",
    category: "hotel",
  },
  {
    id: "hotel-toronto-airport",
    person: "가족",
    documentType: "토론토공항 호텔 예약",
    description: "Hilton Toronto Airport Hotel & Suites 확인서",
    category: "hotel",
  },
  {
    id: "car-reservation",
    person: "가족",
    documentType: "차량 예약 확인증",
    description: "렌터카 예약 확인 파일",
    category: "car",
  },
];

export const defaultSharedDetails: SharedDetails = {
  canadaPhoneNumber: "",
  carNumber: "",
};
