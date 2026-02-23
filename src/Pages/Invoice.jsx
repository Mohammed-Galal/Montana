import getPage from "../translation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

let errMsg = "";

const getText = getPage("invoice");

export default () => {
  const params = useParams(),
    [query] = useSearchParams(),
    LOC = useLocation(),
    { prevOrders, data: userData } = useSelector((e) => e.User),
    dispatch = useDispatch(),
    [state, setState] = useState(LOC.state);

  const orderId = query.get("orderId");

  useEffect(
    function () {
      if (state === null) {
        // const data = getOrderData(+(orderId || params.id), prevOrders);
        // setState(data);
        if (params.id) instantPaymentInvoice();
        else if (orderId) {
          const data = getOrderData(+orderId, prevOrders);
          setState(data);
        }
      }
    },
    [prevOrders],
  );

  if (state === null) return null;
  else if (state === false) {
    return (
      <div className="container">
        <div
          className="text-center"
          style={{
            color: "var(--midgray)",
            fontSize: "larger",
            fontWeight: "400",
          }}
        >
          <span className="d-block h3 text-danger">{getText(0)}</span>
          {errMsg}
        </div>
      </div>
    );
  }

  if (!orderId) {
    window.localStorage.removeItem("coupon");
    window.localStorage.removeItem("invoiceData");
    dispatch({ type: "products/clearCart" });
  }

  return (
    <section id="invoice" className="container">
      <div
        id="invoice-content"
        className="align-items-center d-flex flex-column gap-2 p-4 text-center"
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: "0.9rem",
          border: "1px dashed currentcolor",
          color: "var(--primary)",
          borderRadius: "6px",
          width: "fit-content",
          margin: "auto",
        }}
      >
        <img
          src="/assets/home/logo.svg"
          alt="Montana Logo"
          style={{ maxHeight: "95px" }}
        />

        <span className="mt-3" style={{ fontWeight: "600" }}>
          حلويات مونتانا - {state.restaurant_name}
        </span>
        <p className="d-flex flex-column m-0">
          <span>فاتورة ضريبية مبسطة</span>
          <span>سجل تجاري 4030479174</span>
          <span>الرقم الضريبي 311354802600003</span>
        </p>

        <p
          className="d-flex flex-column gap-2 m-0 my-2 px-5 py-2"
          style={{ border: "2px solid currentColor", width: "fit-content" }}
        >
          الطلب رقم
          <span style={{ fontWeight: "bold" }} dir="ltr">
            #{state.code}
          </span>
        </p>

        <p className="m-0">
          {state.date[1]} {state.date[0]}
        </p>

        <hr className="my-1" style={{ width: "100%", borderStyle: "dashed" }} />

        <ul
          className="list-unstyled m-0 p-0"
          style={{ textAlign: "start", width: "100%" }}
        >
          <li>
            <span style={{ fontWeight: "bold" }}>اسم العميل: </span>
            {userData.name}
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>رقم الجوال: </span>
            {userData.phone}
          </li>
          <li>
            <span style={{ fontWeight: "bold" }}>العنوان: </span>
            {state.deliveryAddress}
          </li>
        </ul>

        <hr className="my-1" style={{ width: "100%", borderStyle: "dashed" }} />

        <h6
          className="m-0"
          style={{ fontWeight: "600", borderBottom: "1px solid" }}
        >
          الاصناف
        </h6>
        <ul
          className="list-unstyled m-0 p-0 w-100"
          style={{ textAlign: "start" }}
        >
          {state.order.map(ProductItem)}
        </ul>

        <hr className="my-1" style={{ width: "100%", borderStyle: "dashed" }} />

        <p
          className="d-flex justify-content-between m-0 w-100"
          style={{ textAlign: "start" }}
        >
          الخصم
          <span>{state.discount.toFixed(2)}</span>
        </p>

        {state.tax_amount ? (
          <p
            className="d-flex justify-content-between m-0 w-100"
            style={{ textAlign: "start" }}
          >
            الضريبة ({+state.tax || 0}%){" "}
            <span>{state.tax_amount.toFixed(2)}</span>
          </p>
        ) : null}

        <p
          className="d-flex justify-content-between m-0 w-100"
          style={{ textAlign: "start" }}
        >
          رسوم التوصيل
          <span>{state.deliveryCharges}</span>
        </p>
        <p
          className="d-flex justify-content-between m-0 w-100"
          style={{ fontWeight: "600" }}
        >
          الاجمالي <span>{state.total}</span>
        </p>

        <hr className="my-1" style={{ width: "100%", borderStyle: "dashed" }} />

        <p className="m-0" style={{ fontWeight: "600" }}>
          طريقة الاستلام: <span>{state.deliveryType}</span>
        </p>

        <p className="m-0" style={{ fontWeight: "600" }}>
          طريقة الدفع: <span>{state.paymentMode}</span>
        </p>

        <hr className="my-1" style={{ width: "100%", borderStyle: "dashed" }} />

        <p className="d-flex flex-column m-0">
          للتواصل مع الطلبات الخاصه أو الشكاوي
          <span style={{ fontWeight: "600" }}>920035416</span>
        </p>

        <img
          style={{ margin: "auto" }}
          src={`https://api.qrserver.com/v1/create-qr-code/?data=${window.location.href}&size=150x150`}
          alt="QR Code"
        ></img>
      </div>

      <button
        className="btn d-block mt-5 mx-auto px-5"
        style={{ background: "var(--primary)", color: "#fff" }}
        onClick={printInvoice}
      >
        طباعة
      </button>

      {/* <pre dir="ltr">{JSON.stringify(state, null, 2)}</pre> */}
    </section>
  );

  function printInvoice() {
    window.print();
  }

  function instantPaymentInvoice() {
    fetch(process.env.REACT_APP_API_URL + "/public/api/payment-callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
      body: JSON.stringify({
        isSuccess: true,
        order_id: params.id,
        sessionId: query.get("sessionId"),
        paymentId: query.get("paymentId"),
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const data = getOrderData(+params.id, prevOrders);
          setState(data);
        } else {
          errMsg = res.message;
          setState(false);
        }
      });
  }
};

function ProductItem({ id, name, price, quantity }) {
  let total = 0;
  total += +price * +quantity;

  return (
    <li key={id} className="align-items-center d-flex gap-2">
      <span>{quantity}×</span>
      <span>{name}</span>
      <span style={{ marginInlineStart: "auto" }}>{+price * +quantity}</span>
    </li>
  );
}

function getOrderData(orderId, prevOrders) {
  const orderData = prevOrders.find(({ id }) => id === orderId);
  if (!orderData) return null;

  const isDelivery = orderData.delivery_type === 2,
    result = {};

  result.order = orderData.orderitems.map((item) => ({
    ...item,
    selectedaddons: item.order_item_addons,
  }));

  result.tax = orderData.tax;
  result.restaurant_name = orderData.restaurant.name;
  result.code = orderData.unique_order_id;
  result.deliveryType = isDelivery ? "من الفرع" : "توصيل";
  result.deliveryAddress = isDelivery
    ? orderData.address
    : orderData.restaurant.name;
  result.deliveryCharges = orderData.delivery_charge;
  result.restaurant_charge = orderData.restaurant_charge;
  result.paymentMode =
    orderData.payment_mode === "COD" ? "عند الاستلام" : "مدفوع";

  result.comment = orderData.order_comment;
  result.PIN = orderData.delivery_pin;
  result.tax_amount = orderData.tax_amount;
  result.date = orderData.updated_at.split(" ");
  result.subTotal = orderData.sub_total;
  result.discount = +orderData.coupon_amount + +orderData.pay_from_wallet;
  result.total = orderData.total;
  result.price = orderData.payable;

  return result;
}
