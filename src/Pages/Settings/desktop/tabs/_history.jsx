/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { Link } from "react-router-dom";
import getPage, { observeLang } from "../../../../translation";
import { useSelector } from "react-redux";
import Carousel from "../../../../shared/Carousel";
import { useMap } from "@vis.gl/react-google-maps";
import { useMemo } from "react";
import CurrencySymbol from "../../../../CurrencySymbol";

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
    getText(19)
  );
});

const base = process.env.REACT_APP_API_URL;

let restaurantId;

export default () => {
  const { User, Restaurant, Products } = useSelector((e) => e);
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

          <span>{"لم يتم تقييم الطلب بعد"}</span>
        </div>
      </div>

      <hr className="my-1" />

      <div
        className="align-items-center d-flex gap-2 justify-content-end"
        style={{ fontSize: "0.875rem" }}
      >
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
          <a
            className="align-items-center btn d-inline-flex gap-1"
            href={order.payment.InvoiceURL}
            style={{
              fontSize: "inherit",
              color: "rgb(250 190 32)",
              "--bs-btn-hover-bg": "#fabe201a",
            }}
          >
            {"أكمل الدفع"}
          </a>
        ) : null}
        {/* <button
            className="align-items-center btn d-inline-flex gap-1"
            style={{
              fontSize: "inherit",
              color: "rgb(250 190 32)",
              "--bs-btn-hover-bg": "#fabe201a",
            }}
          >
            <img
              src="/assets/settings/rewind.png"
              style={{ maxHeight: "16px" }}
              alt="reorder"
            />
            {"اعادة الطلب"}
          </button> */}
      </div>
    </li>
  );
}
