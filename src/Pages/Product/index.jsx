import getPage from "../../translation";
// eslint-disable-next-line react-hooks/exhaustive-deps
/* eslint-disable import/no-anonymous-default-export */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import productItem from "../../shared/productItem";
import Carousel from "../../shared/Carousel";
import NXT from "../../icons/NXT";
import Cart from "../../icons/Cart";
import Minus from "../../icons/Minus";
import Plus from "../../icons/Plus";
import { getActiveLang } from "../../translation";
import "./index.scss";

const getText = getPage("product"),
  isArabic = getActiveLang() === "العربية",
  priceTypes = window.priceTypes,
  hiddenAlert = { opacity: 0, transform: "translateY(100%)" },
  activeAlert = {
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)",
  },
  baseUrl = process.env.REACT_APP_API_URL,
  docFrag = document.createElement("div");

export default function () {
  const Products = useSelector(($) => $.Products),
    [query] = useSearchParams(),
    id = query.get("id"),
    isCustom = query.get("isCustom");

  const productId = parseInt(id),
    items = Products.data,
    state = items.find((e) => e.id === productId);

  if (!state) return null;

  return (
    <>
      <ProductInfo {...state} />
      <Related
        items={Products.data}
        exclude={state.id}
        categoryID={state.item_category_id}
      />
    </>
  );
}

function ProductInfo(state) {
  let quantity = 0;

  const dispatch = useDispatch(),
    resId = useStore().getState().Restaurant.data.id,
    cartItems = useSelector((e) => e.Products).cart,
    [Alert, setAlert] = useState(false),
    [currCategoryName, setAddonCat] = useState(""),
    [load, update] = useState(false),
    // [quantity, setQuntity] = useState(1),
    selectedAddons = useRef(new Set()).current;

  useEffect(() => {
    Alert &&
      setTimeout(() => {
        selectedAddons.clear();
        // setQuntity(1);
        setAddonCat("");
        setAlert(false);
      }, 3000);
  }, [Alert]);

  const cartRef = cartItems.find((e) => e.id === state.id);
  if (cartRef) {
    quantity = cartRef.quantity;
  }

  const priceType = isArabic
    ? priceTypes[state.price_type]
    : state.price_type.replace(/_/g, " ").toUpperCase();

  const calsTxt = getText(0),
    cals = state.calories && (
      <div
        className="align-items-center d-flex gap-2"
        style={{ maxHeight: "40px" }}
      >
        <img src="/assets/cals.png" alt="cals" />
        <h3 style={{ fontSize: "inherit" }} className="m-0">
          {calsTxt}
        </h3>
        : {state.calories}
      </div>
    );

  const alertState = Alert ? activeAlert : hiddenAlert,
    old_price = +state.old_price,
    discountFlag = old_price > 0 && (
      <span
        className="flag"
        style={{ "--bg": "#e4f4ff", "--color": "var(--primary)" }}
      >
        {parseInt(100 - (+state.price / old_price) * 100)}%
        <sub>{getText(1)}</sub>
      </span>
    );

  // ============================
  let lastAddon,
    totalPrice = +state.price;

  const categories = state.addon_categories,
    currCategory = categories.find((c) => c.name === currCategoryName),
    isSingular = currCategory?.type === "SINGLE",
    addonItems = currCategory?.addons.map((addon) => {
      if (selectedAddons.has(addon)) lastAddon = addon;
      return AddonItem(addon, toggleAddon, selectedAddons.has(addon));
    });

  selectedAddons.forEach((a) => (totalPrice += +a.price));
  totalPrice = totalPrice * quantity;

  function toggleAddon(targetMethod, addon) {
    isSingular && lastAddon && selectedAddons.delete(lastAddon);
    selectedAddons[targetMethod](addon);
    update(!load);
  }

  const productName = (isArabic && state.name_ar) || state.name,
    imageSrc = baseUrl + (state.image || "");
  docFrag.innerHTML = (isArabic && state.desc_ar) || state.desc;

  document.title =
    state.meta_title ||
    (isArabic ? "مونتانا" : "Montana") + " - " + productName;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", state.meta_description);

  return (
    <section
      id="product"
      className="container-fluid container-lg d-flex flex-wrap position-relative"
    >
      <div className="d-flex flex-column justify-content-center py-2">
        <img src={imageSrc} alt="product" />
        {/* <div className="d-flex justify-content-around">
          <img src={imageSrc} alt="product" />
          <img src={imageSrc} alt="product" />
          <img src={imageSrc} alt="product" />
          <img src={imageSrc} alt="product" />
        </div> */}
      </div>

      <div
        className="alert m-0"
        style={{
          ...alertState,
          visibility: "hidden",
          opacity: "0",
          transform: "translateY(100%)",
          width: "100%",
          background: "aliceblue",
          color: "var(--primary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          order: "1",
          position: "absolute",
          zIndex: "2",
          bottom: "60px",
          left: "0px",
          transition: "150ms ease-out",
        }}
      >
        {getText(2)}
        <img
          src={baseUrl + "/assets/animation.gif"}
          style={{ maxHeight: "40px" }}
          alt="loader"
        />
      </div>

      <div className="align-items-start col-12 col-lg d-flex flex-column position-relative">
        {/*
        <ul className="d-flex gap-1 list-unstyled m-0 p-0">
          <li>Montana</li>
          <li>{NXT}</li>
          <li>{getText(3)}</li>
          <li>{NXT}</li>
          <li>{state.name}</li>
        </ul>
        */}

        <h1 className="title h2">{productName}</h1>

        <div className="state text-center d-flex align-items-center gap-2">
          <span
            className="flag"
            style={{
              backgroundColor: state.is_active ? "#5b9c64" : "var(--bs-danger)",
            }}
          >
            {!!state.is_active ? getText(4) : getText(5)}
          </span>
          {+state.price < old_price && discountFlag}
        </div>

        <div
          className="desc w-100"
          dangerouslySetInnerHTML={{
            __html: docFrag.querySelector("td")?.innerHTML,
          }}
        ></div>

        {old_price > 0 && +state.price < old_price && (
          <div>
            <del>
              {state.old_price} {getText(6)}
            </del>
          </div>
        )}

        <div className="price">
          <span>
            {state.price} {getText(6)}
          </span>
          /{priceType}
        </div>

        {cals}

        <div className="align-items-center d-flex rate">
          <img src="/assets/home/icons/star.svg" alt="star" /> 5
          <Link to="/rate">{getText(7)}</Link>
        </div>

        {!!categories.length && (
          <div className="addons d-flex flex-wrap w-100">
            <span className="h5 m-0">{getText(8)}</span>

            <select
              className="input-group-text my-2 text-end w-100"
              style={{ borderColor: "#e9f3fa", outline: "none" }}
              value={currCategoryName}
              onChange={({ target }) => setAddonCat(target.value)}
            >
              <option value="" onClick={() => setAddonCat("")}>
                {getText(9)}
              </option>

              {categories.map((C, I) => (
                <option key={currCategoryName + I} value={C.name}>
                  {C.name}
                </option>
              ))}
            </select>

            <ul className="d-flex flex-wrap gap-2 m-0 p-0 w-100">
              {addonItems}
            </ul>
          </div>
        )}

        {!!state.is_active && (
          <div className="mt-auto align-items-center checkout d-flex gap-3 text-nowrap w-100">
            <button
              type="button"
              className="align-items-center btn d-flex justify-content-center"
              onClick={inc}
            >
              {Plus}
            </button>
            {quantity}
            <button
              type="button"
              className="align-items-center btn d-flex justify-content-center"
              onClick={dec}
            >
              {Minus}
            </button>

            {/* <div
              className="btn d-flex gap-2 align-items-center"
              onClick={addItemToCart}
            >
              {getText(10)}
              {Cart}
            </div> */}

            <span
              className="h5 m-0"
              style={{ fontWeight: "600", color: "var(--primary)" }}
            >
              {totalPrice} {getText(6)}
            </span>
          </div>
        )}

        <div
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "#fff5",
            pointerEvents: "all",
            touchAction: "auto",
            zIndex: "1",
            opacity: Alert ? 0.6 : 1,
            visibility: Alert ? "visible" : "hidden",
            transition: "150ms",
          }}
        >
          <img src={baseUrl + "/assets/img/order-placed.gif"} alt="animation" />
        </div>
      </div>
    </section>
  );

  function inc() {
    quantity++;
    addItemToCart();
  }

  function dec() {
    quantity = Math.max(0, quantity - 1);
    addItemToCart();
  }

  function addItemToCart() {
    if (Alert) return;

    // register addons category_name
    const addonsFilter = [...selectedAddons].map(
      ({ id, price, name, addon_category_id }) => {
        const addon_category_name = categories.find(
          (c) => c.id === addon_category_id
        ).name;

        return {
          addon_id: id,
          addon_category_name,
          addon_name: name,
          price: +price,
        };
      }
    );

    dispatch({
      type: "products/addToCart",
      payload: {
        id: state.id,
        // is_special: isEarlyBooking,
        img: state.image,
        name: state.name,
        slug: state.slug,
        name_ar: state.name_ar,
        category_name: state.category_name,
        category_id: state.item_category_id,
        price: +state.price,
        restaurant_id: +resId,
        quantity,
        addons: addonsFilter,
        totalPrice,
      },
    });

    setAlert(true);
  }
}

function AddonItem(ADD, toggleAddon, isAdded) {
  if (!ADD.is_active) return false;

  const targetMethod = isAdded ? "delete" : "add",
    { name, price } = ADD;

  return (
    <li
      onClick={() => toggleAddon(targetMethod, ADD)}
      key={name}
      data-active={isAdded}
      className="d-flex align-items-center justify-content-between gap-2"
    >
      <b>{name}</b>
      {price}
      <span>{isAdded ? Minus : Plus}</span>
    </li>
  );
}

function Related({ items, exclude, categoryID }) {
  items = items.filter(
    (i) => i.item_category_id === categoryID && i.id !== exclude
  );

  return (
    <section id="related" className="container mb-5">
      <p className="h3 mb-3" style={{ color: "var(--primary)" }}>
        <span>{getText(11)}</span>
      </p>

      <Carousel
        customConfig={{ autoplay: false, scrollbar: false }}
        innerItems={items.map(productItem)}
      />
    </section>
  );
}
