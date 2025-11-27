/* eslint-disable no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import Products from "./products.js";
import User from "./user.js";
import Restaurant from "./restaurant.js";
import Sliders from "./sliders.js";
import settings from "./settings.js";

const cartMsg =
    "لا يمكن اضافة الطلب المخصص الى العربة بجانب الطلبات الأخرى، هل تريد إخلاء العربة؟",
  APP_STATE = configureStore({
    reducer: { Products, User, Restaurant, Sliders, settings },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cartValidation), // Add custom middleware here
  });
export default APP_STATE;

function cartValidation(store) {
  return (next) => (action) => {
    if (action.type === "products/addToCart") {
      const state = store.getState().Products,
        cart = state.cart,
        payload = action.payload;

      const isSpecialItem = payload.category_id > 7,
        clearCart =
          cart.length &&
          ((isSpecialItem && !state.is_special) ||
            (!isSpecialItem && state.is_special));

      if (!clearCart) return next(action);

      window.modalOptions.open(cartMsg, function (proceedToClear) {
        if (!proceedToClear) return;
        APP_STATE.dispatch({ type: "products/clearCart" });
        APP_STATE.dispatch(action);
      });

      return store.getState();
    } else return next(action);
  };
}

fetch(process.env.REACT_APP_API_URL + "/public/api/getItemcategories")
  .then((r) => r.json())
  .then((r) => {
    APP_STATE.dispatch({
      type: "products/initMiniCategories",
      payload: r,
    });
  });

navigator.geolocation.getCurrentPosition((POS) => {
  if (!("geolocation" in navigator))
    return window.modalOptions.open(
      "Geolocation is not supported by your browser."
    );

  const coords = {
    latitude: "" + POS.coords.latitude,
    longitude: "" + POS.coords.longitude,
  };

  APP_STATE.dispatch({ type: "user/setLoc", payload: coords });
}, console.error);

const baseUrl = process.env.REACT_APP_API_URL + "/public/api",
  fetchOpts = {
    method: "POST",
    get headers() {
      const obj = { "Content-Type": "application/json" },
        token = window.localStorage.getItem("token");
      token && (obj["Authorization"] = token);
      return obj;
    },
  };

fetch(baseUrl + "/get-settings", {
  method: "POST",
})
  .then((r) => r.json())
  .then((r) => {
    APP_STATE.dispatch({ type: "settings/init", payload: r });
  });

fetch(baseUrl + "/get-all-restaurant", fetchOpts)
  .then((res) => res.json())
  .then((data) =>
    APP_STATE.dispatch({
      type: "restaurant/INIT_BRANCHES",
      payload: data,
    })
  );

fetch(baseUrl + "/getSliders")
  .then((r) => r.json())
  .then((r) => APP_STATE.dispatch({ type: "sliders/init", payload: r }));

const savedSlug = window.localStorage.getItem("slug");

export const updateUserInfo = function () {
    fetch(baseUrl + "/update-user-info", fetchOpts)
      .then(toJson)
      .then((r) => {
        APP_STATE.dispatch({ type: "user/init", payload: r.data });
        getFavourites();
        getUserAlerts();
      });
  },
  logout = function () {
    APP_STATE.dispatch({ type: "products/clearCart" });
    APP_STATE.dispatch({ type: "user/logout" });
  },
  getFavourites = function () {
    if (fetchOpts.headers.Authorization === undefined) return;

    fetch(baseUrl + "/get-favorite-items", fetchOpts)
      .then(toJson)
      .then((res) =>
        APP_STATE.dispatch({
          type: "products/initFavourites",
          payload: res,
        })
      );
  },
  getUserAlerts = function () {
    fetch(baseUrl + "/get-user-notifications", fetchOpts)
      .then(toJson)
      .then(
        (r) =>
          r.length && APP_STATE.dispatch({ type: "user/setAlerts", payload: r })
      )
      .catch(console.error);

    fetch(baseUrl + "/get-addresses", fetchOpts)
      .then(toJson)
      .then((r) => {
        APP_STATE.dispatch({ type: "user/setAddresses", payload: r });
        APP_STATE.dispatch({ type: "user/setActiveAddress" });
      })
      .catch(console.error);

    fetch(baseUrl + "/cash-back", fetchOpts)
      .then((r) => r.json())
      .then((res) => {
        const cashback = res.data.find((c) => c.title === "cart");
        if (!cashback) return;
        cashback.is_active &&
          APP_STATE.dispatch({
            type: "products/setCashback",
            payload: cashback,
          });
      })
      .catch(console.error);

    fetch(baseUrl + "/get-orders", fetchOpts)
      .then((r) => r.json())
      .then((r) =>
        APP_STATE.dispatch({ type: "user/setPrevOrders", payload: r })
      );
  };

function toJson(res) {
  return res.json();
}

if (window.localStorage.getItem("token")) updateUserInfo();

if (savedSlug) {
  fetch(baseUrl + "/get-restaurant-info/" + savedSlug, fetchOpts)
    .then(toJson)
    .then((resData) => {
      if (!resData.is_active) {
        window.localStorage.removeItem("slug");
        window.location.reload();
        return;
      }

      APP_STATE.dispatch({ type: "restaurant/init", payload: resData });

      fetch(baseUrl + "/get-restaurant-items/" + savedSlug, fetchOpts)
        .then(toJson)
        .then((data) =>
          APP_STATE.dispatch({
            type: "products/init",
            payload: data,
          })
        );
    });
}
