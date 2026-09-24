import { Category } from "@/types/civic";

export const CIVIC_CATEGORIES: Category[] = [
  {
    id: "garbage",
    name: {
      en: "Garbage & Sanitation",
      ur_roman: "Kachra aur Safai",
      ur: "کوڑا کرکٹ اور صفائی",
    },
    iconName: "Trash2",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Sanitary Inspector / SSWMB",
    scoredInMVP: true,
    color: "#D97706", // Amber 600
    bgTint: "#FEF3C7", // Amber 100
  },
  {
    id: "drains",
    name: {
      en: "Drains & Sewerage",
      ur_roman: "Gutter aur Sewerage",
      ur: "گٹر اور نکاسی آب",
    },
    iconName: "Waves",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Sanitation / KWSC",
    scoredInMVP: true,
    color: "#2563EB", // Blue 600
    bgTint: "#DBEAFE", // Blue 100
  },
  {
    id: "streetlights",
    name: {
      en: "Streetlights",
      ur_roman: "Street Light",
      ur: "اسٹریٹ لائٹس",
    },
    iconName: "Lightbulb",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Electrical Works",
    scoredInMVP: true,
    color: "#EAB308", // Yellow 500
    bgTint: "#FEF9C3", // Yellow 100
  },
  {
    id: "streets",
    name: {
      en: "Streets & Paving",
      ur_roman: "Sarkain aur Khaday",
      ur: "سڑکیں اور کھڈے",
    },
    iconName: "Construction",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Works / Town Road Dept",
    scoredInMVP: true,
    color: "#EA580C", // Orange 600
    bgTint: "#FFEDD5", // Orange 100
  },
  {
    id: "parks",
    name: {
      en: "Parks & Public Spaces",
      ur_roman: "Parks aur Maidan",
      ur: "پارکس اور عوامی مقامات",
    },
    iconName: "Trees",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Horticulture / Town Parks",
    scoredInMVP: true,
    color: "#16A34A", // Green 600
    bgTint: "#DCFCE7", // Green 100
  },
  {
    id: "encroachment",
    name: {
      en: "Encroachment",
      ur_roman: "Tajawozat / Footpath Band",
      ur: "تجاوزات اور راستے کی بندش",
    },
    iconName: "ShieldAlert",
    responsibleLevel: "town",
    responsibleBodyDefault: "Town Anti-Encroachment Dept",
    scoredInMVP: true,
    color: "#9333EA", // Purple 600
    bgTint: "#F3E8FF", // Purple 100
  },
  {
    id: "strays",
    name: {
      en: "Stray Animals & Pests",
      ur_roman: "Awara Kuttay aur Spray",
      ur: "آوارہ کتے اور اسپرے",
    },
    iconName: "Bug",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Health & Dog Bite Team",
    scoredInMVP: true,
    color: "#C026D3", // Fuchsia 600
    bgTint: "#FAE8FF", // Fuchsia 100
  },
  {
    id: "public_health",
    name: {
      en: "Public Health & Hygiene",
      ur_roman: "Kharab Paani aur Waba",
      ur: "عوامی صحت اور صفائی",
    },
    iconName: "HeartPulse",
    responsibleLevel: "uc",
    responsibleBodyDefault: "UC Public Health Officer",
    scoredInMVP: true,
    color: "#DC2626", // Red 600
    bgTint: "#FEE2E2", // Red 100
  },
  {
    id: "water_supply",
    name: {
      en: "Water Supply",
      ur_roman: "Paani ki Qillat / Line Leakage",
      ur: "پانی کی فراہمی",
    },
    iconName: "Droplets",
    responsibleLevel: "utility",
    responsibleBodyDefault: "KWSC (Karachi Water Board)",
    scoredInMVP: false,
    color: "#0284C7", // Sky 600
    bgTint: "#E0F2FE", // Sky 100
  },
  {
    id: "electricity",
    name: {
      en: "Electricity Outage & Wires",
      ur_roman: "Bijli / Lataktay Taar",
      ur: "بجلی اور لٹکتے تار",
    },
    iconName: "Zap",
    responsibleLevel: "utility",
    responsibleBodyDefault: "K-Electric",
    scoredInMVP: false,
    color: "#CA8A04", // Yellow 600
    bgTint: "#FEF08A", // Yellow 200
  },
  {
    id: "gas",
    name: {
      en: "Gas Pressure / Leakage",
      ur_roman: "Sui Gas ka Masla",
      ur: "سوئی گیس کا مسئلہ",
    },
    iconName: "Flame",
    responsibleLevel: "utility",
    responsibleBodyDefault: "SSGC",
    scoredInMVP: false,
    color: "#059669", // Emerald 600
    bgTint: "#D1FAE5", // Emerald 100
  },
  {
    id: "other",
    name: {
      en: "Other Civic Problem",
      ur_roman: "Deegar Masla",
      ur: "دیگر مسائل",
    },
    iconName: "HelpCircle",
    responsibleLevel: "other",
    responsibleBodyDefault: "Admin Jurisdiction Review",
    scoredInMVP: false,
    color: "#4B5563", // Gray 600
    bgTint: "#F3F4F6", // Gray 100
  },
];
