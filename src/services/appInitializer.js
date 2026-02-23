// Application initialization service
// Handles all app startup API calls that were previously in store/index.js

import { store } from "../store/index.js";
import {
  getFetchOpts,
  restaurantAPI,
  settingsAPI,
  productsAPI,
  slidersAPI,
  userAPI,
} from "./api.js";

// Cart message for validation
const CART_MSG =
  "لا يمكن اضافة الطلب المخصص الى العربة بجانب الطلبات الأخرى، هل تريد إخلاء العربة؟";

// Initialize mini categories
export function initializeMiniCategories() {
  productsAPI
    .getItemCategories()
    .then((data) => {
      store.dispatch({
        type: "products/initMiniCategories",
        payload: data,
      });
    })
    .catch(console.error);
}

// Initialize geolocation
export function initializeGeolocation() {
  if (!("geolocation" in navigator)) {
    console.warn("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        latitude: "" + position.coords.latitude,
        longitude: "" + position.coords.longitude,
      };
      store.dispatch({ type: "user/setLoc", payload: coords });
    },
    (error) => console.error("Geolocation error:", error),
  );
}

// Initialize settings
export function initializeSettings() {
  settingsAPI
    .getSettings()
    .then((data) => {
      store.dispatch({ type: "settings/init", payload: data });
    })
    .catch(console.error);
}

// Initialize restaurant branches
export function initializeBranches() {
  restaurantAPI
    .getAllBranches()
    .then((data) => {
      store.dispatch({
        type: "restaurant/INIT_BRANCHES",
        payload: data,
      });
    })
    .catch(console.error);
}

// Initialize sliders
export function initializeSliders() {
  slidersAPI
    .getSliders()
    .then((data) => {
      store.dispatch({ type: "sliders/init", payload: data });
    })
    .catch(console.error);
}

// Update user info if logged in
export function updateUserInfo() {
  const token = window.localStorage.getItem("token");
  if (!token) return;

  userAPI
    .updateUserInfo()
    .then((response) => {
      store.dispatch({ type: "user/init", payload: response.data });
      loadUserData();
    })
    .catch(console.error);
}

// Load all user-related data
function loadUserData() {
  const opts = getFetchOpts();

  // Load favorites
  userAPI
    .getFavourits(opts)
    .then((response) => {
      store.dispatch({
        type: "products/initFavourites",
        payload: response,
      });
    })
    .catch(console.error);

  // Load notifications
  userAPI
    .getUserAlerts(opts)
    .then((alerts) => {
      if (alerts && alerts.length) {
        store.dispatch({ type: "user/setAlerts", payload: alerts });
      }
    })
    .catch(console.error);

  // Load addresses
  userAPI
    .getAddresses(opts)
    .then((addresses) => {
      store.dispatch({ type: "user/setAddresses", payload: addresses });
      store.dispatch({ type: "user/setActiveAddress" });
    })
    .catch(console.error);

  // Load cashback
  userAPI
    .getCashback(opts)
    .then((response) => {
      const cashback = response.data?.find((c) => c.title === "cart");
      if (cashback?.is_active) {
        store.dispatch({
          type: "products/setCashback",
          payload: cashback,
        });
      }
    })
    .catch(console.error);

  // Load orders
  userAPI
    .getOrders(opts)
    .then((orders) => {
      store.dispatch({ type: "user/setPrevOrders", payload: orders });
    })
    .catch(console.error);
}

// Initialize restaurant with slug
export function initializeRestaurant(slug) {
  if (!slug) return Promise.resolve(null);

  return restaurantAPI
    .getRestaurantInfo(slug)
    .then((data) => {
      if (!data.is_active) {
        window.localStorage.removeItem("slug");
        window.location.reload();
        return null;
      }

      store.dispatch({ type: "restaurant/init", payload: data });

      // Load restaurant items
      return restaurantAPI.getRestaurantItems(slug);
    })
    .then((items) => {
      if (items) {
        store.dispatch({
          type: "products/init",
          payload: items,
        });
      }
    })
    .catch(console.error);
}

// Cart validation for special items
export function cartValidation(action) {
  if (action.type === "products/addToCart") {
    const state = store.getState().Products;
    const cart = state.cart;
    const payload = action.payload;

    const isSpecialItem = payload.category_id > 7;
    const clearCart =
      cart.length &&
      ((isSpecialItem && !state.is_special) ||
        (!isSpecialItem && state.is_special));

    if (!clearCart) return action;

    // Use the modal
    if (window.modalOptions?.open) {
      window.modalOptions.open(CART_MSG, function (proceedToClear) {
        if (!proceedToClear) return;
        store.dispatch({ type: "products/clearCart" });
        store.dispatch(action);
      });
    }

    return store.getState();
  }

  return action;
}

// Initialize everything
export function initializeApp() {
  // Initialize all the things
  initializeMiniCategories();
  initializeGeolocation();
  initializeSettings();
  initializeBranches();
  initializeSliders();

  // Check for saved slug and load restaurant
  const savedSlug = window.localStorage.getItem("slug");
  initializeRestaurant(savedSlug);

  // Check for user login
  updateUserInfo();
}

export default {
  initializeApp,
  initializeMiniCategories,
  initializeGeolocation,
  initializeSettings,
  initializeBranches,
  initializeSliders,
  updateUserInfo,
  initializeRestaurant,
  cartValidation,
};
