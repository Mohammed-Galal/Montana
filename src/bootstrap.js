const version = "12.0.00",
  activeVer = window && window.localStorage.getItem("ver");

window.priceTypes = {
  piece: "للقطعة",
  quarter_kilo: "للربع كيلو",
  half_kilo: "للنصف كيلو",
  one_kilo: "للكيلو",
};

if (activeVer !== version && window) {
  window.localStorage.clear();
  window.localStorage.setItem("ver", version);
}

window.Nutriants = {
  caffeine: {
    en: "caffeine",
    ar: "كافيين",
    icon: "☕",
  },
  calcium: {
    en: "calcium",
    ar: "كالسيوم",
    icon: "🥛",
  },
  calories: {
    en: "calories",
    ar: "سعرات حرارية",
    icon: "🔥",
  },
  carbohydrates: {
    en: "carbohydrates",
    ar: "كربوهيدرات",
    icon: "🍞",
  },
  cholesterol: {
    en: "cholesterol",
    ar: "كوليسترول",
    icon: "🫀",
  },
  dietary_fiber: {
    en: "dietary_fiber",
    ar: "ألياف غذائية",
    icon: "🌾",
  },
  fats: {
    en: "fats",
    ar: "دهون",
    icon: "🧈",
  },
  iron: {
    en: "iron",
    ar: "حديد",
    icon: "🧲",
  },
  potassium: {
    en: "potassium",
    ar: "بوتاسيوم",
    icon: "🍌",
  },
  protein: {
    en: "protein",
    ar: "بروتين",
    icon: "🍗",
  },
  refined_sugars: {
    en: "refined_sugars",
    ar: "سكريات مكررة",
    icon: "🍭",
  },
  saturated_fat: {
    en: "saturated_fat",
    ar: "دهون مشبعة",
    icon: "🍔",
  },
  sodium: {
    en: "sodium",
    ar: "صوديوم",
    icon: "🧂",
  },
  sugars: {
    en: "sugars",
    ar: "سكريات",
    icon: "🍬",
  },
  trans_fat: {
    en: "trans_fat",
    ar: "دهون متحولة",
    icon: "🧈",
  },
};