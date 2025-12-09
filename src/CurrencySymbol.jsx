import { useSelector } from "react-redux";
import { getActiveLang } from "./translation";
import SAR from "./icons/Sar.jsx";

const isArabic = getActiveLang() === "العربية";

export default function () {
  const CS = useSelector((e) => e.settings).data;

  return SAR;
  return isArabic ? CS.currencyFormat : CS.currencyId;
}
