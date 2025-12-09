/* eslint-disable import/no-anonymous-default-export */
import CurrencySymbol from "../../../../CurrencySymbol";
import getPage from "../../../../translation";
import { useLayoutEffect, useState } from "react";

const getText = getPage("settings"),
  api = process.env.REACT_APP_API_URL + "/public/api/get-wallet-transactions";

export default function () {
  const [balance, setBalance] = useState(getText(23));

  useLayoutEffect(function () {
    fetch(api, {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((r) => setBalance(r.balance));
  });

  return (
    <div className="container">
      <div className="row gap-3 justify-content-center">
        <div
          className="col-12"
          style={{
            cssText:
              "text-align: center; background-color: #fffdf4; border-radius: 16px",
          }}
        >
          <img src="/assets/settings/guy.png" alt="guy sending" />
        </div>

        <div
          className="col-12 col-lg-8 py-2 d-flex align-items-center gap-2"
          style={{
            cssText:
              "border: 1px solid #fffdf4; color: var(--primary); font-weight: 700; font-size: large;",
          }}
        >
          <img src="/assets/settings/coins.png" alt="coins" />
          <span className="flex-grow-1">
            <CurrencySymbol />
          </span>
          {balance}
        </div>

        {/* <div className="col-12 col-lg-8" style={{ textAlign: "center" }}>
          <span
            className="d-block h5"
            style={{ cssText: "color: var(--primary); font-weight: 700" }}
          >
            {getText("settings", 28)}
          </span>
          <span
            className="d-block"
            style={{ cssText: "color: var(--midgray)" }}
          >
            {getText("settings", 29)}
          </span>

          <div className="gap-3 justify-content-around mt-5 row m-0">
            <a
              href="/public/mobile/"
              className="align-items-center col-12 col-lg d-flex flex-column gap-3 py-2 text-decoration-none"
              style={{
                cssText:
                  "color: var(--midgray); border: 1px solid #FFCD00; border-radius: 8px; max-width: 584px; background-color: #fbfbfb;",
              }}
            >
              <img src="/assets/settings/delivery.png" alt="delevery" />
              <span
                className="h5 m-0"
                style={{ cssText: "color: var(--primary);" }}
              >
                {getText("settings", 30)}
              </span>
              <progress value={3} max={5}></progress>
              {getText("settings", 31)}
            </a>

            <a
              href="/public/mobile/"
              className="align-items-center col-12 col-lg d-flex flex-column gap-3 py-2 text-decoration-none"
              style={{
                cssText:
                  "color: var(--midgray); border: 1px solid #FFCD00; border-radius: 8px; max-width: 584px; background-color: #fbfbfb;",
              }}
            >
              <img src="/assets/settings/wallet.png" alt="delevery" />
              <span
                className="h5 m-0"
                style={{ cssText: "color: var(--primary);" }}
              >
                {getText("settings", 32)}
              </span>
              <progress value={460} max={1000}></progress>
              {getText("settings", 33)} {1000 - 460} {getText("settings", 14)}
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
