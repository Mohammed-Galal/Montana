import { useState } from "react";
import { Link } from "react-router-dom";

import MobileDetect from "mobile-detect";

const isMobile = new MobileDetect(window.navigator.userAgent).phone();

export default function () {
  const [active, setActive] = useState(false);

  if (!!isMobile) return null;

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="btn w-100"
        style={{
          color: "var(--primary)",
          background: "var(--sec)",
          borderRadius: "0",
          fontWeight: "600",
        }}
      >
        حمل التطبيق الان على جوجل بلاى واب ستور
      </button>

      {active && (
        <>
          <div
            onClick={() => setActive(false)}
            className="position-fixed"
            style={{ inset: "0", background: "#0002", zIndex: "10" }}
          ></div>
          <Popup />
        </>
      )}
    </>
  );
}

function Popup() {
  return (
    <div
      className="container d-flex flex-column p-3"
      style={{
        position: "fixed",
        top: "4vh",
        margin: "auto",
        zIndex: "10",
        left: "0px",
        background: "rgb(255, 255, 255)",
        borderRadius: "4px",
        border: "2px solid aliceblue",
        right: "0px",
        maxWidth: "436px",
        bottom: "4vh",
        height: "max-content",
        maxHeight: "460px",
      }}
    >
      <p
        className="m-0 text-center"
        style={{ color: "var(--primary)", fontWeight: "600" }}
      >
        حمل التطبيق الان على جوجل بلاى واب ستور
      </p>

      <hr />

      <ul className="align-items-center d-flex flex-column gap-2 list-unstyled m-0 p-0">
        <li>
          <Link
            target="_blank"
            to="https://play.google.com/store/apps/details?id=montana.sa"
            className="mb-2"
          >
            <img
              style={{
                width: "142px",
                maxHeight: "47.56px",
                objectFit: "cover",
              }}
              src="https://www.svgrepo.com/show/303139/google-play-badge-logo.svg"
              alt="google Play"
            />
          </Link>
        </li>

        <li>
          <Link
            target="_blank"
            to="https://apps.apple.com/us/app/%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA-%D9%85%D9%88%D9%86%D8%AA%D8%A7%D9%86%D8%A7/id6755387336"
          >
            <img
              style={{ width: "142px" }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/1024px-Download_on_the_App_Store_RGB_blk.svg.png"
              alt="appstore"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
}
