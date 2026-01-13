/* eslint-disable import/no-anonymous-default-export */
import getPage from "../translation";
import { keys } from "../translation";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store";
import { useEffect, useRef } from "react";

const getText = getPage("header");

export default function () {
  const counter = useRef(),
    redirect = useNavigate(),
    { alerts: Alerts, loaded } = useSelector((e) => e.User),
    alerts = Alerts.filter((e) => !e.is_read),
    Products = useSelector((e) => e.Products);

  let itemsQuantity = 0;

  Products.cart.forEach((p) => (itemsQuantity += p.quantity));

  useEffect(
    function () {
      counter.current.classList.add("animate");
    },
    [itemsQuantity]
  );

  return (
    <div className="align-items-center container d-grid py-2">
      <ul className="align-items-center d-flex list-unstyled m-0 p-0">
        <li>
          <Link to="/jobs">{getText(2)}</Link>
        </li>
        <li>
          <Link to="/restaurant">{getText(1)}</Link>
        </li>
        <li>
          <Link
            to="/all-products"
            className="btn mx-3 px-3 py-2"
            style={{
              background: "var(--sec)",
              color: "var(--primary)",
              borderRadius: "100px",
              fontWeight: "700",
            }}
          >
            {getText(0)}
          </Link>
        </li>
      </ul>

      <Link to="/" className="mx-auto">
        <img
          src="/assets/home/logo.svg"
          alt="logo"
          style={{ height: "62px" }}
        />
      </Link>

      <ul className="align-items-center d-flex list-unstyled m-0 p-0">
        <li>
          <Link to="/alerts">
            <img src="/assets/home/icons/Bell Bing.svg" alt="alerts" />
            <span className="badge">{alerts.length}</span>
          </Link>
        </li>

        <li className="DD" onClick={() => redirect("/settings/addresses")}>
          <img
            src="/assets/home/icons/fluent_person-16-regular.svg"
            alt="account"
          />

          {loaded && (
            <ul className="d-flex flex-column list-unstyled m-0 p-0">
              <li className="p-2">
                <Link to="/settings/addresses">{getText(3)}</Link>
              </li>

              <li className="p-2 text-danger" onClick={logout}>
                {getText(4)}
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link to="/cart" className="position-relative">
            <img src="/assets/home/icons/header cart.svg" alt="cart" />
            <span
              className="badge"
              ref={counter}
              onAnimationEnd={(e) => e.target.classList.remove("animate")}
            >
              {itemsQuantity}
            </span>
          </Link>
        </li>
        <li className="DD" style={{ color: "var(--primary)" }}>
          <img
            src="/assets/global.png"
            alt="translate"
            style={{ maxWidth: "24px", filter: "contrast(0.7)" }}
          />

          <ul
            className="d-flex flex-column list-unstyled m-0 px-0 py-2"
            style={{ textAlign: "center", minWidth: "70px" }}
          >
            {keys.map((k) => {
              return (
                <li className="py-2 px-3" key={k} onClick={() => changeLang(k)}>
                  {k}
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  );
}

function changeLang(targetLang) {
  window.localStorage.setItem("lang", targetLang);
  window.location.reload();
}
