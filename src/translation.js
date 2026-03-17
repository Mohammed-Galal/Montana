const observers = [];

let lang = "العربية",
  keys,
  file;

async function initLangs(callback) {
  const activeLang = window.localStorage.getItem("lang"),
    langsMap = await fetch("/assets/languages/map.json", {
      method: "GET",
    }).then((r) => r.json());

  keys = Object.keys(langsMap);
  activeLang && (lang = activeLang);

  file = await fetch("/assets/languages/" + langsMap[lang]).then((r) =>
    r.json(),
  );

  document.body.dir = lang === "العربية" ? "rtl" : "ltr";

  window.localStorage.setItem("lang", lang);
  observers.forEach((o) => o());
  callback();
}

export { keys, initLangs, observeLang, getActiveLang, inlineArEn };

export default function getPage(pageName) {
  return function (phraseIndex) {
    try {
      return file[pageName][phraseIndex];
    } catch {
      debugger;
    }
  };
}

function getActiveLang() {
  return window.localStorage.getItem("lang") || lang;
}

function observeLang(observer) {
  observers.push(observer);
}

function inlineArEn(arabic, english) {
  return lang === "العربية" ? arabic : english;
}