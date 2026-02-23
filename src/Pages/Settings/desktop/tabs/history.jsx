/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { Link } from "react-router-dom";
import getPage, { observeLang } from "../../../../translation";
import { useSelector } from "react-redux";
import Carousel from "../../../../shared/Carousel";
import CurrencySymbol from "../../../../CurrencySymbol";
import { initMyFatoorah } from "../../../Checkout";

const defaultColorTheme = {
    backgroundColor: "rgb(219 234 254)",
    color: "rgb(6 60 211)",
  },
  colorThemes = new Array(11).fill(defaultColorTheme);

// colorThemes[1] = { backgroundColor: "#fabe201a", color: "rgb(250, 190, 32)" };

// success color theme
colorThemes[5] = colorThemes[11] = {
  backgroundColor: "#dcfce7",
  color: "#137e3c",
};

// danger color theme
colorThemes[6] =
  colorThemes[8] =
  colorThemes[9] =
    {
      backgroundColor: "rgb(254 226 226)",
      color: "rgb(186 33 33)",
    };

const getText = getPage("settings"),
  orderState = [false];

observeLang(() => {
  orderState.push(
    getText(9),
    getText(10),
    getText(11),
    getText(12),
    getText(13),
    getText(14),
    getText(15),
    getText(16),
    getText(17),
    getText(18),
    getText(19),
  );
});

const base = process.env.REACT_APP_API_URL;

let restaurantId;

export default () => {
  const { User, Restaurant, Products, settings } = useSelector((e) => e);
  restaurantId = Restaurant.data.id;

  const items = User.prevOrders;

  return (
    <ul className="d-flex flex-column flex-grow-1 flex-wrap gap-4 m-0 p-0">
      <style>{`.swiper-wrapper{margin: 0 !important; padding: 0 0 16px}`}</style>
      {items.map(orderItem, Products.data)}
    </ul>
  );
};

function orderItem(order) {
  // if (order.restaurant_id !== restaurantId) return false;

  const Products = this,
    { updated_at, total, delivery_charge, orderstatus_id } = order,
    orderStatus = orderState[orderstatus_id] || orderstatus_id,
    date = updated_at.split(" ")[0].replace(/-/g, "."),
    price = +total + +delivery_charge,
    quantity = order.orderitems.reduce((n, i) => n + i.quantity, 0);

  const images = order.orderitems.map((p) => {
    const targetProduct = Products.find((e) => e.id === p.item_id);
    if (targetProduct === undefined) return false;
    const src = targetProduct.image ? base + targetProduct.image : "";
    return (
      <img
        key={src}
        src={src}
        style={{ "max-height": "72px", "align-self": "flex-start" }}
        alt="img"
      />
    );
  });

  return (
    <li
      key={order.id}
      className="d-flex flex-column gap-2 py-2 px-3"
      style={{
        // flex: "1 0 400px",
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: "4px",
        overflow: "hidden",
        boxShadow:
          " 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
      }}
    >
      <div
        className="align-items-center d-flex desc flex-nowrap gap-2"
        style={{ color: "#8a9098", fontSize: "small", fontWeight: "600" }}
      >
        <Carousel
          innerItems={images}
          customConfig={{
            navigation: false,
            // spaceBetween: "auto",
            slidesPerView: 1,
            style: { maxWidth: "99px", margin: 0 },
            className: "w-auto",
          }}
        />

        <div className="d-flex flex-column">
          <h5 style={{ color: "#000919" }}>
            {"طلب"} {order.unique_order_id}
          </h5>
          {"تاريخ الطلب: "}
          {date}
          <span style={{ color: "#171c1a" }}>
            {"الإجمالي: "}
            {price} <CurrencySymbol />/ {quantity} {getText(21)}
          </span>
        </div>

        <div
          className="align-items-center d-flex flex-column gap-2 text-center"
          style={{ marginInlineStart: "auto" }}
        >
          <span
            className="px-2 py-1"
            style={{
              ...colorThemes[orderstatus_id],
              borderRadius: "30px",
              fontSize: "smaller",
              fontWeight: "bold",
            }}
          >
            {orderStatus}
          </span>

          {order.rating ? (
            <Stars count={order.rating.rating_store} />
          ) : (
            <span>{"لم يتم تقييم الطلب بعد"}</span>
          )}
        </div>
      </div>

      <hr className="my-1" />

      <div className="d-flex gap-2" style={{ fontSize: "0.875rem" }}>
        {[2, 3, 4, 5, 7, 11].includes(orderstatus_id) && (
          <Link
            className="align-items-stretch btn d-inline-flex gap-1"
            to={"/invoice?orderId=" + order.id}
            style={{ fontSize: "inherit", "--bs-btn-hover-bg": "#0001" }}
          >
            <img
              style={{ maxHeight: "24px" }}
              src="https://cdn-icons-png.flaticon.com/512/6684/6684701.png"
              alt="show password"
            />
            {getText(22)}
          </Link>
        )}

        {orderstatus_id === 8 ? (
          <button
            className="align-items-center btn d-inline-flex gap-1"
            onClick={() => initMyFatoorah(order.payment.session_id, order.id)}
            style={{
              fontSize: "inherit",
              color: "rgb(250 190 32)",
              "--bs-btn-hover-bg": "#fabe201a",
            }}
          >
            {"أكمل الدفع"}
          </button>
        ) : null}

        {(orderstatus_id === 1 || orderstatus_id === 10) && (
          <button
            onClick={cancelOrder}
            className="btn btn-outline-danger"
            style={{
              fontSize: "inherit",
              marginInlineStart: "auto",
              border: "none",
              color: "var(--bs-danger)",
              "--bs-btn-hover-bg": "#dc35452e",
              "--bs-btn-active-bg": "#dc35452e",
            }}
          >
            {"الغاء الطلب"}
          </button>
        )}
      </div>
    </li>
  );

  function cancelOrder() {
    const headers = { "Content-Type": "application/json" },
      token = window.localStorage.getItem("token");
    token && (headers["Authorization"] = token);

    fetch(process.env.REACT_APP_API_URL + "/public/api/cancel-order", {
      method: "POST",
      headers,
      body: JSON.stringify({
        order_id: order.id,
      }),
    })
      .then((r) => r.json())
      .then(function (r) {
        // debugger;
        window.prevOrders();
      });
  }
}

function Stars({ count }) {
  return (
    <ul
      className="align-items-center d-flex gap-2 m-0 p-0"
      style={{ listStyle: "none" }}
    >
      <li>
        <img
          src={
            "/assets/" + (count >= 1 ? "star-active" : "star-outlined") + ".svg"
          }
          alt="star"
        />
      </li>
      <li>
        <img
          src={
            "/assets/" + (count >= 2 ? "star-active" : "star-outlined") + ".svg"
          }
          alt="star"
        />
      </li>
      <li>
        <img
          src={
            "/assets/" + (count >= 3 ? "star-active" : "star-outlined") + ".svg"
          }
          alt="star"
        />
      </li>
      <li>
        <img
          src={
            "/assets/" + (count >= 4 ? "star-active" : "star-outlined") + ".svg"
          }
          alt="star"
        />
      </li>
      <li>
        <img
          src={
            "/assets/" + (count >= 5 ? "star-active" : "star-outlined") + ".svg"
          }
          alt="star"
        />
      </li>
    </ul>
  );
}
