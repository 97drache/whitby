import { rentalCar, tripOverview } from "@/data/trip-data";

export type ImmigrationQA = {
  id: string;
  questionKo: string;
  questionEn: string;
  answerKo: string;
  answerEn: string;
};

/** 캐나다 입국심사 대비 Q&A — 숙소는 친구집(1445 Coral Spgs Path) 기준 */
export const immigrationTips = [
  "짧고 솔직하게 영어로 답하세요. 모르는 말은 “Sorry, I don’t understand”라고 해도 됩니다.",
  "여권, eTA, 왕복 항공권, 숙소 주소(친구집)를 바로 보여줄 수 있게 준비하세요.",
  "가족이 함께이면 보통 한 명이 대표로 답하고, 나머지는 옆에서 확인만 해도 됩니다.",
];

export const immigrationQA: ImmigrationQA[] = [
  {
    id: "purpose",
    questionKo: "여행 목적이 무엇인가요?",
    questionEn: "What is the purpose of your trip?",
    answerKo: "관광과 친구 방문입니다. 가족과 함께 캐나다를 여행하러 왔습니다.",
    answerEn: "Tourism and visiting a friend. I'm traveling with my family.",
  },
  {
    id: "stay-length",
    questionKo: "얼마나 머무를 예정인가요?",
    questionEn: "How long will you stay?",
    answerKo:
      "약 3~4주입니다. (먼저 오는 사람: 7월 20일~8월 14일 / 나중에 오는 사람: 8월 6일~8월 14일) 귀국 항공권은 이미 있습니다.",
    answerEn:
      "About 3–4 weeks. We already have return tickets for August 14.",
  },
  {
    id: "where-stay",
    questionKo: "어디에 숙박하나요?",
    questionEn: "Where will you stay?",
    answerKo: `온타리오에 있는 친구 집에서 지냅니다. 주소는 ${tripOverview.stayAddress}입니다.`,
    answerEn: `At a friend's house in Ontario. The address is ${tripOverview.stayAddress}.`,
  },
  {
    id: "who-friend",
    questionKo: "그 친구는 누구인가요? / 어떻게 아시나요?",
    questionEn: "Who is the friend? / How do you know them?",
    answerKo:
      "캐나다에 사는 친구입니다. 친구 집에 머물며 주변을 관광할 예정입니다.",
    answerEn:
      "A friend who lives in Canada. We’ll stay at their house and travel around.",
  },
  {
    id: "who-with",
    questionKo: "누구와 함께 오셨나요?",
    questionEn: "Who are you traveling with?",
    answerKo:
      "가족 4명입니다. Yongwoon, Miyoung, Yireh, Yiel입니다. (함께 도착하지 않더라도 같은 여행입니다.)",
    answerEn:
      "My family of four: Yongwoon, Miyoung, Yireh, and Yiel. We’re on the same trip.",
  },
  {
    id: "return",
    questionKo: "귀국 항공권이 있나요?",
    questionEn: "Do you have a return ticket?",
    answerKo: "네, 8월 14일 토론토(YYZ)에서 인천(ICN)으로 돌아가는 항공권이 있습니다.",
    answerEn: "Yes. We have return tickets from Toronto (YYZ) to Incheon (ICN) on August 14.",
  },
  {
    id: "money",
    questionKo: "체류 중 경비는 어떻게 마련하나요?",
    questionEn: "How will you pay for your stay?",
    answerKo: "본인 자금과 신용카드로 여행 경비를 충당합니다. 일을 하러 온 것이 아닙니다.",
    answerEn:
      "With our own money and credit cards. We’re not here to work.",
  },
  {
    id: "work",
    questionKo: "캐나다에서 일할 예정인가요?",
    questionEn: "Will you work in Canada?",
    answerKo: "아니요. 관광과 친구 방문만 할 예정입니다. 취업이 목적이 아닙니다.",
    answerEn: "No. Only tourism and visiting a friend. We’re not coming to work.",
  },
  {
    id: "job-home",
    questionKo: "한국에서 직업은 무엇인가요?",
    questionEn: "What do you do for work in Korea?",
    answerKo:
      "(본인 직업에 맞게 짧게) 예: “저는 ○○입니다. 휴가 후 한국으로 돌아갑니다.”",
    answerEn:
      "(Say your real job briefly.) Example: “I work as ____. I’ll return to Korea after this trip.”",
  },
  {
    id: "cities",
    questionKo: "어디에 갈 예정인가요?",
    questionEn: "Where will you visit?",
    answerKo:
      "온타리오 주, 특히 숙소 근처인 Whitby / Greater Toronto 일대에서 가족과 관광할 예정입니다.",
    answerEn:
      "Ontario, mainly around Whitby and the Greater Toronto area with my family.",
  },
  {
    id: "car",
    questionKo: "이동은 어떻게 하나요? / 렌터카가 있나요?",
    questionEn: "How will you get around? / Do you have a rental car?",
    answerKo: `네, 렌터카(${rentalCar.model})를 이용합니다. 토론토 근처에서 픽업합니다.`,
    answerEn: `Yes, we have a rental car (${rentalCar.model}) picked up near Toronto.`,
  },
  {
    id: "previous",
    questionKo: "이전에 캐나다에 오신 적 있나요?",
    questionEn: "Have you visited Canada before?",
    answerKo:
      "(사실대로) 예/아니요. 이번에 다시(또는 처음) 가족과 관광하러 왔습니다.",
    answerEn:
      "(Answer honestly.) Yes/No. This time I’m visiting again (or for the first time) with my family.",
  },
  {
    id: "bring",
    questionKo: "가져오신 물건은 무엇인가요? (신고 관련)",
    questionEn: "What are you bringing into Canada?",
    answerKo:
      "개인 여행용품만 있습니다. 상업용 물품은 없고, 농산물·육류 등은 없습니다. (있으면 사실대로 신고)",
    answerEn:
      "Only personal belongings for travel. No commercial goods, and no food/plant/animal products. (Declare anything if you have it.)",
  },
  {
    id: "address-card",
    questionKo: "숙소 주소를 적어 주세요 / 보여 주세요.",
    questionEn: "Please write / show your address in Canada.",
    answerKo: tripOverview.stayAddress,
    answerEn: tripOverview.stayAddress,
  },
];
