import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getPage from "../../translation.js";
import OrderSchedule from "./OrderSchedule.jsx";

const getText = getPage("checkout"),
  defaultLoc = {
    lat: "",
    lng: "",
  },
  addresItemStyle = {
    width: "100%",
    border: "2px solid #a8d0ec",
    borderRadius: "8px",
  };

let prevActiveAddress = null;

export default function ({
  deliveryState,
  reqBody,
  clues,
  resIdState,
  payment,
}) {
  const dispatch = useDispatch(),
    redirect = useNavigate(),
    { User, Restaurant } = useSelector((e) => e),
    setPaymentMethod = payment[1],
    [resId, setResId] = resIdState,
    [delivery, setDelivery] = deliveryState;

  const { userAddresses, isExceptionalCart } = clues,
    activeAddress = User.activeAddressIndex,
    branches = Restaurant.branches,
    setActiveAddress = (indx) => {
      indx === activeAddress || (clues.closestRes = null);
      dispatch({ type: "user/setActiveAddress", payload: indx });
    };

  useLayoutEffect(() => {
    delivery && userAddresses.length && fetchDeliveryRestaurants();
  }, [activeAddress, delivery]);

  if (delivery) {
    reqBody.delivery_type = "1";
    const currAddress = userAddresses[activeAddress];
    if (currAddress) {
      Object.assign(reqBody.user.data.default_address, currAddress);
      reqBody.location.lat = currAddress.latitude;
      reqBody.location.lng = currAddress.longitude;
    }
  } else {
    reqBody.delivery_type = "2";
    reqBody.location = defaultLoc;
  }

  return (
    <fieldset
      className="d-flex flex-column gap-3 p-3 w-100"
      style={{
        border: "1px solid rgb(241, 241, 241)",
        borderRadius: "16px",
      }}
    >
      <legend
        className="float-none mx-auto px-3 mb-0"
        style={{
          alignSelf: "center",
          color: "var(--primary)",
          width: "auto",
        }}
      >
        {getText(32)}
      </legend>
      <OrderSchedule reqBody={reqBody} isSpecial={clues.isExceptionalCart} />

      <div
        className="d-flex flex-wrap gap-2"
        style={{ color: "var(--primary)" }}
      >
        <span className="w-100">{getText(33)}</span>
        <button
          className="btn d-flex align-items-center gap-2"
          data-active={!delivery}
          onClick={() => {
            setDelivery(false);
            setPaymentMethod("myfatoorah");
          }}
        >
          <img
            style={{
              maxHeight: "25px",
              filter: "grayscale(" + +delivery + ")",
            }}
            src={
              process.env.REACT_APP_API_URL +
              "/assets/img/various/self-pickup.png"
            }
            alt="branch"
          />
          {getText(34)}
        </button>
        <button
          className="btn d-flex align-items-center gap-2"
          data-active={delivery}
          disabled={isExceptionalCart}
          onClick={() => {
            if (isExceptionalCart) return;
            setDelivery(true);
            setPaymentMethod("myfatoorah");
          }}
        >
          <img
            style={{
              maxHeight: "25px",
              filter: "grayscale(" + +!delivery + ")",
            }}
            src={
              process.env.REACT_APP_API_URL +
              "/assets/img/various/home-delivery.png"
            }
            alt="delivery"
          />
          {getText(35)}
        </button>
      </div>

      {!delivery && isExceptionalCart && (
        <ul
          className="d-flex flex-column flex-wrap gap-2 list-unstyled m-0 p-0"
          style={{ gridColumnStart: "span 2" }}
        >
          {branches.map(branchItem)}
        </ul>
      )}

      {delivery ? (
        userAddresses.length ? (
          <ul
            className="align-items-stretch d-flex flex-wrap gap-2 list-unstyled m-0 p-0 w-100"
            style={{ gridColumnStart: "span 2" }}
          >
            {userAddresses.map(userAddress)}
          </ul>
        ) : (
          <p className="my-2" style={{ color: "var(--midgray)" }}>
            <b className="d-block text-danger">{getText(36)}</b>
            {getText(37)}
            <button
              type="button"
              className="btn d-block mt-2 mx-auto px-5"
              style={{ background: "var(--primary)", color: "#fff" }}
              onClick={() => redirect("/settings/addresses")}
            >
              {getText(38)}
            </button>
          </p>
        )
      ) : (
        <a
          href={`https://www.google.com/maps?q=${Restaurant.data.latitude},${Restaurant.data.longitude}`}
          className="align-items-center d-flex gap-3 px-2 py-1 text-decoration-none"
          style={{
            border: "2px solid rgb(168, 208, 236)",
            backgroundColor: "#c9e2f4",
            color: "var(--primary)",
            borderRadius: "4px",
          }}
        >
          <img
            src="/assets/home/logo.svg"
            style={{ maxHeight: "40px" }}
            alt="icon"
          />
          <div
            className="d-flex flex-column gap-1"
            style={{ lineHeight: "1.3", fontWeight: "600" }}
          >
            {Restaurant.data.name}
            <span
              style={{
                color: "var(--midgray)",
                fontWeight: "400",
                fontSize: "smaller",
              }}
            >
              {"العنوان على الخريطة"}
            </span>
          </div>

          {/* <img src="" alt="" /> */}
        </a>
      )}

      <textarea
        placeholder={getText(39)}
        className="input-group-text mt-auto"
        defaultValue={reqBody.order_comment}
        onChange={({ target }) => (reqBody.order_comment = target.value)}
        style={{
          resize: "none",
          width: "100%",
          textAlign: "right",
          borderColor: "#e9f3fa !important",
          backgroundColor: "#fbfbfb",
          outline: "none",
        }}
      ></textarea>
    </fieldset>
  );

  function branchItem({ id, name }) {
    return (
      <li key={id} style={addresItemStyle} data-active={resId === id}>
        <label
          onClick={() => setResId(id)}
          className="align-items-center d-flex gap-2 h-100 justify-content-start px-3 py-1 w-100"
        >
          <img src="/assets/settings/address.png" alt="icon" />

          <div
            className="d-grid gap-2"
            style={{ cssText: "color: var(--midgray); font-weight: 600" }}
          >
            <span
              style={{
                cssText: "color: var(--primary); font-weight: bold",
              }}
              className="h5 m-0"
            >
              {name}
            </span>
          </div>
        </label>
      </li>
    );
  }

  function userAddress(e, i) {
    return (
      <li
        key={i}
        style={addresItemStyle}
        value={e.id}
        data-active={activeAddress === i}
      >
        <label
          onClick={() => setActiveAddress(i)}
          className="align-items-center d-flex gap-2 h-100 justify-content-start px-3 py-1 w-100"
        >
          <img src="/assets/settings/address.png" alt="icon" />

          <div
            className="d-grid gap-2"
            style={{ cssText: "color: var(--midgray); font-weight: 600" }}
          >
            <span
              style={{
                cssText: "color: var(--primary); font-weight: bold",
              }}
              className="h5 m-0"
            >
              {e.tag}
            </span>
          </div>
        </label>
      </li>
    );
  }

  function fetchDeliveryRestaurants() {
    const address = userAddresses[activeAddress];

    if (activeAddress === prevActiveAddress) return;
    prevActiveAddress = activeAddress;

    fetch(
      `${process.env.REACT_APP_API_URL}/public/api/get-delivery-restaurants`,
      {
        method: "POST",
        body: JSON.stringify(address),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const activeStores = data.filter((s) => !!s.is_active);

        if (activeStores.length > 0) {
          const minDistance = Math.min(
            ...activeStores.map(({ distance }) => distance)
          );
          clues.closestRes = minDistance
            ? activeStores.find(({ distance }) => distance === minDistance)
            : false;
        } else {
          debugger;

          clues.closestRes = false;

          window.modalOptions.open(
            "لا توجد فروع قريبة منك، هل تريد استلام الطلب من الفرع ؟",
            (isOk) => isOk && setDelivery(false)
          );
        }
      });
  }
}
