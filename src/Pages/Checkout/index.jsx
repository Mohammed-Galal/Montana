import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import { _useCoupon } from "../Cart";
import { updateUserInfo } from "../../store";
import getPage, { observeLang } from "../../translation";
import NXT from "../../icons/NXT";
import OrderOptions from "./OrderOptions";
import OrderInfo from "./OrderInfo";
import "./index.scss";

const getText = getPage("checkout"),
  complimentaryData = {},
  placeOrderApi = process.env.REACT_APP_API_URL + "/public/api/place-order",
  exceptionalCategories = [undefined],
  emptyStr = "";

observeLang(() => (exceptionalCategories[1] = getText(0)));

export default function () {
  const redirect = useNavigate(),
    store = useStore().getState(),
    dispatch = useDispatch(),
    [err, setErr] = useState(""),
    deliveryState = useState(true),
    payment = useState("myfatoorah"),
    resIdState = useState(null);

  const currRes = store.Restaurant.data,
    resId = currRes.id,
    userAuthientcated = store.User.loaded,
    { cart: cartItems, is_special } = store.Products;

  const reqBody = useRef({
      is_special: false,
      images: [],
      phrase: "",
      order_comment: "",
      comment: "",
      location: {},
      coupon: { code: emptyStr },
      user: { data: { default_address: {} } },
    }).current,
    clues = useRef({
      closestRes: null,
      userAddresses: store.User.addresses,
      cashback: store.Products.cashback,
      requestSent: false,
    }).current;

  reqBody.is_special = clues.isExceptionalCart = is_special;
  clues.deliveryCharges = store.Restaurant.data.delivery_charges;

  useLayoutEffect(function () {
    userAuthientcated || redirect("/user/login");
    cartItems.length || redirect("/cart");
  });

  useLayoutEffect(
    function () {
      if (clues.isExceptionalCart) {
        resIdState[1](resId);
        deliveryState[1](false);
      }
    },
    [resId, clues.isExceptionalCart, deliveryState[0]]
  );

  if (cartItems.length === 0) return null;

  return (
    <section id="checkout">
      {/* <ul className="d-flex gap-2 justify-content-center list-unstyled mb-5 mx-auto p-0">
        <li>{getText(1)}</li>
        <li>{NXT}</li>
        <li className="h5 m-0">{getText(2)}</li>
        <li>{NXT}</li>
        <li>{getText(3)}</li>
      </ul> */}

      {!!err && (
        <span
          className="d-block text-capitalize text-center text-danger w-100"
          style={{ fontWeight: 600 }}
        >
          {err}
        </span>
      )}

      <div className="align-items-stretch align-items-xl-start container d-flex flex-column flex-xl-row gap-3 justify-content-center">
        <OrderOptions
          reqBody={reqBody}
          clues={clues}
          resIdState={resIdState}
          payment={payment}
          deliveryState={deliveryState}
        />
        <OrderInfo
          payment={payment}
          reqBody={reqBody}
          clues={clues}
          resId={resIdState[0] || resId}
          cartItems={cartItems}
          deliveryState={deliveryState}
          placeOrder={placeOrder}
        />
      </div>

      <TimeWarning placeOrder={placeOrder} />
      <ClosestResPopup
        setDelivery={deliveryState[1]}
        clues={clues}
        dispatch={dispatch}
        redirect={redirect}
      />
    </section>
  );

  function placeOrder(ignoreWorkingHours) {
    const requestSent = clues.requestSent;

    if (requestSent) return;
    else if (deliveryState[0] && !checkResCoverage(currRes, clues.closestRes))
      return;

    if (currRes.accept_scheduled_orders && clues.isExceptionalCart) {
      if (
        !reqBody.is_scheduled &&
        !reqBody.schedule_date &&
        !reqBody.schedule_slot
      ) {
        window.modalOptions.open("يرجى تحديد موعد الطلب!");
        return;
      }
    }

    clues.requestSent = true;
    setTimeout(() => (clues.requestSent = false), 1000);

    const images = reqBody.images || [],
      formData = new FormData();

    Object.assign(reqBody, complimentaryData);
    appendFormData(formData, reqBody);

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++)
        formData.append("images[]", images[i], images[i].name);
    }

    const fetchOpts = {
      method: "POST",
      body: formData,
      headers: { Authorization: window.localStorage.getItem("token") },
    };

    fetch(placeOrderApi, fetchOpts)
      .then((r) => r.json())
      .then(handleInvoice)
      .catch(console.log);
  }

  function handleInvoice(res) {
    if (res.success === false) return setErr(getText(4));

    updateUserInfo();

    const paymentMode = res.data.payment_mode,
      basicOrderData = {
        order: reqBody.order,
        discount: clues.discount,
        deliveryType: getText(5),
        deliveryAddress: currRes.name,
        deliveryCharges: deliveryState[0] ? currRes.delivery_charges : 0,
        restaurant_charge: currRes.restaurant_charges,
        paymentMode: paymentMode === "COD" ? getText(6) : paymentMode,
      };

    if (deliveryState[0]) {
      basicOrderData.deliveryType = getText(7);
      basicOrderData.deliveryAddress =
        clues.userAddresses[store.User.activeAddressIndex].tag;
    }

    if (paymentMode !== "COD") {
      window.localStorage.setItem(
        "invoiceData",
        JSON.stringify(basicOrderData)
      );
      return (window.location.href = res.data.link);
    }

    const { data } = res,
      invoiceState = {
        ...basicOrderData,
        tax: data.tax,
        restaurant_name: res.data.restaurant.name,
        date: data.created_at.split(" "),
        comment: data.order_comment,
        code: data.unique_order_id,
        PIN: data.delivery_pin,
        tax_amount: data.tax_amount,
        total: data.total,
        price: data.payable,
        subTotal: data.sub_total,
      };

    redirect("/invoice", { state: invoiceState });
  }
}

function ClosestResPopup({ setDelivery, clues, dispatch, redirect }) {
  return (
    <div
      id="closest-res"
      popover="manual"
      className="px-5 py-3 text-center"
      style={{
        color: "var(--midgray)",
        borderColor: "#c9e2f4",
        borderRadius: "8px",
      }}
    >
      <b className="text-danger" style={{ fontSize: "larger" }}>
        {getText(8)}
      </b>

      <p className="my-3">{getText(9)}</p>

      <div className="d-flex gap-2 justify-content-evenly">
        <button
          type="button"
          className="btn flex-grow-1"
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            maxWidth: "50%",
          }}
          onClick={() => {
            document.getElementById("closest-res").hidePopover();
            setDelivery(false);
          }}
        >
          {getText(10)}
        </button>

        <button
          type="button"
          className="btn flex-grow-1"
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            maxWidth: "50%",
          }}
          onClick={() => {
            const closestRes = clues.closestRes;

            if (closestRes) {
              fetch(
                process.env.REACT_APP_API_URL +
                  "/public/api/get-restaurant-items/" +
                  closestRes.slug,
                {
                  method: "POST",
                  headers: { "Content-type": "application/json" },
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  dispatch({ type: "restaurant/init", payload: closestRes });
                  dispatch({ type: "products/init", payload: data });
                  // Redirect to the home page
                  redirect("/");
                });
            } else window.modalOptions.open(getText(11));

            document.getElementById("closest-res").hidePopover();
          }}
        >
          {getText(12)}
        </button>
      </div>
    </div>
  );
}

function TimeWarning({ placeOrder }) {
  return (
    <div
      id="time-warning"
      popover="manual"
      style={{
        borderColor: "aliceblue",
        borderRadius: "8px",
      }}
    >
      <div
        className="d-flex flex-wrap gap-3 px-5 py-3 text-center justify-content-center"
        style={{
          color: "var(--midgray)",
        }}
      >
        <b className="text-danger w-100">{getText(13)}</b>
        {getText(14)}
        <br />
        {/* {getText(15)} */}
        {/* <button
          type="button"
          className="btn"
          style={{
            flex: "1 0 45%",
            backgroundColor: "var(--primary)",
            color: "#fff",
          }}
          onClick={() => placeOrder(true)}
        >
          {getText(16)}
        </button> */}
        <button
          type="button"
          className="btn"
          style={{
            flex: "1 0 45%",
            backgroundColor: "var(--primary)",
            color: "#fff",
            maxWidth: "550px",
          }}
          onClick={() => document.getElementById("time-warning").hidePopover()}
        >
          {getText(17)}
        </button>
      </div>
    </div>
  );
}

// =======================  UTILS  =============================
function checkResCoverage(currRes, closestRes) {
  // if the closest restaurant is not loaded yet
  if (closestRes === null) return false;
  // if there's no closest restaurant
  // or if the closest restaurant  is not the same as the current Restaurant
  else if (closestRes === false || closestRes.id !== currRes.id) {
    document.getElementById("closest-res").showPopover();
    return false;
  }

  return true;
}

function appendFormData(fd, data, parentKey = "") {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      appendFormData(fd, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      appendFormData(fd, item, `${parentKey}[${index}]`);
    });
  } else {
    fd.append(parentKey, data === null ? "" : data);
  }
}

Object.assign(complimentaryData, {
  tipAmount: "",
  cash_change_amount: "",
  pending_payment: "",
  // partial_wallet: "",
  auto_acceptable: false,
  CallBackUrl: window.location.origin + "/invoice/",
});
