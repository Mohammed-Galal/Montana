import { createSlice } from "@reduxjs/toolkit";

const slug = window.localStorage.getItem("slug"),
  OrdinaryCategoriesIds = [1, 2, 3, 4, 5, 6, 7],
  customOrderExp = new RegExp(
    [
      "اليوم الوطني",
      "يوم الميلاد",
      "مناسبات أعياد",
      "مناسبات رياضية",
      "مناسبات عامة",
      "تخرج أو نجاح",
      "هدية لأطفالك",
      "زفاف",
      "الحجز المبكر",
      "الطلبات الخاصة",
    ].join("|"),
  ),
  cartStorage = JSON.parse(window.localStorage.getItem("cartItems")) || {};

const Products = {
    name: "products",
    initialState: {
      loaded: false,
      is_special:
        (cartStorage[slug] || []).some((item) =>
          OrdinaryCategoriesIds.includes(item.category_id),
        ) === false,
      early_booking: [],
      custom: [],
      categories: [],
      occassionsCategories: [],
      customCategoriesExp: customOrderExp,
      miniCategories: [],
      data: [],
      cart: [],
      cashback: null,
      fav: [],
    },
  },
  reducers = (Products.reducers = {});

reducers.init = function (state, action) {
  const itemsObj = action.payload.items,
    customProducts = itemsObj["الطلبات الخاصة"] || [],
    earlyBooking = itemsObj["الحجز المبكر"] || [],
    items = [];

  delete itemsObj["الحجز المبكر"];
  delete itemsObj["الطلبات الخاصة"];

  const categories = Object.keys(itemsObj),
    slug = window.localStorage.getItem("slug"),
    cartItems = (cartStorage[slug] ||= []);

  categories.forEach((k) => {
    const visibilityFilteration = itemsObj[k].filter((i) => !!i.visible);
    items.push.apply(items, visibilityFilteration);
  });

  state.loaded = true;
  state.data = items;
  state.categories = categories;
  state.early_booking = earlyBooking;
  state.custom = customProducts.filter((i) => i.is_active);
  state.cart = cartItems;
};

reducers.initMiniCategories = function (state, { payload }) {
  state.miniCategories = payload;
};

reducers.addToCart = function (state, { payload }) {
  if (payload.quantity === 0) {
    state.cart = state.cart.filter((i) => i.id !== payload.id);
    return;
  }

  const isSpecialItem = payload.category_id > 7,
    clearCart =
      state.cart.length &&
      ((isSpecialItem && !state.is_special) ||
        (!isSpecialItem && state.is_special));

  state.is_special = isSpecialItem;

  const itemRef = state.cart.find((e) => e.id === payload.id);
  if (itemRef) {
    itemRef.quantity = payload.quantity;
    state.cart = [...state.cart];
  } else state.cart = [...state.cart, payload];

  if (payload.category_name !== "الطلبات الخاصة") {
    const slug = window.localStorage.getItem("slug");
    cartStorage[slug] = state.cart;
    window.localStorage.setItem("cartItems", JSON.stringify(cartStorage));
  }
};

reducers.setCashback = function (state, { payload }) {
  state.cashback = payload;
};

reducers.updateCartItem = function (state, { payload }) {
  const { index, quantity } = payload;
  if (quantity > 0) {
    const cartItem = state.cart[index];
    Object.assign(cartItem, {
      quantity,
      totalPrice:
        quantity * cartItem.price + calcAddonsPrice(cartItem.addons, quantity),
    });
    state.cart = [...state.cart];
  } else state.cart = state.cart.filter(($, i) => i !== index);

  const slug = window.localStorage.getItem("slug");
  cartStorage[slug] = state.cart;
  window.localStorage.setItem("cartItems", JSON.stringify(cartStorage));
};

reducers.initFavourites = function (state, { payload }) {
  state.fav = payload;
};

reducers.clearCart = function (s) {
  s.cart = [];
  const slug = window.localStorage.getItem("slug");
  cartStorage[slug] = s.cart;
  window.localStorage.setItem("cartItems", JSON.stringify(cartStorage));
};

// reducers.addSingleItemToCart = function (state, { item }) {
//   const targetItem = state.cart.find((e) => e.id === item.id);

//   if (targetItem) {
//     targetItem.quantity++;
//     state.cart = [...state.cart];
//   } else {
//     state.cart = [
//       ...state.cart,
//       {
//         category_name: item.category_name,
//         id: item.id,
//         slug: item.slug,
//         name: item.name,
//         name_ar: item.name_ar,
//         price: item.price,
//         restaurant_id: item.restaurant_id,
//         quantity: 1,
//         addons: [],
//         totalPrice: +item.price,
//       },
//     ];
//   }

//   const slug = window.localStorage.getItem("slug");
//   cartStorage[slug] = state.cart;
//   window.localStorage.setItem("cartItems", JSON.stringify(cartStorage));
// };

const Store = createSlice(Products);
export const { addToFav, removeFromFav } = Store.actions;
export default Store.reducer;

function calcAddonsPrice(arr, quantity) {
  let index = 0,
    result = 0;
  while (index < arr.length) result += arr[index++].price;
  return result * quantity;
}
