/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import S, { getFavourites } from "../../store";
import "./index.scss";
import getPage, { getActiveLang } from "../../translation";
import CurrencySymbol from "../../CurrencySymbol";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import EggRoundedIcon from "@mui/icons-material/EggRounded";

const nutritionInfo = window.Nutriants,
  Nutriants = Object.keys(nutritionInfo);

const emptyArr = [],
  getText = getPage("productItem"),
  dispatch = S.dispatch,
  isArabic = getActiveLang() === "العربية",
  nameTarget = isArabic ? "name_ar" : "name";

const priceTypes = window.priceTypes,
  Base = process.env.REACT_APP_API_URL,
  baseUrl = Base + "/" + "public/api";

const titleClassName = "m-0 " + (window.innerWidth > 768 ? "h5" : "h6");

export default function (item, i) {
  return <ProductItem item={item} I={i} />;
}

function ProductItem({ item, I }) {
  if (item.visible === 0) return false;

  let product,
    quantity = 0;

  const isActive = !!item.is_active && item.stock > 0,
    priceType = isArabic
      ? priceTypes[item.price_type]
      : item.price_type.replace(/_/g, " ").toUpperCase(),
    store = S.getState(),
    { fav: favs } = store.Products,
    { loaded } = store.User,
    isHearted = favs.some((e) => e.id === item.id),
    { image, is_new } = item,
    price = +item.price,
    old_price = +item.old_price,
    discount = old_price > price && (
      <span>
        {parseInt(100 - (price / old_price) * 100)}% <sub>{getText(0)}</sub>
      </span>
    ),
    key = item.item_category_id * item.restaurant_id + I;

  const cartItemRef = store.Products.cart.find((i) => i.id === item.id);

  if (cartItemRef) {
    quantity = cartItemRef.quantity;
  }

  const vid = (
    <div
      onClick={toggleFav}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        maxWidth: "45px",
        height: "34px",
      }}
    >
      <video
        src="/assets/heart.mp4"
        style={{ maxHeight: "84px", marginLeft: "-17px" }}
        ref={handleFav}
      ></video>
    </div>
  );

  function toggleFav() {
    product && product.classList.add("loading");

    fetch(baseUrl + "/toggle-favorite-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ id: item.id }),
    })
      .then((res) => res.json())
      .then(getFavourites);
  }

  function handleFav(self) {
    if (self === null) return;
    let timeout;

    (isHearted ? play : reverse)();

    function play() {
      if (self.currentTime > 2.605639) return clearTimeout(timeout);
      self.currentTime += 0.1;
      timeout = setTimeout(play, 30);
    }

    function reverse() {
      if (self.currentTime > 0) {
        self.currentTime -= 0.1;
        timeout = setTimeout(reverse, 30);
      } else return clearTimeout(timeout);
    }
  }

  const href =
    "/products/" +
    (item.slug || "product-item") +
    "?id=" +
    item.id +
    "&isCustom=" +
    +(item.category_name === "الحجز المبكر");

  return (
    <div
      key={key}
      ref={(e) => {
        product = e;
        e && e.classList.remove("loading");
      }}
      className={
        "d-flex flex-column position-relative product-item px-3 py-4 gap-2" +
        (isActive ? "" : " disabled")
      }
    >
      <div className="align-items-center d-flex justify-content-between">
        <div className="d-flex gap-1">
          {is_new ? <span>{getText(2)}</span> : ""}
          {discount}
        </div>

        {loaded && vid}
      </div>

      <Link to={href}>
        <img
          loading="lazy"
          src={Base + image}
          alt={item[nameTarget]}
          style={{
            aspectRatio: "var(--img-aspect-ratio)",
          }}
        />
      </Link>

      <div className="desc">
        <Link
          to={href}
          className="text-decoration-none d-flex flex-column gap-2"
        >
          <h6
            className={titleClassName}
            style={{
              height: "3.1rem",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
              overflowWrap: "break-word",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {item[nameTarget] || item.name}
          </h6>

          <div className="align-items-center d-grid gap-1 rate">
            <object
              data="/assets/home/icons/star.svg"
              type="image/svg+xml"
            ></object>

            {4.7}

            {item.category_name && (
              <span className="align-items-center d-flex">
                {item.category_name}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-semibold" style={{ fontSize: "12px" }}>
              {nutritionInfo.calories.icon} {item.calories}{" "}
              {nutritionInfo.calories[isArabic ? "ar" : "en"]}
            </span>

            <Facts src={item} />
          </div>

          <div className="align-items-center d-flex price">
            {old_price > 0 && (
              <sub style={{ marginInlineEnd: "4px" }}>
                <del>{old_price}</del>
              </sub>
            )}
            <span>
              {price} <CurrencySymbol />
            </span>
            /{priceType}
          </div>
        </Link>
      </div>

      {isActive ? (
        <div className="actions gap-3 mt-2">
          <button
            className="align-items-center btn d-flex justify-content-center p-0"
            onClick={inc}
          >
            +
          </button>
          {quantity}
          <button
            className="align-items-center btn d-flex justify-content-center p-0"
            onClick={dec}
          >
            -
          </button>

          {/* <button
              type="button"
              className="align-items-center btn d-flex justify-content-center p-0 flex-grow-1"
              onClick={addItemToCart}
            >
              <span className="d-flex align-items-center justify-content-center text-capitalize">
                {getText(4)}
              </span>
              <img src="/assets/home/icons/mdi-light_cart.svg" alt="Cart" />
            </button> */}
        </div>
      ) : (
        <button
          className="btn py-1 mt-2"
          style={{
            color: "var(--bs-danger)",
            border: "none",
            fontSize: "small",
            width: "100%",
          }}
        >
          {getText(5)}
        </button>
      )}
    </div>
  );

  function inc() {
    if (Number.isInteger(item.stock) && quantity < item.stock) {
      quantity++;
      applyToCart();
    }
  }

  function dec() {
    quantity = Math.max(quantity - 1, 0);
    applyToCart();
  }

  function applyToCart() {
    const restaurant_id = store.Restaurant.data.id;
    dispatch({
      type: "products/addToCart",
      payload: {
        slug: item.slug,
        quantity,
        img: item.image,
        // is_special: item.category_name === "الحجز المبكر",
        restaurant_id: +restaurant_id,
        id: item.id,
        name: item.name,
        name_ar: item.name_ar,
        category_name: item.category_name,
        category_id: item.item_category_id,
        price: +item.price,
        addons: emptyArr,
        // totalPrice: quantity * price,
      },
    });
  }
}

function Facts({ src }) {
  const hasNut = Nutriants.filter((n) => n !== "calories").some(
    (n) => !!src[n]
  );

  if (!hasNut) return null;

  return (
    <Tooltip
      // placement={isArabic ? "right" : "left"}
      placement="top"
      title={
        <ul
          className="d-grid m-0 nutrations-list px-1 py-1 row-gap-1 gap-1 small"
          style={{ gridTemplateColumns: "auto auto" }}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Nutriant keyName="caffeine" />
          <Nutriant keyName="calcium" />
          {/* <Nutriant keyName="calories" /> */}
          <Nutriant keyName="carbohydrates" />
          <Nutriant keyName="cholesterol" />
          <Nutriant keyName="dietary_fiber" />
          <Nutriant keyName="fats" />
          <Nutriant keyName="refined_sugars" />
          <Nutriant keyName="protein" />
          <Nutriant keyName="potassium" />
          <Nutriant keyName="iron" />
          <Nutriant keyName="saturated_fat" />
          <Nutriant keyName="sodium" />
          <Nutriant keyName="trans_fat" />
          <Nutriant keyName="sugars" />
        </ul>
      }
    >
      <Button
        style={{
          color: "var(--primary)",
          gap: "4px",
          font: "inherit",
          marginInlineStart: "auto",
          fontWeight: "600",
        }}
      >
        <InfoOutlineRoundedIcon />
        <span className="fw-semibold" style={{ fontSize: "12px" }}>
          حقائق تغذوية
        </span>
      </Button>
    </Tooltip>
  );

  function Nutriant({ keyName }) {
    if (!src[keyName]) return null;

    const targetItem = nutritionInfo[keyName];

    return (
      <li
        className="align-items-center d-flex gap-1"
        data-icon={targetItem.icon}
      >
        {src[keyName]} {targetItem[isArabic ? "ar" : "en"].toUpperCase()}
      </li>
    );
  }
}
