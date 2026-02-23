// Centralized API service layer
// This file handles all API calls and should be the single source of truth for network requests

const BASE_URL = process.env.REACT_APP_API_URL + "/public/api";

/**
 * Get fetch options with authorization token
 */
export function getFetchOpts(method = "POST", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const token = window.localStorage.getItem("token");
  if (token) {
    options.headers.Authorization = token;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Settings API
export const settingsAPI = {
  getSettings: () => fetchAPI("get-settings", getFetchOpts()),
};

// Restaurant API
export const restaurantAPI = {
  getAllBranches: (options = getFetchOpts()) =>
    fetchAPI("get-all-restaurant", options),

  getRestaurantInfo: (slug, options = getFetchOpts()) =>
    fetchAPI(`get-restaurant-info/${slug}`, options),

  getRestaurantItems: (slug, options = getFetchOpts()) =>
    fetchAPI(`get-restaurant-items/${slug}`, options),
};

// Products API
export const productsAPI = {
  getItemCategories: () =>
    fetch("/public/api/getItemcategories").then((r) => r.json()),
};

// User API
export const userAPI = {
  updateUserInfo: (options = getFetchOpts()) =>
    fetchAPI("update-user-info", options),

  getFavourites: (options = getFetchOpts()) =>
    fetchAPI("get-favorite-items", options),

  getUserAlerts: (options = getFetchOpts()) =>
    fetchAPI("get-user-notifications", options),

  getAddresses: (options = getFetchOpts()) =>
    fetchAPI("get-addresses", options),

  getCashback: (options = getFetchOpts()) => fetchAPI("cash-back", options),

  getOrders: (options = getFetchOpts()) => fetchAPI("get-orders", options),
};

// Sliders API
export const slidersAPI = {
  getSliders: () => fetchAPI("getSliders"),
};

export default {
  settings: settingsAPI,
  restaurant: restaurantAPI,
  products: productsAPI,
  user: userAPI,
  sliders: slidersAPI,
};
