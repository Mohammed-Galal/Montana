# API Endpoints Review

This document covers all active endpoints defined in `routes/api.php`.

- Base prefix: `/api`
- Source of parameter truth: route path placeholders + controller validation rules (`$request->validate`, `request()->validate`, `Validator::make`).
- When no validation exists, parameters are marked as **Not explicitly validated**.
- `Inferred optional` means the field is read in controller code but not enforced by a validation rule.

Total endpoints documented: 134

| # | Method | Endpoint | Path Params (Required) | Body/Query Required | Body/Query Optional | Notes |
|---|---|---|---|---|---|---|
| 1 | POST | `/api/accept-stripe-payment` | - | - | - | Not explicitly validated in controller. |
| 2 | POST | `/api/address-to-coordinate` | - | - | - | Not explicitly validated in controller. |
| 3 | POST | `/api/applay-job` | - | birthdate, cv, job_id, name, nationality, nationat_id, nationat_id_ex_date, phone, sex | certificate, email, experience, notes | Contains explicit and/or inferred optional fields. |
| 4 | POST | `/api/apply-coupon` | - | - | - | Not explicitly validated in controller. |
| 5 | POST | `/api/cancel-order` | - | - | - | Not explicitly validated in controller. |
| 6 | POST | `/api/cash-back` | - | - | - | Not explicitly validated in controller. |
| 7 | POST | `/api/change-avatar` | - | - | - | Not explicitly validated in controller. |
| 8 | POST | `/api/change-mobile` | - | otp, phone | - | Only required fields are explicitly validated. |
| 9 | POST | `/api/change-mobile-otp` | - | - | phone (inferred optional) | Contains explicit and/or inferred optional fields. |
| 10 | POST | `/api/change-user-password` | - | - | password (inferred optional) | Contains explicit and/or inferred optional fields. |
| 11 | POST | `/api/check-ban` | - | - | - | Not explicitly validated in controller. |
| 12 | POST | `/api/check-cart-items-availability` | - | - | - | Not explicitly validated in controller. |
| 13 | POST | `/api/check-restaurant-operation-service` | - | - | - | Not explicitly validated in controller. |
| 14 | POST | `/api/check-running-order` | - | - | - | Not explicitly validated in controller. |
| 15 | POST | `/api/conversation/chat` | - | - | - | Not explicitly validated in controller. |
| 16 | POST | `/api/coordinate-to-address` | - | - | - | Not explicitly validated in controller. |
| 17 | POST | `/api/delete-address` | - | address_id | - | Only required fields are explicitly validated. |
| 18 | POST | `/api/delivery/accept-to-deliver` | - | - | - | Not explicitly validated in controller. |
| 19 | POST | `/api/delivery/deliver-order` | - | - | - | Not explicitly validated in controller. |
| 20 | POST | `/api/delivery/get-completed-orders` | - | - | - | Not explicitly validated in controller. |
| 21 | POST | `/api/delivery/get-delivery-guy-gps-location` | - | - | - | Not explicitly validated in controller. |
| 22 | POST | `/api/delivery/get-delivery-orders` | - | - | - | Not explicitly validated in controller. |
| 23 | POST | `/api/delivery/get-single-delivery-order` | - | - | - | Not explicitly validated in controller. |
| 24 | POST | `/api/delivery/login` | - | - | - | Not explicitly validated in controller. |
| 25 | POST | `/api/delivery/pickedup-order` | - | - | - | Not explicitly validated in controller. |
| 26 | POST | `/api/delivery/set-delivery-guy-gps-location` | - | - | - | Not explicitly validated in controller. |
| 27 | POST | `/api/delivery/toggle-delivery-guy-status` | - | - | force_offline (inferred optional), toggle_status (inferred optional) | Contains explicit and/or inferred optional fields. |
| 28 | POST | `/api/delivery/update-user-info` | - | - | force_offline (inferred optional), toggle_status (inferred optional) | Contains explicit and/or inferred optional fields. |
| 29 | POST | `/api/forgot-password` | - | - | phone (inferred optional) | Contains explicit and/or inferred optional fields. |
| 30 | POST | `/api/generate-otp-for-login` | - | - | - | Not explicitly validated in controller. |
| 31 | POST | `/api/get-addresses` | - | - | - | Not explicitly validated in controller. |
| 32 | POST | `/api/get-all-languages` | - | - | - | Not explicitly validated in controller. |
| 33 | POST | `/api/get-all-restaurant` | - | - | - | Not explicitly validated in controller. |
| 34 | POST | `/api/get-all-restaurants-categories` | - | - | - | Not explicitly validated in controller. |
| 35 | POST | `/api/get-delivery-restaurants` | - | - | - | Not explicitly validated in controller. |
| 36 | POST | `/api/get-favorite-items` | - | - | - | Not explicitly validated in controller. |
| 37 | POST | `/api/get-favorite-stores` | - | - | - | Not explicitly validated in controller. |
| 38 | POST | `/api/get-filtered-restaurants` | - | - | - | Not explicitly validated in controller. |
| 39 | POST | `/api/get-order-items` | - | - | - | Not explicitly validated in controller. |
| 40 | POST | `/api/get-orders` | - | - | - | Not explicitly validated in controller. |
| 41 | POST | `/api/get-pages` | - | - | - | Not explicitly validated in controller. |
| 42 | POST | `/api/get-payment-gateways` | - | - | - | Not explicitly validated in controller. |
| 43 | POST | `/api/get-ratable-order` | - | - | - | Not explicitly validated in controller. |
| 44 | POST | `/api/get-restaurant-category-slides` | - | - | - | Not explicitly validated in controller. |
| 45 | POST | `/api/get-restaurant-info-and-operational-status` | - | - | - | Not explicitly validated in controller. |
| 46 | POST | `/api/get-restaurant-info-by-id/{id}` | id | - | - | Not explicitly validated in controller. |
| 47 | POST | `/api/get-restaurant-info-with-favourite/{slug}` | slug | - | - | Not explicitly validated in controller. |
| 48 | POST | `/api/get-restaurant-info/{slug}` | slug | - | - | Not explicitly validated in controller. |
| 49 | POST | `/api/get-restaurant-items/{slug}` | slug | - | - | Not explicitly validated in controller. |
| 50 | POST | `/api/get-selfpickup-restaurants` | - | - | - | Not explicitly validated in controller. |
| 51 | GET | `/api/get-setting/{key}` | key | - | - | Not explicitly validated in controller. |
| 52 | POST | `/api/get-settings` | - | - | - | Not explicitly validated in controller. |
| 53 | POST | `/api/get-single-item` | - | - | - | Not explicitly validated in controller. |
| 54 | POST | `/api/get-single-language` | - | - | - | Not explicitly validated in controller. |
| 55 | POST | `/api/get-single-page` | - | - | - | Not explicitly validated in controller. |
| 56 | GET | `/api/get-store-reviews/{slug}` | slug | - | - | Not explicitly validated in controller. |
| 57 | POST | `/api/get-user-notifications` | - | - | - | Not explicitly validated in controller. |
| 58 | POST | `/api/get-wallet-transactions` | - | - | - | Not explicitly validated in controller. |
| 59 | GET | `/api/getAppSetting` | - | - | - | Not explicitly validated in controller. |
| 60 | GET | `/api/getItemcategories` | - | - | - | Not explicitly validated in controller. |
| 61 | GET | `/api/getSliders` | - | - | - | Not explicitly validated in controller. |
| 62 | GET | `/api/job-details/{id}` | id | - | - | Not explicitly validated in controller. |
| 63 | POST | `/api/jobs` | - | - | - | Not explicitly validated in controller. |
| 64 | POST | `/api/login` | - | - | - | Not explicitly validated in controller. |
| 65 | POST | `/api/login-with-otp` | - | email, name, phone | - | Only required fields are explicitly validated. |
| 66 | POST | `/api/mark-all-notifications-read` | - | - | - | Not explicitly validated in controller. |
| 67 | POST | `/api/mark-one-notification-read` | - | - | - | Not explicitly validated in controller. |
| 68 | POST | `/api/payment-callback` | - | - | order_id (inferred optional), paymentId (inferred optional) | Contains explicit and/or inferred optional fields. |
| 69 | GET | `/api/payment/handle-process-paymongo/{id}` | id | - | - | Not explicitly validated in controller. |
| 70 | GET | `/api/payment/paytm/{order_id}` | order_id | - | - | Not explicitly validated in controller. |
| 71 | GET | `/api/payment/process-mercado-pago/{id}` | id | - | - | Not explicitly validated in controller. |
| 72 | POST | `/api/payment/process-paymongo` | - | amount, ccCvv, ccExp, ccNum, email, name, phone | - | Only required fields are explicitly validated. |
| 73 | POST | `/api/payment/process-paytm` | - | - | - | Not explicitly validated in controller. |
| 74 | POST | `/api/payment/process-razor-pay` | - | - | - | Not explicitly validated in controller. |
| 75 | POST | `/api/payment/razorpay/create-order` | - | - | - | Not explicitly validated in controller. |
| 76 | POST | `/api/payment/razorpay/process` | - | - | - | Not explicitly validated in controller. |
| 77 | POST | `/api/payment/razorpay/webhook` | - | - | - | Not explicitly validated in controller. |
| 78 | GET | `/api/payment/return-mercado-pago` | - | - | - | Not explicitly validated in controller. |
| 79 | GET | `/api/payment/verify-khalti-payment` | - | - | - | Not explicitly validated in controller. |
| 80 | POST | `/api/place-order` | - | - | CallBackUrl (inferred optional), cash_change_amount (inferred optional), coupon (inferred optional), images (inferred optional), is_special (inferred optional), location (inferred optional), method (inferred optional), order (inferred optional), order_comment (inferred optional), pending_payment (inferred optional), phrase (inferred optional), tipAmount (inferred optional), user (inferred optional) | Contains explicit and/or inferred optional fields. |
| 81 | POST | `/api/popular-geo-locations` | - | - | - | Not explicitly validated in controller. |
| 82 | POST | `/api/popular-locations` | - | - | - | Not explicitly validated in controller. |
| 83 | POST | `/api/promo-slider` | - | - | - | Not explicitly validated in controller. |
| 84 | POST | `/api/rate-order` | - | - | - | Not explicitly validated in controller. |
| 85 | POST | `/api/register` | - | email, name, password, phone | - | Only required fields are explicitly validated. |
| 86 | POST | `/api/resend/otp` | - | phone | type (inferred optional) | Contains explicit and/or inferred optional fields. |
| 87 | POST | `/api/save-address` | - | address | house, latitude, longitude, tag | Contains explicit and/or inferred optional fields. |
| 88 | POST | `/api/save-notification-token` | - | - | - | Not explicitly validated in controller. |
| 89 | POST | `/api/save-notification-token-no-user` | - | - | - | Not explicitly validated in controller. |
| 90 | POST | `/api/search-location/{query}` | query | - | - | Not explicitly validated in controller. |
| 91 | POST | `/api/search-restaurants` | - | - | - | Not explicitly validated in controller. |
| 92 | POST | `/api/send-otp` | - | - | - | Not explicitly validated in controller. |
| 93 | POST | `/api/send-password-reset-mail` | - | - | - | Not explicitly validated in controller. |
| 94 | POST | `/api/set-default-address` | - | - | - | Not explicitly validated in controller. |
| 95 | POST | `/api/store-owner/accept-order` | - | - | - | Not explicitly validated in controller. |
| 96 | POST | `/api/store-owner/cancel-order` | - | - | - | Not explicitly validated in controller. |
| 97 | POST | `/api/store-owner/confirm-scheduled-order` | - | - | - | Not explicitly validated in controller. |
| 98 | POST | `/api/store-owner/dashboard` | - | - | - | Not explicitly validated in controller. |
| 99 | POST | `/api/store-owner/edit-item` | - | - | - | Not explicitly validated in controller. |
| 100 | GET | `/api/store-owner/get-all-language` | - | - | - | Not explicitly validated in controller. |
| 101 | POST | `/api/store-owner/get-earnings` | - | - | - | Not explicitly validated in controller. |
| 102 | POST | `/api/store-owner/get-inactive-items` | - | - | - | Not explicitly validated in controller. |
| 103 | POST | `/api/store-owner/get-menu` | - | - | - | Not explicitly validated in controller. |
| 104 | POST | `/api/store-owner/get-orders` | - | - | - | Not explicitly validated in controller. |
| 105 | POST | `/api/store-owner/get-past-orders` | - | - | - | Not explicitly validated in controller. |
| 106 | POST | `/api/store-owner/get-ratings` | - | - | - | Not explicitly validated in controller. |
| 107 | GET | `/api/store-owner/get-single-language/{language_code}` | language_code | - | - | Not explicitly validated in controller. |
| 108 | POST | `/api/store-owner/get-single-order` | - | - | - | Not explicitly validated in controller. |
| 109 | POST | `/api/store-owner/get-store-page` | - | - | - | Not explicitly validated in controller. |
| 110 | POST | `/api/store-owner/login` | - | - | - | Not explicitly validated in controller. |
| 111 | POST | `/api/store-owner/mark-selfpickup-order-completed` | - | - | - | Not explicitly validated in controller. |
| 112 | POST | `/api/store-owner/mark-selfpickup-order-ready` | - | - | - | Not explicitly validated in controller. |
| 113 | POST | `/api/store-owner/search-items` | - | - | - | Not explicitly validated in controller. |
| 114 | POST | `/api/store-owner/search-orders` | - | - | - | Not explicitly validated in controller. |
| 115 | POST | `/api/store-owner/send-payout-request` | - | - | - | Not explicitly validated in controller. |
| 116 | POST | `/api/store-owner/toggle-category-status` | - | - | - | Not explicitly validated in controller. |
| 117 | POST | `/api/store-owner/toggle-item-status` | - | - | - | Not explicitly validated in controller. |
| 118 | POST | `/api/store-owner/toggle-store-status` | - | - | - | Not explicitly validated in controller. |
| 119 | POST | `/api/store-owner/update-item` | - | - | - | Not explicitly validated in controller. |
| 120 | POST | `/api/store-owner/update-item-image` | - | - | - | Not explicitly validated in controller. |
| 121 | GET | `/api/stripe-redirect-capture` | - | - | order_id (inferred optional) | Contains explicit and/or inferred optional fields. |
| 122 | POST | `/api/toggle-favorite` | - | - | - | Not explicitly validated in controller. |
| 123 | POST | `/api/toggle-favorite-item` | - | - | - | Not explicitly validated in controller. |
| 124 | POST | `/api/update-app-token-for-user` | - | - | - | Not explicitly validated in controller. |
| 125 | POST | `/api/update-tax-number` | - | - | - | Not explicitly validated in controller. |
| 126 | POST | `/api/update-user-data` | - | email, name, old_password, phone | new_password (inferred optional) | Contains explicit and/or inferred optional fields. |
| 127 | POST | `/api/update-user-info` | - | - | - | Not explicitly validated in controller. |
| 128 | POST | `/api/user/reset-password` | - | otp, password, phone | - | Only required fields are explicitly validated. |
| 129 | POST | `/api/user/verify-otp` | - | otp, phone | - | Only required fields are explicitly validated. |
| 130 | POST | `/api/verify-otp` | - | - | - | Not explicitly validated in controller. |
| 131 | POST | `/api/verify-password-reset-otp` | - | - | - | Not explicitly validated in controller. |
| 132 | POST | `/api/files-checksum` | - | - | - | Not explicitly validated in controller. |
| 133 | POST | `/api/shipping/webhook` | - | - | client_order_id (inferred optional), status (inferred optional) | Contains explicit and/or inferred optional fields. |
| 134 | GET | `/api/test-payment` | - | - | - | Not explicitly validated in controller. |

## Controller Mapping

1. `POST /api/accept-stripe-payment` -> `PaymentController@acceptStripePayment` (app/Http/Controllers/PaymentController.php)
2. `POST /api/address-to-coordinate` -> `GeocoderController@addressToCoordinates` (app/Http/Controllers/GeocoderController.php)
3. `POST /api/applay-job` -> `JobApplyController@applayJob` (app/Http/Controllers/JobApplyController.php)
4. `POST /api/apply-coupon` -> `CouponController@applyCoupon` (app/Http/Controllers/CouponController.php)
5. `POST /api/cancel-order` -> `OrderController@cancelOrder` (app/Http/Controllers/OrderController.php)
6. `POST /api/cash-back` -> `CashBackController@getActiveCashBack` (app/Http/Controllers/CashBackController.php)
7. `POST /api/change-avatar` -> `UserController@changeAvatar` (app/Http/Controllers/UserController.php)
8. `POST /api/change-mobile` -> `UserController@changeMobile` (app/Http/Controllers/UserController.php)
9. `POST /api/change-mobile-otp` -> `UserController@changeMobileOtp` (app/Http/Controllers/UserController.php)
10. `POST /api/change-user-password` -> `PasswordResetController@changeUserPassword` (app/Http/Controllers/PasswordResetController.php)
11. `POST /api/check-ban` -> `UserController@checkBan` (app/Http/Controllers/UserController.php)
12. `POST /api/check-cart-items-availability` -> `RestaurantController@checkCartItemsAvailability` (app/Http/Controllers/RestaurantController.php)
13. `POST /api/check-restaurant-operation-service` -> `RestaurantController@checkRestaurantOperationService` (app/Http/Controllers/RestaurantController.php)
14. `POST /api/check-running-order` -> `UserController@checkRunningOrder` (app/Http/Controllers/UserController.php)
15. `POST /api/conversation/chat` -> `ChatController@deliveryCustomerChat` (app/Http/Controllers/ChatController.php)
16. `POST /api/coordinate-to-address` -> `GeocoderController@coordinatesToAddress` (app/Http/Controllers/GeocoderController.php)
17. `POST /api/delete-address` -> `AddressController@deleteAddress` (app/Http/Controllers/AddressController.php)
18. `POST /api/delivery/accept-to-deliver` -> `DeliveryController@acceptToDeliver` (app/Http/Controllers/DeliveryController.php)
19. `POST /api/delivery/deliver-order` -> `DeliveryController@deliverOrder` (app/Http/Controllers/DeliveryController.php)
20. `POST /api/delivery/get-completed-orders` -> `DeliveryController@getCompletedOrders` (app/Http/Controllers/DeliveryController.php)
21. `POST /api/delivery/get-delivery-guy-gps-location` -> `DeliveryController@getDeliveryGuyGpsLocation` (app/Http/Controllers/DeliveryController.php)
22. `POST /api/delivery/get-delivery-orders` -> `DeliveryController@getDeliveryOrders` (app/Http/Controllers/DeliveryController.php)
23. `POST /api/delivery/get-single-delivery-order` -> `DeliveryController@getSingleDeliveryOrder` (app/Http/Controllers/DeliveryController.php)
24. `POST /api/delivery/login` -> `DeliveryController@login` (app/Http/Controllers/DeliveryController.php)
25. `POST /api/delivery/pickedup-order` -> `DeliveryController@pickedupOrder` (app/Http/Controllers/DeliveryController.php)
26. `POST /api/delivery/set-delivery-guy-gps-location` -> `DeliveryController@setDeliveryGuyGpsLocation` (app/Http/Controllers/DeliveryController.php)
27. `POST /api/delivery/toggle-delivery-guy-status` -> `DeliveryController@updateDeliveryUserInfo` (app/Http/Controllers/DeliveryController.php)
28. `POST /api/delivery/update-user-info` -> `DeliveryController@updateDeliveryUserInfo` (app/Http/Controllers/DeliveryController.php)
29. `POST /api/forgot-password` -> `UserController@forgotPassword` (app/Http/Controllers/UserController.php)
30. `POST /api/generate-otp-for-login` -> `SmsController@generateOtpForLogin` (app/Http/Controllers/SmsController.php)
31. `POST /api/get-addresses` -> `AddressController@getAddresses` (app/Http/Controllers/AddressController.php)
32. `POST /api/get-all-languages` -> `LanguageController@getAllLanguages` (app/Http/Controllers/LanguageController.php)
33. `POST /api/get-all-restaurant` -> `RestaurantController@getAllRestaurants` (app/Http/Controllers/RestaurantController.php)
34. `POST /api/get-all-restaurants-categories` -> `RestaurantCategoryController@getAllRestaurantsCategories` (app/Http/Controllers/RestaurantCategoryController.php)
35. `POST /api/get-delivery-restaurants` -> `RestaurantController@getDeliveryRestaurants` (app/Http/Controllers/RestaurantController.php)
36. `POST /api/get-favorite-items` -> `UserController@getFavoriteItems` (app/Http/Controllers/UserController.php)
37. `POST /api/get-favorite-stores` -> `RestaurantController@getFavoriteStores` (app/Http/Controllers/RestaurantController.php)
38. `POST /api/get-filtered-restaurants` -> `RestaurantController@getFilteredRestaurants` (app/Http/Controllers/RestaurantController.php)
39. `POST /api/get-order-items` -> `OrderController@getOrderItems` (app/Http/Controllers/OrderController.php)
40. `POST /api/get-orders` -> `OrderController@getOrders` (app/Http/Controllers/OrderController.php)
41. `POST /api/get-pages` -> `PageController@getPages` (app/Http/Controllers/PageController.php)
42. `POST /api/get-payment-gateways` -> `PaymentController@getPaymentGateways` (app/Http/Controllers/PaymentController.php)
43. `POST /api/get-ratable-order` -> `RatingReviewController@getRatableOrder` (app/Http/Controllers/RatingReviewController.php)
44. `POST /api/get-restaurant-category-slides` -> `RestaurantCategoryController@getRestaurantCategorySlider` (app/Http/Controllers/RestaurantCategoryController.php)
45. `POST /api/get-restaurant-info-and-operational-status` -> `RestaurantController@getRestaurantInfoAndOperationalStatus` (app/Http/Controllers/RestaurantController.php)
46. `POST /api/get-restaurant-info-by-id/{id}` -> `RestaurantController@getRestaurantInfoById` (app/Http/Controllers/RestaurantController.php)
47. `POST /api/get-restaurant-info-with-favourite/{slug}` -> `RestaurantController@getRestaurantInfoWithFavourite` (app/Http/Controllers/RestaurantController.php)
48. `POST /api/get-restaurant-info/{slug}` -> `RestaurantController@getRestaurantInfo` (app/Http/Controllers/RestaurantController.php)
49. `POST /api/get-restaurant-items/{slug}` -> `RestaurantController@getRestaurantItems` (app/Http/Controllers/RestaurantController.php)
50. `POST /api/get-selfpickup-restaurants` -> `RestaurantController@getSelfPickupRestaurants` (app/Http/Controllers/RestaurantController.php)
51. `GET /api/get-setting/{key}` -> `SettingController@getSettingByKey` (app/Http/Controllers/SettingController.php)
52. `POST /api/get-settings` -> `SettingController@getSettings` (app/Http/Controllers/SettingController.php)
53. `POST /api/get-single-item` -> `RestaurantController@getSingleItem` (app/Http/Controllers/RestaurantController.php)
54. `POST /api/get-single-language` -> `LanguageController@getSingleLanguage` (app/Http/Controllers/LanguageController.php)
55. `POST /api/get-single-page` -> `PageController@getSinglePage` (app/Http/Controllers/PageController.php)
56. `GET /api/get-store-reviews/{slug}` -> `RatingReviewController@getRatingAndReview` (app/Http/Controllers/RatingReviewController.php)
57. `POST /api/get-user-notifications` -> `NotificationController@getUserNotifications` (app/Http/Controllers/NotificationController.php)
58. `POST /api/get-wallet-transactions` -> `UserController@getWalletTransactions` (app/Http/Controllers/UserController.php)
59. `GET /api/getAppSetting` -> `SettingController@getAppSetting` (app/Http/Controllers/SettingController.php)
60. `GET /api/getItemcategories` -> `RestaurantController@getItemcategories` (app/Http/Controllers/RestaurantController.php)
61. `GET /api/getSliders` -> `PromoSliderController@getSliders` (app/Http/Controllers/PromoSliderController.php)
62. `GET /api/job-details/{id}` -> `JobsController@getJobDetails` (app/Http/Controllers/JobsController.php)
63. `POST /api/jobs` -> `JobsController@getActiveJobs` (app/Http/Controllers/JobsController.php)
64. `POST /api/login` -> `UserController@login` (app/Http/Controllers/UserController.php)
65. `POST /api/login-with-otp` -> `UserController@loginWithOtp` (app/Http/Controllers/UserController.php)
66. `POST /api/mark-all-notifications-read` -> `NotificationController@markAllNotificationsRead` (app/Http/Controllers/NotificationController.php)
67. `POST /api/mark-one-notification-read` -> `NotificationController@markOneNotificationRead` (app/Http/Controllers/NotificationController.php)
68. `POST /api/payment-callback` -> `OrderController@paymentCallBack` (app/Http/Controllers/OrderController.php)
69. `GET /api/payment/handle-process-paymongo/{id}` -> `PaymentController@handlePayMongoRedirect` (app/Http/Controllers/PaymentController.php)
70. `GET /api/payment/paytm/{order_id}` -> `PaymentController@payWithPaytm` (app/Http/Controllers/PaymentController.php)
71. `GET /api/payment/process-mercado-pago/{id}` -> `PaymentController@processMercadoPago` (app/Http/Controllers/PaymentController.php)
72. `POST /api/payment/process-paymongo` -> `PaymentController@processPaymongo` (app/Http/Controllers/PaymentController.php)
73. `POST /api/payment/process-paytm` -> `PaymentController@processPaytm` (app/Http/Controllers/PaymentController.php)
74. `POST /api/payment/process-razor-pay` -> `PaymentController@processRazorpay` (app/Http/Controllers/PaymentController.php)
75. `POST /api/payment/razorpay/create-order` -> `RazorpayController@razorPayCreateOrder` (app/Http/Controllers/RazorpayController.php)
76. `POST /api/payment/razorpay/process` -> `RazorpayController@processRazorpayPayment` (app/Http/Controllers/RazorpayController.php)
77. `POST /api/payment/razorpay/webhook` -> `RazorpayController@webhook` (app/Http/Controllers/RazorpayController.php)
78. `GET /api/payment/return-mercado-pago` -> `PaymentController@returnMercadoPago` (app/Http/Controllers/PaymentController.php)
79. `GET /api/payment/verify-khalti-payment` -> `PaymentController@verifyKhaltiPayment` (app/Http/Controllers/PaymentController.php)
80. `POST /api/place-order` -> `OrderController@placeOrder` (app/Http/Controllers/OrderController.php)
81. `POST /api/popular-geo-locations` -> `LocationController@popularGeoLocations` (app/Http/Controllers/LocationController.php)
82. `POST /api/popular-locations` -> `LocationController@popularLocations` (app/Http/Controllers/LocationController.php)
83. `POST /api/promo-slider` -> `PromoSliderController@promoSlider` (app/Http/Controllers/PromoSliderController.php)
84. `POST /api/rate-order` -> `RatingReviewController@rateOrder` (app/Http/Controllers/RatingReviewController.php)
85. `POST /api/register` -> `UserController@register` (app/Http/Controllers/UserController.php)
86. `POST /api/resend/otp` -> `UserController@resendOtp` (app/Http/Controllers/UserController.php)
87. `POST /api/save-address` -> `AddressController@saveAddress` (app/Http/Controllers/AddressController.php)
88. `POST /api/save-notification-token` -> `NotificationController@saveToken` (app/Http/Controllers/NotificationController.php)
89. `POST /api/save-notification-token-no-user` -> `NotificationController@saveTokenNoUser` (app/Http/Controllers/NotificationController.php)
90. `POST /api/search-location/{query}` -> `LocationController@searchLocation` (app/Http/Controllers/LocationController.php)
91. `POST /api/search-restaurants` -> `RestaurantController@searchRestaurants` (app/Http/Controllers/RestaurantController.php)
92. `POST /api/send-otp` -> `SmsController@sendOtp` (app/Http/Controllers/SmsController.php)
93. `POST /api/send-password-reset-mail` -> `PasswordResetController@sendPasswordResetMail` (app/Http/Controllers/PasswordResetController.php)
94. `POST /api/set-default-address` -> `AddressController@setDefaultAddress` (app/Http/Controllers/AddressController.php)
95. `POST /api/store-owner/accept-order` -> `StoreOwner\StoreOwnerAppController@acceptOrder` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
96. `POST /api/store-owner/cancel-order` -> `StoreOwner\StoreOwnerAppController@cancelOrder` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
97. `POST /api/store-owner/confirm-scheduled-order` -> `StoreOwner\StoreOwnerAppController@confirmScheduledOrder` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
98. `POST /api/store-owner/dashboard` -> `StoreOwner\StoreOwnerAppController@dashboard` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
99. `POST /api/store-owner/edit-item` -> `StoreOwner\StoreOwnerAppController@editItem` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
100. `GET /api/store-owner/get-all-language` -> `StoreOwner\StoreOwnerAppController@getAllLanguage` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
101. `POST /api/store-owner/get-earnings` -> `StoreOwner\StoreOwnerAppController@getEarnings` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
102. `POST /api/store-owner/get-inactive-items` -> `StoreOwner\StoreOwnerAppController@getInactiveItems` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
103. `POST /api/store-owner/get-menu` -> `StoreOwner\StoreOwnerAppController@getMenu` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
104. `POST /api/store-owner/get-orders` -> `StoreOwner\StoreOwnerAppController@getOrders` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
105. `POST /api/store-owner/get-past-orders` -> `StoreOwner\StoreOwnerAppController@getPastOrders` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
106. `POST /api/store-owner/get-ratings` -> `StoreOwner\StoreOwnerAppController@getRatings` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
107. `GET /api/store-owner/get-single-language/{language_code}` -> `StoreOwner\StoreOwnerAppController@getSingleLanguage` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
108. `POST /api/store-owner/get-single-order` -> `StoreOwner\StoreOwnerAppController@getSingleOrder` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
109. `POST /api/store-owner/get-store-page` -> `StoreOwner\StoreOwnerAppController@getStorePage` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
110. `POST /api/store-owner/login` -> `StoreOwner\StoreOwnerAppController@login` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
111. `POST /api/store-owner/mark-selfpickup-order-completed` -> `StoreOwner\StoreOwnerAppController@markSelfpickupOrderCompleted` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
112. `POST /api/store-owner/mark-selfpickup-order-ready` -> `StoreOwner\StoreOwnerAppController@markSelfpickupOrderReady` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
113. `POST /api/store-owner/search-items` -> `StoreOwner\StoreOwnerAppController@searchItems` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
114. `POST /api/store-owner/search-orders` -> `StoreOwner\StoreOwnerAppController@searchOrders` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
115. `POST /api/store-owner/send-payout-request` -> `StoreOwner\StoreOwnerAppController@sendPayoutRequest` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
116. `POST /api/store-owner/toggle-category-status` -> `StoreOwner\StoreOwnerAppController@toggleCategoryStatus` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
117. `POST /api/store-owner/toggle-item-status` -> `StoreOwner\StoreOwnerAppController@toggleItemStatus` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
118. `POST /api/store-owner/toggle-store-status` -> `StoreOwner\StoreOwnerAppController@toggleStoreStatus` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
119. `POST /api/store-owner/update-item` -> `StoreOwner\StoreOwnerAppController@updateItem` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
120. `POST /api/store-owner/update-item-image` -> `StoreOwner\StoreOwnerAppController@updateItemImage` (app/Http/Controllers/StoreOwner/StoreOwnerAppController.php)
121. `GET /api/stripe-redirect-capture` -> `PaymentController@stripeRedirectCapture` (app/Http/Controllers/PaymentController.php)
122. `POST /api/toggle-favorite` -> `UserController@toggleFavorite` (app/Http/Controllers/UserController.php)
123. `POST /api/toggle-favorite-item` -> `UserController@toggleFavoriteItem` (app/Http/Controllers/UserController.php)
124. `POST /api/update-app-token-for-user` -> `NotificationController@updateAppTokenForUser` (app/Http/Controllers/NotificationController.php)
125. `POST /api/update-tax-number` -> `UserController@updateTaxNumber` (app/Http/Controllers/UserController.php)
126. `POST /api/update-user-data` -> `UserController@updateUserData` (app/Http/Controllers/UserController.php)
127. `POST /api/update-user-info` -> `UserController@updateUserInfo` (app/Http/Controllers/UserController.php)
128. `POST /api/user/reset-password` -> `UserController@resetPassword` (app/Http/Controllers/UserController.php)
129. `POST /api/user/verify-otp` -> `UserController@verifyOtp` (app/Http/Controllers/UserController.php)
130. `POST /api/verify-otp` -> `SmsController@verifyOtp` (app/Http/Controllers/SmsController.php)
131. `POST /api/verify-password-reset-otp` -> `PasswordResetController@verifyPasswordResetOtp` (app/Http/Controllers/PasswordResetController.php)
132. `POST /api/files-checksum` -> `FilesChecksumController@filesCheck` (app/Http/Controllers/FilesChecksumController.php)
133. `POST /api/shipping/webhook` -> `ShippingWebHookController@webhook` (app/Http/Controllers/ShippingWebHookController.php)
134. `GET /api/test-payment` -> `PaymentController@initiateMyfatoorahPayment` (app/Http/Controllers/PaymentController.php)
