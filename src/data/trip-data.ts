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
};

export type SharedDetails = {
  canadaPhoneNumber: string;
  carNumber: string;
};

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
    ticketLinks: [{ label: "출국 eTicket 보기", href: "/documents" }],
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
    ticketLinks: [{ label: "출국 eTicket 보기", href: "/documents" }],
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
    ticketLinks: [{ label: "귀국 eTicket 보기", href: "/documents" }],
  },
];

export const uploadSlots: UploadSlot[] = [
  { id: "eta-yongwoon", person: "Yongwoon", documentType: "eTA", description: "Yongwoon eTA" },
  { id: "eta-miyoung", person: "Miyoung", documentType: "eTA", description: "Miyoung eTA" },
  { id: "eta-yireh", person: "Yireh", documentType: "eTA", description: "Yireh eTA" },
  { id: "eta-yiel", person: "Yiel", documentType: "eTA", description: "Yiel eTA" },
  { id: "eticket-outbound", person: "가족", documentType: "출국 eTicket", description: "출국 항공권 파일" },
  { id: "eticket-return", person: "가족", documentType: "귀국 eTicket", description: "귀국 항공권 파일" },
  { id: "car-reservation", person: "가족", documentType: "차량 예약 확인증", description: "렌터카 예약 확인 파일" },
];

export const defaultSharedDetails: SharedDetails = {
  canadaPhoneNumber: "",
  carNumber: "",
};