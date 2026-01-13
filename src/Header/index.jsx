/* eslint-disable import/no-anonymous-default-export */
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { mobileScreen } from "../shared/isMobile";
import Loc from "../icons/Loc";
import Arrow_Down from "../icons/Arrow_Down";

import desktop from "./desktop";
import mobile from "./mobile";
import "./index.scss";
import { useEffect, useState } from "react";

const baseUrl = process.env.REACT_APP_API_URL + "/public/api/",
  fetchOpts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

export default function (isMobileDevice) {
  return (
    <>
      <CurrLoc />
      <HeaderContainer />
    </>
  );
}

function HeaderContainer() {
  const [isMobileDevice, setView] = useState(mobileScreen.matches);

  useEffect(function () {
    mobileScreen.onchange = () => setView(mobileScreen.matches);
  });

  const Target = isMobileDevice ? mobile : desktop;

  return <Target />;
}

function CurrLoc() {
  const { Restaurant, User } = useSelector((e) => e),
    { data: currStore, branches } = Restaurant;

  const redirect = useNavigate(),
    dispatch = useDispatch();

  const currentActiveAddress = User.addresses[User.activeAddressIndex];

  return (
    <div style={{ backgroundColor: "#ecf5ff" }}>
      <ul
        id="branches"
        className="align-items-center container d-flex gap-3 list-unstyled my-0 px-3 py-2"
        style={{
          color: "var(--primary)",
        }}
      >
        {!!currentActiveAddress && (
          <li className="align-items-center d-flex gap-2 DD">
            {Loc}

            <span className="d-block">
              {currentActiveAddress.tag} - {currentActiveAddress.address}
            </span>

            <ul
              className="d-flex flex-column list-unstyled m-0 p-0"
              style={{ left: "unset", right: "0" }}
            >
              {User.addresses.map((address, i) => (
                <li
                  key={i}
                  onClick={() =>
                    dispatch({ type: "user/setActiveAddress", payload: i })
                  }
                  className="px-3 py-2"
                >
                  {address.tag} - {address.address}
                </li>
              ))}
            </ul>
          </li>
        )}

        <li
          className="DD align-items-center d-flex gap-2"
          style={{ marginInlineStart: "auto" }}
        >
          {currStore.name}
          {Arrow_Down}

          <ul className="d-flex flex-column list-unstyled m-0 px-0 py-2 branches-list">
            {branches.map(branchItem)}
          </ul>
        </li>
      </ul>
    </div>
  );

  function branchItem({ name, slug }) {
    return (
      <li
        key={slug}
        onClick={() => confirmLocation(slug)}
        className="px-3 py-2"
      >
        {name}
      </li>
    );
  }

  function confirmLocation(slug) {
    const resInfo = fetch(baseUrl + "get-restaurant-info/" + slug, fetchOpts);

    resInfo
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "restaurant/init", payload: data });
        // get the restaurant menu
        fetchMenu(slug);
      });
  }

  function fetchMenu(slug) {
    fetch(baseUrl + "get-restaurant-items/" + slug, fetchOpts)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "products/init", payload: data });
        // Redirect to the restaurant page
        redirect("/");
      });
  }
}
