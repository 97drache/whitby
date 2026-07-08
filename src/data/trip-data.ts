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
  title: "Our Canada Trip",
  subtitle:
    "A simple, bright family page for flights, documents, and the little details that help everyone feel ready.",
  destination: "Ontario, Canada",
  travelWindow: "2026-10-03 to 2026-10-11",
  countdownLabel: "Bright, simple, and easy for kids to follow.",
  family: [
    {
      name: "Yongwoon",
      note: "Travels later with Yireh, returns together with the family.",
      departureGroup: "Late departure",
    },
    {
      name: "Miyoung",
      note: "Leaves first with Yiel.",
      departureGroup: "Early departure",
    },
    {
      name: "Yireh",
      note: "Travels later with Yongwoon.",
      departureGroup: "Late departure",
    },
    {
      name: "Yiel",
      note: "Leaves first with Miyoung.",
      departureGroup: "Early departure",
    },
  ] satisfies FamilyMember[],
  highlights: [
    "Miyoung and Yiel leave first.",
    "Yongwoon and Yireh leave later.",
    "Everyone comes back together.",
  ],
};

export const quickLinks = [
  { label: "Vercel Dashboard", href: "https://vercel.com/dashboard" },
  { label: "Air Canada", href: "https://www.aircanada.com/" },
  { label: "Government of Canada eTA", href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html" },
  { label: "Google Maps", href: "https://maps.google.com/" },
];

export const itinerary: TripDay[] = [
  {
    id: "day-1",
    date: "Oct 3",
    title: "Early departure team leaves",
    city: "Korea -> Canada",
    stay: "1445 Coral Spgs Path, ON",
    summary: "Miyoung and Yiel depart first and head to the family stay in Ontario.",
    legs: [
      {
        title: "Airport departure",
        time: "Add time",
        description: "Miyoung and Yiel check in with passports, eTA, and eTickets.",
      },
      {
        title: "Canada arrival",
        time: "Add arrival time",
        description: "Use the Canadian SIM and share the new local phone number here.",
        reference: "Add airline and booking number",
      },
      {
        title: "Home arrival",
        time: "Add time",
        description: "Settle in at the Ontario address and prepare for the later arrivals.",
        location: "1445 Coral Spgs Path, ON",
      },
    ],
  },
  {
    id: "day-2",
    date: "Oct 4",
    title: "Late departure team leaves",
    city: "Korea -> Canada",
    stay: "1445 Coral Spgs Path, ON",
    summary: "Yongwoon and Yireh travel later and join the rest of the family.",
    legs: [
      {
        title: "Airport departure",
        time: "Add time",
        description: "Yongwoon and Yireh leave with passports, eTA, and eTickets.",
      },
      {
        title: "Family regroup",
        time: "Add time",
        description: "Meet up at the Ontario stay once everyone arrives.",
      },
      {
        title: "First full family evening",
        time: "Evening",
        description: "Simple dinner and rest together.",
      },
    ],
  },
  {
    id: "day-3",
    date: "Oct 5",
    title: "Canada family day",
    city: "Ontario",
    stay: "1445 Coral Spgs Path, ON",
    summary: "Keep plans light and leave room for local driving, shopping, and family time.",
    legs: [
      {
        title: "Rental car pickup",
        time: "Add time",
        description: "Save the car number once the rental is collected.",
      },
      {
        title: "Neighborhood outing",
        time: "Afternoon",
        description: "A simple family outing near the stay.",
      },
      {
        title: "Family planning check",
        time: "Evening",
        description: "Confirm return flight details and the next day's plan.",
      },
    ],
  },
];

export const checklist: ChecklistItem[] = [
  {
    id: "passports",
    title: "Check all passports",
    description: "Confirm expiration date and keep photos/scans ready.",
    due: "6 weeks before departure",
    owner: "Family",
  },
  {
    id: "eta",
    title: "Apply for Canadian eTA",
    description: "Prepare and save separate eTA files for all 4 family members.",
    due: "4 weeks before departure",
    owner: "Miyoung",
  },
  {
    id: "eticket",
    title: "Collect all eTickets",
    description: "Keep 4 separate eTicket files ready for quick access.",
    due: "2 weeks before departure",
    owner: "Miyoung",
  },
  {
    id: "sim",
    title: "Share Canadian phone number",
    description: "Save the local Canadian SIM number once it is activated.",
    due: "Arrival day",
    owner: "Family",
  },
  {
    id: "car",
    title: "Record rental car number",
    description: "Save the vehicle number once the rental pickup is complete.",
    due: "Pickup day",
    owner: "Yongwoon",
  },
];

export const documents: TravelDocument[] = [
  {
    id: "family-eta",
    title: "Family eTA set",
    category: "Entry",
    description: "4 separate eTA files, one for each family member.",
    holder: "Upload on this page or add shared link",
    whenNeeded: "Airport and entry check",
    status: "todo",
  },
  {
    id: "family-eticket",
    title: "Family eTicket set",
    category: "Transport",
    description: "4 separate eTicket files so each traveler can open their own copy.",
    holder: "Upload on this page or add shared link",
    whenNeeded: "Check-in and immigration",
    status: "todo",
  },
  {
    id: "home-address",
    title: "Stay address",
    category: "Stay",
    description: "Family base in Ontario.",
    holder: "Saved on this page",
    whenNeeded: "Arrival and navigation",
    status: "ready",
  },
  {
    id: "shared-trip-notes",
    title: "Shared local details",
    category: "Daily use",
    description: "Canadian phone number and rental car number for easy family access.",
    holder: "Saved on this page",
    whenNeeded: "During the trip",
    status: "check",
  },
];

export const uploadSlots: UploadSlot[] = [
  {
    id: "eta-yongwoon",
    person: "Yongwoon",
    documentType: "eTA",
    description: "Upload Yongwoon's eTA file.",
  },
  {
    id: "eta-miyoung",
    person: "Miyoung",
    documentType: "eTA",
    description: "Upload Miyoung's eTA file.",
  },
  {
    id: "eta-yireh",
    person: "Yireh",
    documentType: "eTA",
    description: "Upload Yireh's eTA file.",
  },
  {
    id: "eta-yiel",
    person: "Yiel",
    documentType: "eTA",
    description: "Upload Yiel's eTA file.",
  },
  {
    id: "eticket-yongwoon",
    person: "Yongwoon",
    documentType: "eTicket",
    description: "Upload Yongwoon's eTicket file.",
  },
  {
    id: "eticket-miyoung",
    person: "Miyoung",
    documentType: "eTicket",
    description: "Upload Miyoung's eTicket file.",
  },
  {
    id: "eticket-yireh",
    person: "Yireh",
    documentType: "eTicket",
    description: "Upload Yireh's eTicket file.",
  },
  {
    id: "eticket-yiel",
    person: "Yiel",
    documentType: "eTicket",
    description: "Upload Yiel's eTicket file.",
  },
];

export const sharedTravelDetails = {
  stayAddress: "1445 Coral Spgs Path, ON",
  rentalCarNumber: "Add rental car number",
  canadaPhoneNumber: "Add Canadian SIM number",
  returnPlan: "Return together as a family",
};

export const infoSections: HandyInfo[] = [
  {
    title: "Stay",
    items: [
      { label: "Address", value: "1445 Coral Spgs Path, ON" },
      { label: "Map note", value: "Save this address in Google Maps before departure" },
      { label: "Return plan", value: "Everyone returns together" },
    ],
  },
  {
    title: "Arrival Essentials",
    items: [
      { label: "Emergency", value: "911" },
      { label: "Currency", value: "Canadian Dollar (CAD)" },
      { label: "Power", value: "Type A/B, 120V" },
    ],
  },
  {
    title: "Shared Local Details",
    items: [
      { label: "Canadian phone", value: "Add Canadian SIM number" },
      { label: "Rental car number", value: "Add vehicle number after pickup" },
      { label: "Family note", value: "Keep all 8 travel files easy to open for every traveler" },
    ],
  },
];
