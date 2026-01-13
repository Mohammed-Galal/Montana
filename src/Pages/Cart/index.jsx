/* eslint-disable import/no-anonymous-default-export */
import getPage from "../../translation";
import React, { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import { Link } from "react-router-dom";
import NXT from "../../icons/NXT";
import Recommended from "./Recommended";
import "./index.scss";
import CurrencySymbol from "../../CurrencySymbol";

const mobileView = window.matchMedia("(max-width: 786px)");

const getText = getPage("cart"),
  isArabic = window.localStorage.getItem("lang") === "العربية",
  nameTarget = isArabic ? "name_ar" : "name";

const baseUrl = process.env.REACT_APP_API_URL;
let couponData = null;

export default function () {
  const products = useSelector((S) => S.Products),
    { cart, data, cashback } = products,
    store = useStore().getState(),
    settings = store.settings.data,
    [err, setErr] = useState("");

  let totalPrice = cart.reduce((n, i) => {
    return n + i.price * i.quantity;
  }, 0);

  return (
    <>
      <CartCashback totalPrice={totalPrice} source={cashback} />
      <CartCashback totalPrice={totalPrice} source={settings} />

      {!!err && (
        <span
          className="d-block text-capitalize text-center text-danger w-100"
          style={{ fontWeight: "600" }}
        >
          {err}
        </span>
      )}

      {cart.length ? (
        <ItemsContainer {...{ cart, totalPrice, setErr, cashback, store }} />
      ) : (
        <div className="container d-flex justify-content-center my-3 overflow-hidden">
          <img
            className="animate-shake"
            src={baseUrl + "/assets/img/various/cart-empty.png"}
            style={{ maxHeight: 450 + "px" }}
            alt="no items"
          />
        </div>
      )}
      <Recommended items={data} />
    </>
  );
}

export function _useCoupon(params, auth, callback, rejectCallback) {
  if (+params.subtotal <= 0) {
    rejectCallback();
    return window.modalOptions.open(getText(21));
  }

  fetch(baseUrl + "/public/api/apply-coupon", {
    method: "POST",
    body: JSON.stringify(params),
    headers: { "Content-Type": "application/json", Authorization: auth },
  })
    .then((r) => r.json())
    .then((r) => {
      if (r.success && r.max_count >= r.count) return callback(r);
      const minReached = r.type === "MINSUBTOTAL" ? getText(21) : getText(22);
      rejectCallback();
      window.modalOptions.open(minReached);
    });
}

function ItemsContainer({ cart, totalPrice, setErr, cashback, store }) {
  const discountController = useState(0);
  const userWallet = +store.User.data.wallet_balance || 0;
  const cashbackAmount = calcWalletCashback(totalPrice, cashback);

  return (
    <section
      id="cart"
      className="align-items-xl-start container d-flex flex-column flex-xl-row gap-3"
    >
      <ItemsList
        {...{
          cart,
          restaurant: store.Restaurant,
          discountController,
          totalPrice,
          userWallet,
          setErr,
        }}
      />

      <div className="d-grid gap-3 p-3">
        <h5 className="h5 m-0 pb-2 text-center">{getText(12)}</h5>

        <span>
          <samp>{getText(13)}</samp>
          <samp>
            {totalPrice} <CurrencySymbol />
          </samp>
        </span>

        <div className="d-grid gap-3 m-0 py-2">
          <span className="total">
            <samp>{getText(15)}</samp>
            <samp>
              {userWallet} <CurrencySymbol />
            </samp>
          </span>

          <span>
            <samp>{getText(16)}</samp>
            <samp>
              {discountController[0] === false
                ? getText(17)
                : -(
                    cashbackAmount + Math.abs(discountController[0])
                  ).toLocaleString("en-US") + " "}

              <CurrencySymbol />
            </samp>
          </span>
        </div>

        <span className="total">
          <samp>{getText(18)}</samp>
          <span style={{ marginInlineStart: "auto" }}>
            {Math.max(
              0,
              -cashbackAmount +
                (totalPrice - userWallet) +
                +discountController[0]
            ).toLocaleString("en-US") + " "}
          </span>
          <CurrencySymbol />
        </span>

        <Link className="btn" to="/checkout">
          {getText(19)}
        </Link>
      </div>
    </section>
  );
}

function ItemsList({
  cart,
  restaurant,
  discountController,
  totalPrice,
  userWallet,
  setErr,
}) {
  const store = useStore().getState(),
    [discount, setDiscount] = discountController,
    [isMobile, setMobileView] = useState(mobileView.matches),
    dispatch = useDispatch();

  let coupon = window.localStorage.getItem("coupon") || "";
  coupon === "" && (couponData = null);

  useLayoutEffect(() => {
    mobileView.onchange = () => setMobileView(mobileView.matches);
  }, []);

  useLayoutEffect(() => {
    const token = window.localStorage.getItem("token");
    if (coupon !== "" && restaurant.loaded && cart.length) {
      const couponParams = {
        coupon,
        restaurant_id: "" + restaurant.data.id,
        subtotal: "" + (totalPrice - +userWallet),
      };
      _useCoupon(couponParams, token, applyCoupon, rejectCoupon);
    } else if (token === undefined) setErr(getText(0));
    else couponData = null;
  }, [coupon, totalPrice, discount]);

  if (isMobile) {
    const items = cart.map((item, I) =>
      MobileProductItem(item, I, editCartItem)
    );

    return (
      <div style={{ border: "0" }}>
        <ul className="d-flex flex-column gap-3 list-unstyled m-0 p-0">
          {items}
        </ul>

        {couponData ? (
          <div
            className="d-flex justify-content-between mt-3 py-2"
            style={{
              backgroundColor: "aliceblue",
              borderRadius: "16px",
              fontWeight: "300",
              paddingInlineStart: "12px",
            }}
          >
            <p
              className="d-flex flex-column gap-1 m-0"
              style={{ textAlign: "start" }}
            >
              <h5 className="align-items-center d-flex gap-1 m-0">
                {couponData.name}
                <hr
                  className="m-0"
                  style={{
                    border: "none",
                    backgroundColor: "var(--primary)",
                    width: "6px",
                    height: "6px",
                    borderRadius: "100%",
                  }}
                />
                <sub style={{ color: "var(--primary)" }}>
                  {couponData.count} {getText(9)}
                </sub>
              </h5>
              {couponData.description}
            </p>

            <button
              className="btn"
              onClick={rejectCoupon}
              style={{
                backgroundColor: "transparent",
                color: "var(--primary)",
                fontWeight: "bold",
                borderRadius: "0",
              }}
            >
              X
            </button>
          </div>
        ) : (
          <div
            className="my-4 p-3 d-flex gap-2"
            style={{
              border: "1px solid aliceblue",
              borderRadius: "14px",
            }}
          >
            <input
              type="text"
              ref={(e) => e && (e.value = coupon)}
              className="input-group-text flex-grow-1 input-group-text"
              style={{ textAlign: "start" }}
              onChange={({ target }) => (coupon = target.value)}
              placeholder={getText(10)}
            />
            <button
              type="button"
              className="btn btn-primary px-3 py-2"
              onClick={addCoupon}
            >
              {getText(11)}
            </button>
          </div>
        )}
      </div>
    );
  }

  const items = cart.map((item, I) =>
    DesktopProductItem(item, I, editCartItem)
  );

  return (
    <ul className="text-center d-grid gap-1 list-unstyled m-0 overflow-hidden p-3">
      <li>{getText(4)}</li>
      <li>{getText(5)}</li>
      <li>{getText(6)}</li>
      <li>{getText(7)}</li>
      <li>{getText(8)}</li>

      <li className="seperator mb-3">
        <hr className="m-0" />
      </li>

      {items}

      {couponData ? (
        <li
          className="d-flex justify-content-between mt-3 py-2"
          style={{
            backgroundColor: "aliceblue",
            borderRadius: "16px",
            fontWeight: "300",
            paddingInlineStart: "12px",
          }}
        >
          <p
            className="d-flex flex-column gap-1 m-0"
            style={{ textAlign: "start" }}
          >
            <h5 className="align-items-center d-flex gap-1 m-0">
              {couponData.name}
              <hr
                className="m-0"
                style={{
                  border: "none",
                  backgroundColor: "var(--primary)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "100%",
                }}
              />
              <sub style={{ color: "var(--primary)" }}>
                {couponData.count} {getText(9)}
              </sub>
            </h5>
            {couponData.description}
          </p>

          <button
            className="btn"
            onClick={rejectCoupon}
            style={{
              backgroundColor: "transparent",
              color: "var(--primary)",
              fontWeight: "bold",
              borderRadius: "0",
            }}
          >
            X
          </button>
        </li>
      ) : (
        <li className="mt-3">
          <input
            type="text"
            ref={(e) => e && (e.value = coupon)}
            className="input-group-text"
            onChange={({ target }) => (coupon = target.value)}
            placeholder={getText(10)}
          />
          <button type="button" className="btn px-3 py-2" onClick={addCoupon}>
            {getText(11)}
          </button>
        </li>
      )}
    </ul>
  );

  function editCartItem(index, quantity) {
    dispatch({
      type: "products/updateCartItem",
      payload: { index, quantity },
    });
  }

  function addCoupon() {
    if (coupon === "") return false;
    else if (!store.User.loaded) return setErr(getText(20));
    window.localStorage.setItem("coupon", coupon);
    setDiscount(false);
  }

  function rejectCoupon() {
    window.localStorage.removeItem("coupon");
    couponData = null;
    setDiscount(0);
  }

  function applyCoupon(res) {
    const { discount_type, discount } = res,
      value =
        discount_type === "PERCENTAGE"
          ? ((totalPrice - userWallet) / 100) * +discount
          : +discount;

    setDiscount(-value);
    couponData = res;
  }
}

function MobileProductItem(item, I, editCart) {
  return (
    <li
      key={item.slug}
      className="align-items-baseline d-grid gap-3 p-3"
      style={{
        border: "1px solid aliceblue",
        gridTemplateColumns: "80px 1fr",
        borderRadius: "16px",
      }}
    >
      <img
        src={baseUrl + item.img}
        alt="thumb"
        style={{ borderRadius: "7px" }}
      />

      <div>
        <p className="d-flex justify-content-between">
          <span className="d-flex flex-column text-black">
            {item[nameTarget] || item.name}
            <small className="fw-lighter text-secondary">
              {getText(6)}: {item.price} <CurrencySymbol />
            </small>
          </span>

          <button className="btn text-secondary" onClick={() => editCart(I, 0)}>
            X
          </button>
        </p>

        <div className="align-items-center d-flex fw-bold justify-content-between">
          <div
            className="align-items-center d-flex fw-bold gap-3 justify-content-between"
            style={{ background: "aliceblue", borderRadius: "18px" }}
          >
            <button
              className="btn"
              style={{ color: "var(--bs-cyan)" }}
              onClick={() => editCart(I, item.quantity - 1)}
            >
              -
            </button>
            {item.quantity}
            <button
              className="btn"
              style={{ color: "var(--bs-blue)" }}
              onClick={() => editCart(I, item.quantity + 1)}
            >
              +
            </button>
          </div>
          {item.price * item.quantity} <CurrencySymbol />
        </div>
      </div>
    </li>
  );
}

function DesktopProductItem(item, I, editCart) {
  const { id, quantity, name, addons } = item;
  let price = item.price;

  const Addons =
    addons.length === 0 ? (
      <li>{getText(23)}</li>
    ) : (
      addons.map((a) => {
        price += a.price;
        return (
          <li key={a.addon_id} className="d-flex justify-content-center">
            {a.addon_name} -
            <span>
              {a.price} <CurrencySymbol />
            </span>
          </li>
        );
      })
    );

  return (
    <React.Fragment>
      <li className="item-name align-items-center d-flex gap-1">
        <button className="btn p-0" onClick={() => editCart(I, 0)}>
          x
        </button>

        <Link
          className="d-flex align-items-center gap-2 text-decoration-none"
          style={{ textAlign: "start" }}
          to={
            "/products/" +
            (item.slug || "product-item") +
            "?id=" +
            id +
            "&isCustom=" +
            +(item.category_name === getText(24))
          }
        >
          <img
            className="d-lg-block d-none"
            src={baseUrl + item.img}
            alt="thumbnail"
            style={{ height: "32px", width: "32px", borderRadius: "4px" }}
          />
          {item[nameTarget] || name}
        </Link>
      </li>

      <li>
        <ul
          className="d-flex flex-column list-unstyled m-0 p-0 gap-1"
          style={{ fontSize: "smaller", color: "var(--midgray)" }}
        >
          {Addons}
        </ul>
      </li>

      <li className="item-price justify-content-center">
        <span>{price}</span> <CurrencySymbol />
      </li>

      <li className="align-items-center d-flex gap-2 item-quantity justify-content-center">
        <button className="btn p-0" onClick={() => editCart(I, quantity + 1)}>
          +
        </button>
        {quantity}
        <button className="btn p-0" onClick={() => editCart(I, quantity - 1)}>
          -
        </button>
      </li>

      <li className="item-total justify-content-center">
        <span>{price * quantity}</span> <CurrencySymbol />
      </li>
    </React.Fragment>
  );
}

function CartCashback({ totalPrice, source }) {
  if (!source) return null;

  const obj = {
    max: +source.max,
    value: +source.min,
    type: source.type || source.wallet_cash_type,
  };

  if (source.wallet_cash_type) {
    const walletTxt = +source.wallet_text;
    if (walletTxt === NaN || walletTxt === 0) return null;
    obj.max = +source.wallet_cash_min_order;
    obj.value = +source.wallet_cash_value;
  }

  return (
    <div
      className="align-items-center container d-flex flex-column gap-3 h5 mt-4 mb-3"
      style={{ cssText: "color: var(--primary); font-weight: 600;" }}
    >
      {getText(25) +
        obj.max +
        getText(26) +
        obj.value +
        " " +
        (obj.type === "percentage" ? "%" : <CurrencySymbol />) +
        getText(27)}
      <progress
        value={totalPrice}
        max={+obj.max}
        style={{ cssText: "max-width: 500px;" }}
      ></progress>
    </div>
  );
}

export function calcWalletCashback(totalPrice, cashback) {
  if (!cashback) return 0;

  let max = +cashback.max,
    value = +cashback.min,
    type = cashback.type;

  type === "percentage" && (value = (value / 100) * totalPrice);
  return totalPrice >= max ? value : 0;
}
