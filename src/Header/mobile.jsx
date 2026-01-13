import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import getPage, { keys, getActiveLang } from "../translation";
import Globe from "../icons/Globe";

const getText = getPage("header");

export default function MobileHeader() {
  const alerts = useSelector((e) => e.User).alerts.filter((e) => !e.is_read);

  return (
    <div className="container align-items-center d-flex gap-2 py-2">
      <SideMenu />

      <Link to="/" className="mx-auto flex-grow-1 text-center">
        <img
          src="/assets/home/logo.svg"
          alt="logo"
          style={{ height: "62px" }}
        />
      </Link>

      <Link to="/alerts" className="btn text-decoration-none position-relative">
        <img src="/assets/home/icons/Bell Bing.svg" alt="notifications" />
        <span
          className="badge position-absolute"
          style={{
            background: "#ffcd00",
            clipPath: "circle()",
            right: "0",
            top: "0",
          }}
        >
          {alerts.length}
        </span>
      </Link>
    </div>
  );
}

function SideMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button className="btn" onClick={() => setOpen(!isOpen)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/9663/9663120.png"
          alt="side menu"
          style={{ maxHeight: "28px" }}
        />
      </button>

      <dialog
        id="side-menu"
        open={isOpen}
        className="container p-0"
        style={{
          zIndex: "10",
          border: "0",
          position: "fixed",
          transition: "0.3s",
          bottom: isOpen ? "0" : "-100%",
        }}
      >
        <div
          onClick={() => setOpen(false)}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            left: "0",
            top: "0",
            backgroundColor: "#0002",
          }}
        ></div>

        <div
          className="container d-flex flex-column py-3 row-gap-3"
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            borderRadius: "16px 16px 0px 0px",
            zIndex: "2",
            position: "relative",
          }}
        >
          <ul className="d-flex flex-column gap-2 list-unstyled m-0 p-0">
            <li className="d-flex">
              <NavLink className="px-3 py-2" to="/settings">
                {getText(5)}
              </NavLink>
            </li>
            <li className="d-flex">
              <NavLink className="px-3 py-2" to="/restaurant">
                {getText(1)}
              </NavLink>
            </li>
            <li className="d-flex">
              <NavLink className="px-3 py-2" to="/jobs">
                {getText(2)}
              </NavLink>
            </li>
            <li className="d-flex">
              <NavLink className="px-3 py-2" to="/all-products">
                {getText(6)}
              </NavLink>
            </li>
          </ul>

          <div
            className="d-flex p-1 gap-1 text-center lang-list"
            style={{
              backgroundColor: "aliceblue",
              borderRadius: "6px",
              color: "var(--primary)",
            }}
          >
            {keys.map((k) => {
              return (
                <label className="col py-2" data-active={getActiveLang() === k}>
                  <input
                    type="radio"
                    hidden
                    defaultChecked={getActiveLang() === k}
                    onChange={() => changeLang(k)}
                  />
                  {k}
                </label>
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
}

function changeLang(lang) {
  window.localStorage.setItem("lang", lang);
  window.location.reload();
}

{
  /* 
    
    
  
  <button
            type="button"
            className="DD align-items-center btn d-flex gap-2 mb-3"
            style={{ marginRight: "auto", color: "var(--primary)" }}
          >
          {getActiveLang()}
          {Globe}
          
          <ul
          className="d-flex flex-column list-unstyled m-0 p-0 py-2"
          style={{
                color: "var(--primary)",
                minWidth: "70px",
                width: "100%",
              }}
              >
              {keys.map((k) => (
                <li
                  key={k}
                  className="p-2 text-center"
                  onClick={() => changeLang(k)}
                >
                  {k}
                </li>
              ))}
            </ul>
          </button>
                  */
}
