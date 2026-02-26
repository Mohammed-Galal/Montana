import { useEffect, useRef } from "react";

export default function () {
  const initiated = useRef({});

  useEffect(() => {
    initiated.current === true || initPaymentForm();
    initiated.current = true;
  }, []);
  return (
    <section className="container" style={{ maxWidth: "750px" }}>
      <div id="embedded-sessions"></div>
    </section>
  );
}

const config = {
  // Add the "SessionId" you received from POST Session Endpoint.
  // sessionId: "KWT-68814db6-7510-4005-ada9-408aae9f373c",

  // MyFatoorah triggers this callback after the customer completes payment, either by submitting card details, finishing Google Pay / Apple Pay / STC Pay, or choosing any hosted payment method.
  // callback: payment,

  //Enter the div id you created in previous step.
  containerId: "embedded-sessions",

  // Default true
  shouldHandlePaymentUrl: true,
};

function initPaymentForm() {
  const reqURL = new URLSearchParams(window.location.search);

  window.myfatoorah.init({
    ...config,
    sessionId: reqURL.get("sessionId"),
    callback(res) {
      if (res.isSuccess) {
        window.location.href = `/invoice/${reqURL.get("orderId")}?paymentId=${extractPaymentId(res)}&sessionId=${reqURL.get("sessionId")}`;
        // window.parent.postMessage(
        //   {
        //     type: "Payment Confirm",
        //     payload: {
        //       orderId: reqURL.get("orderId"),
        //       sessionId: reqURL.get("sessionId"),
        //       paymentId: extractPaymentId(res),
        //     },
        //   },
        //   window.location.origin,
        // );
      }
    },
  });
}

function extractPaymentId(res) {
  const url = new URL(res.redirectionUrl);
  return url.searchParams.get("paymentId");
}
