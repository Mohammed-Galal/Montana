import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import isMobileView from "../shared/isMobile.js";
import store from "../store";
import getPage, { getActiveLang } from "../translation.js";
import pageMap from "./pageMap.js";

import About from "./About.jsx";
import Alerts from "./Alerts";
import All_Products from "./All_Products.jsx";
import Bookings from "./Bookings";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Design from "./Design/index.jsx";
import FAQs from "./FAQs/index.jsx";
import HomePage from "./Home";
import Invoice from "./Invoice.jsx";
import Product from "./Product";
import Restaurant from "./Restaurant";
import Settings from "./Settings";
import User from "./User";

import Header from "../Header";
import Nav from "../Nav";
import Footer from "../Footer.jsx";
import Jobs from "./Jobs.jsx";
import NotFound from "./NotFound.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import DownloadForm from "../Header/DownloadForm.jsx";

const pageMapArr = Object.keys(pageMap);

function updateMetaElData(data, value) {
  const currEl = document.querySelector(
    "meta[" + data.keyName + "='" + data[data.keyName] + "']",
  );

  try {
    currEl.setAttribute(data.keyName, data[data.keyName]);
    currEl.setAttribute("content", value);
  } catch {}
}

const activeLang = getActiveLang(),
  seoTags = [
    {
      property: "og:title",
      keyName: "property",
      contentKey: "seoOgTitle",
    },
    {
      property: "og:description",
      keyName: "property",
      contentKey: "seoOgDescription",
    },
    {
      property: "og:image",
      keyName: "property",
      contentKey: "seoOgImage",
    },
    {
      name: "twitter:title",
      keyName: "name",
      contentKey: "seoTwitterTitle",
    },
    {
      name: "twitter:description",
      keyName: "name",
      contentKey: "seoTwitterDescription",
    },
    {
      name: "twitter:image",
      keyName: "name",
      contentKey: "seoTwitterImage",
    },
  ];

const getText = getPage("popup"),
  body = document.body,
  header = document.createElement("header"),
  downloadDialog = document.createElement("section"),
  nav = document.querySelector("nav"),
  footer = document.querySelector("body > footer");

isMobileView && (body.id = "mobile");
downloadDialog.id = "download-form";
downloadDialog.className = "d-none d-md-flex";
body.prepend(header);
body.prepend(downloadDialog);

let pageTitles = null;

export default (
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
    <Popups />
  </React.StrictMode>
);

function App() {
  const storeDefined = window.localStorage.getItem("slug");
  const appSettings = useSelector((e) => e.settings);
  const [titlesLoaded, setTitlesLoaded] = useState(false),
    location = useLocation(),
    showPopup = !storeDefined && location.pathname !== "/restaurant";

  !titlesLoaded &&
    fetch("/assets/page-title.json")
      .then((r) => r.json())
      .then((r) => {
        pageTitles = r;
        setTitlesLoaded(true);
      });

  useEffect(() => {
    window.scrollTo(0, 0);
    body.style.overflow = showPopup ? "hidden" : "auto";
  }, [location]);

  if (titlesLoaded === false) return null;
  if (!appSettings.loaded) return null;

  appSettings.data && setDocTitle(appSettings.data);

  return (
    <>
      {createPortal(<DownloadForm />, downloadDialog)}
      {createPortal(Header(isMobileView), header)}

      <SearchBar currRoute={location.pathname} />

      {showPopup && (
        <>
          <Restaurant isPopup={true} />
          <div className="dismisser"></div>
        </>
      )}

      <Routes>
        <Route path="/" caseSensitive={true} Component={HomePage} />
        <Route path="/jobs/:jobId?" Component={Jobs} />
        <Route path="/faq" Component={FAQs} />
        <Route path="/restaurant" Component={Restaurant} caseSensitive={true} />
        <Route path="/about-us" Component={About} caseSensitive={true} />
        <Route
          path="/all-products/:category?"
          Component={All_Products}
          caseSensitive={true}
        />
        <Route path="/invoice/:id?" Component={Invoice} caseSensitive={true} />
        <Route path="/alerts" Component={Alerts} caseSensitive={true} />
        <Route path="/user/:action?" Component={User} />
        <Route path="/settings/:tab?" Component={Settings} />
        <Route
          path="/products/:slug"
          caseSensitive={true}
          Component={Product}
        />
        <Route
          path="/early-booking"
          caseSensitive={true}
          Component={Bookings}
        />
        <Route
          path={"/design/:style?"}
          caseSensitive={true}
          Component={Design}
        />
        <Route path="/cart" Component={Cart} caseSensitive={true} />
        <Route path="/checkout" Component={Checkout} caseSensitive={true} />

        <Route path="/privacy-policy" Component={PrivacyPolicy} />

        <Route path="*" Component={NotFound} />
      </Routes>
      {createPortal(Nav(isMobileView), nav)}
      {createPortal(Footer(), footer)}
    </>
  );
}

function SearchBar({ currRoute }) {
  const products = useSelector((e) => e.Products),
    redirect = useNavigate(),
    [searchParams] = useSearchParams();

  if (/^\/?$/.test(currRoute)) return null;

  const isArabic = getActiveLang() === "العربية",
    brandName = isArabic ? "مونتانا" : "Montana",
    breadcrumbTarget = pageMapArr.find((e) =>
      new RegExp("^" + e).test(currRoute),
    );

  let breadcrumbData =
    brandName + " / " + (pageMap[breadcrumbTarget] || []).join(" / ");

  if (new RegExp("^/products")) {
    const productId = searchParams.get("id"),
      isCustom = +searchParams.get("isCustom"),
      targetProductsContainer = products[isCustom ? "early_booking" : "data"];
    if (targetProductsContainer.length && productId) {
      const targetProduct = targetProductsContainer.find(
          (e) => +e.id === +productId,
        ),
        productName = isArabic ? targetProduct.name_ar : targetProduct.name;
      breadcrumbData += " / " + productName;
    }
  }

  return (
    <div
      // dir="rtl"
      id="mobile-back"
      className="align-items-center d-flex d-lg-none gap-3 p-2"
      style={{
        background: "aliceblue",
        zIndex: "3",
        position: "sticky",
        top: "0",
        left: "0",
        right: "0",
      }}
    >
      <button
        className="btn"
        onClick={() => redirect(-1)}
        style={{
          transform:
            "rotateY(" + (getActiveLang() === "العربية" ? 180 : 0) + "deg)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="16"
          fill="none"
          className="has-color fill-current text-blue rtl:rotate-180"
        >
          <path
            fill="var(--primary)"
            d="M19.167 7.111H2.844L8.09 1.517a.93.93 0 0 0 0-1.256.796.796 0 0 0-1.179 0L.243 7.37a.945.945 0 0 0 0 1.259l6.667 7.11c.163.173.376.26.59.26a.8.8 0 0 0 .589-.26.93.93 0 0 0 0-1.257L2.844 8.889h16.323c.46 0 .833-.398.833-.889 0-.49-.373-.889-.833-.889"
          ></path>
        </svg>
      </button>

      <span
        style={{
          color: "var(--midgray)",
        }}
      >
        {breadcrumbData}
      </span>
    </div>
  );
}

function Popups() {
  return (
    <>
      <div
        id="wrong-credentials"
        popover="auto"
        className="px-5 py-4 text-danger"
        style={{
          borderRadius: "8px",
          borderColor: "#f0f8ff",
          background: "#fff",
          animation: "reveal 1s ease",
          boxShadow: "rgb(0, 0, 0, 0.2) 2px 2px 8px 0px",
        }}
      >
        {getText(0)}
      </div>

      <div
        id="used-account"
        popover="auto"
        className="px-5 py-4 text-danger"
        style={{
          borderRadius: "8px",
          borderColor: "#f0f8ff",
          background: "#fff",
          animation: "reveal 1s ease",
          boxShadow: "rgb(0, 0, 0, 0.2) 2px 2px 8px 0px",
        }}
      >
        {getText(1)}
      </div>
    </>
  );
}

function setDocTitle(appSettings) {
  const docPath = window.location.pathname;
  seoTags.forEach((data) =>
    updateMetaElData(data, appSettings[data.contentKey]),
  );

  let index = 0,
    nameKey = "name",
    prefixKey = "prefix";

  if (activeLang === "العربية") {
    nameKey = "name_ar";
    prefixKey = "AR_prefix";
  }

  while (index < pageTitles.configs.length) {
    const iPath = pageTitles.configs[index++],
      isExact = iPath.exact,
      path = "^" + iPath.path + (isExact ? "/?$" : ""),
      regEx = new RegExp(path);

    if (regEx.test(docPath)) {
      let resultStr = pageTitles[prefixKey] || appSettings.seoMetaTitle || "";

      if (iPath[nameKey]) {
        resultStr += pageTitles.seperator + iPath[nameKey];
      }

      document.title = resultStr;

      document
        .querySelector('meta[name="description"]')
        .setAttribute("content", appSettings.seoMetaDescription);

      break;
    }
  }
}
