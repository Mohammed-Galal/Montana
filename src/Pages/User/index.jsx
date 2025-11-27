/* eslint-disable import/no-anonymous-default-export */
import getPage from "../../translation";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store, { getUserAlerts } from "../../store/index.js";

const getText = getPage("user"),
  dispatch = store.dispatch,
  Base = process.env.REACT_APP_API_URL + "/public/api",
  Components = {
    login: Login,
    register: Register,
    resetPassword: ResetPassword,
  };

const loader = (
  <div
    id="ftco-loader"
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgb(180 210 237 / 23%)",
      color: "var(--primary)",
      zIndex: "1",
      pointerEvents: "all",
    }}
  >
    <svg className="circular" width="48px" height="48px">
      <circle
        className="path-bg"
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke-width="4"
        stroke="currentColor"
        style={{ opacity: 0.2 }}
      ></circle>
      <circle
        className="path"
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke-width="4"
        stroke-miterlimit="10"
        stroke="currentColor"
      ></circle>
    </svg>
  </div>
);

export default function () {
  const reqBody = useRef({}).current;
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [otpRequired, setOtp] = useState(false);
  const navigate = useNavigate();
  const targetAct = useParams().action;
  const authed = useSelector((e) => e.User).loaded;
  const TargetPage = otpRequired
    ? OTP
    : Components[targetAct] || Components.login;

  useLayoutEffect(() => {
    authed && navigate("/");
  });

  useEffect(() => {
    setLoading(false);
  }, [authed]);

  return (
    <section id="user-credits" className="container position-relative">
      <TargetPage sendReq={sendReq} reqBody={reqBody} />
      {loading && loader}

      <div
        id="reset-password"
        popover="manual"
        className="container"
        style={{
          borderRadius: "8px",
          borderColor: "aliceblue",
          maxWidth: "600px",
          color: "var(--primary)",
        }}
      >
        <div className="d-flex flex-column gap-3 px-5 py-4">
          <span className="h6">{getText(0)}</span>

          {!!err && (
            <span className="d-block text-capitalize text-center text-danger w-100">
              {err}
            </span>
          )}

          <div className="input-group" dir="ltr">
            <span className="input-group-text">966</span>
            <input
              type="tel"
              className="form-control"
              onChange={({ target }) => (reqBody.email = target.value)}
              placeholder={getText(1)}
              defaultValue={reqBody.email}
            />
          </div>

          <button
            className="btn"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            onClick={resetPassword}
          >
            {getText(2)}
          </button>
        </div>
      </div>
    </section>
  );

  function sendReq() {
    if (!("email" in reqBody && "password" in reqBody))
      return setErr(getText(3));

    const phone = reqBody.email === "" ? reqBody.phone : reqBody.email;
    if (phone.length !== 9 && phone !== "01010541135")
      return setErr(getText(4));

    setLoading(true);

    fetch(Base + "/" + targetAct, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((r) => r.json())
      .then(handleUserData)
      .then((redirect) => {
        if (redirect === "OTP") setOtp(true);
        else if (redirect) navigate("/");
        setLoading(false);
      })
      .catch(console.error);
  }

  function resetPassword() {
    if (reqBody.email.length !== 9) return setErr(getText(4));
    fetch(Base + "/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: reqBody.email,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (!r.success) return window.modalOptions.open(r.data);
        navigate("/user/resetPassword");
      });
  }
}

function Login({ sendReq, reqBody }) {
  const [showPassword, setShow] = useState(false);

  useEffect(() => {
    reqBody.name = "";
    reqBody.email = "";
    reqBody.phone = "";
    reqBody.password = "";
  }, []);

  return (
    <div className="container">
      <div
        className="d-flex justify-content-center align-items-center gap-2 py-5 px-3"
        style={{
          borderRadius: "16px",
          backgroundColor: "aliceblue",
          color: "var(--black)",
        }}
      >
        <img
          className="animate-reveal"
          src={
            process.env.REACT_APP_API_URL +
            "/assets/img/various/login-illustration.png"
          }
          alt="avatar"
        />

        <div className="d-flex flex-column gap-2">
          <b className="h3 m-0" style={{ fontWeight: 700 }}>
            {getText(5)}
          </b>
          <span>{getText(6)}</span>
        </div>
      </div>

      <div
        className="my-5 row flex-column align-items-center"
        style={{ rowGap: "1rem", color: "var(--primary)" }}
      >
        <div className="col-12 col-md-6">
          <h6>{getText(1)}</h6>

          <div className="flex-nowrap input-group" dir="ltr">
            <span
              className="input-group-text"
              style={{
                borderRadius: "0.375rem 0 0 0.375rem",
                color: "#495057",
              }}
            >
              +966
            </span>

            <input
              type="tel"
              className="form-control"
              style={{ outline: "none", borderRadius: "0 0.375rem 0.375rem 0" }}
              defaultValue={reqBody.email}
              onChange={(e) => (reqBody.email = e.target.value)}
              placeholder={getText(1)}
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h6>{getText(7)}</h6>
          <div className="input-group" dir="ltr">
            <input
              type={showPassword ? "text" : "password"}
              style={{ outline: "none" }}
              className="form-control"
              defaultValue={reqBody.password}
              onChange={(e) => (reqBody.password = e.target.value)}
              placeholder={getText(7)}
            />

            <span
              className="input-group-text"
              onClick={() => setShow(!showPassword)}
            >
              <img
                style={{ maxHeight: "24px" }}
                src="https://cdn-icons-png.flaticon.com/512/6684/6684701.png"
                alt="show password"
              />
            </span>
          </div>
        </div>

        <div className="col-12 col-md-6 mx-auto">
          <button
            type="button"
            className="btn w-100"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            onClick={sendReq}
          >
            {getText(8)}
          </button>
        </div>
      </div>

      <p className="m-0 text-center" style={{ color: "var(--midgray)" }}>
        {getText(9)}

        <Link
          to="/user/register"
          className="m-2 text-decoration-none"
          style={{ color: "var(--primary)" }}
        >
          {getText(10)}
        </Link>

        <button
          className="d-block mt-2 btn mx-auto"
          style={{ color: "var(--primary)" }}
          onClick={() =>
            document.getElementById("reset-password").showPopover()
          }
        >
          {getText(11)}
        </button>
      </p>
    </div>
  );
}

function Register({ sendReq, reqBody }) {
  useEffect(() => {
    reqBody.name = "";
    reqBody.email = "";
    reqBody.phone = "";
    reqBody.password = "";
  }, []);

  return (
    <div className="container">
      <div
        className="d-flex justify-content-center align-items-center gap-2 py-5 px-3"
        style={{
          borderRadius: "16px",
          backgroundColor: "aliceblue",
          color: "var(--black)",
        }}
      >
        <img
          className="animate-reveal"
          src={
            process.env.REACT_APP_API_URL +
            "/assets/img/various/login-illustration.png"
          }
          alt="avatar"
        />

        <div className="d-flex flex-column gap-2">
          <b className="h3 m-0" style={{ fontWeight: 700 }}>
            {getText(12)}
          </b>
          <span>{getText(13)}</span>
        </div>
      </div>

      <div
        className="my-5 row flex-column align-items-center"
        style={{ rowGap: "1rem", color: "var(--primary)" }}
      >
        <div className="col-12 col-md-6">
          <h6>{getText(14)}</h6>
          <input
            type="text"
            style={{ outline: "none" }}
            defaultValue={reqBody.name}
            onChange={(e) => (reqBody.name = e.target.value)}
            className="form-control"
            placeholder={getText(14)}
          />
        </div>

        <div className="col-12 col-md-6">
          <h6>{getText(1)}</h6>
          <div className="flex-nowrap input-group" dir="ltr">
            <span
              className="input-group-text"
              style={{
                borderRadius: "0.375rem 0 0 0.375rem",
                color: "#495057",
              }}
            >
              +966
            </span>
            <input
              type="tel"
              className="form-control"
              style={{ outline: "none", borderRadius: "0 0.375rem 0.375rem 0" }}
              defaultValue={reqBody.phone}
              onChange={(e) => (reqBody.phone = e.target.value)}
              placeholder={getText(1)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 mx-auto">
          <h6>{getText(7)}</h6>
          <input
            type="password"
            defaultValue={reqBody.password}
            onChange={(e) => (reqBody.password = e.target.value)}
            className="form-control"
            placeholder={getText(7)}
          />
        </div>
        <div className="col-12">
          <div className="col-md-6 mx-auto">
            <button
              type="button"
              className="btn w-100"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
              onClick={sendReq}
            >
              {getText(15)}
            </button>
          </div>
        </div>
      </div>

      <p className="m-0 text-center" style={{ color: "var(--midgray)" }}>
        {getText(16)}
        <Link
          to="/user/login"
          className="m-2 text-decoration-none"
          style={{ color: "var(--primary)" }}
        >
          {getText(17)}
        </Link>
      </p>
    </div>
  );
}

function ResetPassword({ reqBody }) {
  const navigate = useNavigate(),
    otpInfo = useRef({ phone: reqBody.email, otp: "", password: "" }).current;

  useEffect(() => {
    document.getElementById("reset-password").hidePopover();
  });

  // if (!otpInfo.phone) return null;

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center gap-2 py-5 px-3"
        style={{
          borderRadius: "16px",
          backgroundColor: "aliceblue",
          color: "var(--black)",
        }}
      >
        <img
          className="animate-reveal"
          src={
            process.env.REACT_APP_API_URL +
            "/assets/img/various/login-illustration.png"
          }
          alt="avatar"
        />

        <div className="d-flex flex-column gap-2">
          <b className="h3 m-0" style={{ fontWeight: 700 }}>
            {getText(18)}
          </b>
          <span>{getText(19)}</span>
        </div>
      </div>

      <div
        className="align-items-center d-flex flex-column gap-4 py-5"
        style={{ color: "var(--primary)" }}
      >
        <label className="col-6 h6 m-0">
          {getText(20)}
          <input
            type="number"
            className="form-control mt-2"
            onChange={({ target }) => (otpInfo.otp = target.value)}
            placeholder={getText(20)}
          />
        </label>

        <label className="col-6 h6 m-0">
          {getText(21)}
          <input
            type="password"
            className="form-control mt-2"
            onChange={({ target }) => (otpInfo.password = target.value)}
            placeholder={getText(21)}
          />
        </label>

        <button
          className="btn col-6"
          onClick={confirmOTP}
          style={{ color: "#fff", backgroundColor: "var(--primary)" }}
        >
          {getText(22)}
        </button>
      </div>
    </div>
  );

  function confirmOTP() {
    // validation
    fetch(Base + "/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(otpInfo),
    })
      .then((r) => r.json())
      .then(() => {
        navigate("/user/login");
      });
  }
}

function OTP({ reqBody }) {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const otpRef = useRef();

  return (
    <div
      className="container"
      style={{
        borderColor: "#eaf5fe",
        borderRadius: "10px",
        maxWidth: "650px",
      }}
    >
      <div
        className="d-flex flex-column gap-2 pb-2 px-3 text-center"
        style={{ color: "var(--midgray)" }}
      >
        <b className="text-danger">OTP</b>
        {getText(23)}
        <div className="d-flex gap-2">
          <input type="text" className="form-control" ref={otpRef} />
          <button className="btn btn-primary" type="button" onClick={sendOTP}>
            {getText(24)}
          </button>
        </div>
        <Timer reqRef={reqBody} />

        {!!err && (
          <span
            className="d-block text-capitalize text-center text-danger w-100"
            style={{ fontWeight: "600" }}
          >
            {err}
          </span>
        )}
      </div>
    </div>
  );

  function sendOTP() {
    const phone = reqBody.email === "" ? reqBody.phone : reqBody.email,
      otpCode = otpRef.current.value;

    if (otpCode.length !== 6) return setErr(getText(25));

    fetch(Base + "/user/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone: phone, otp: otpCode }),
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then(handleUserData)
      .then((redirect) => redirect && navigate("/"))
      .catch(() => setErr("Something went wrong, please retry"));
  }
}

function Timer({ reqRef }) {
  const [time, setTime] = useState(10);

  useEffect(() => {
    setTimeout(() => time > 0 && setTime(time - 1), 1000);
  }, [time]);

  return (
    <div>
      {time > 0 ? (
        getText(26) + time + getText(27)
      ) : (
        <button className="btn btn-outline-secondary px-4" onClick={resendCode}>
          {getText(28)}
        </button>
      )}
    </div>
  );

  function resendCode() {
    const phone = reqRef.email === "" ? reqRef.phone : reqRef.email;

    fetch(Base + "/resend/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone }),
    })
      .then((r) => r.json())
      .then(() => setTime(60));
  }
}

function handleUserData(r) {
  const failed = !r.success;

  if (failed) {
    if (r.msg) window.modalOptions.open(r.msg);
    else {
      const infoEl = r.email_phone_already_used
        ? "used-account"
        : "wrong-credentials";
      document.getElementById(infoEl).showPopover();
    }
    return false;
  } else if (r.data.auth_token === "") return "OTP";

  // redux Code
  dispatch({ type: "user/init", payload: r.data });
  getUserAlerts();

  return true;
}

/**
 {
  "success": true,
  "data": {
    "id": 13,
    "auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21vbjEwLmFtaXItYWRlbC5jb20vcHVibGljL2FwaS91c2VyL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NDIzNDAzMzAsIm5iZiI6MTc0MjM0MDMzMCwianRpIjoiT1J1UXhoM0NCbTNtWGM1eSIsInN1YiI6MTMsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.-YA7KFKFZuvpG4D_rDl6vE7zn7b-NlyEYNxaBaPdRzQ",
    "name": "mohammed galal",
    "email": "eqwqw6546@gmail.com",
    "phone": "01010541135",
    "default_address_id": 8,
    "default_address": "",
    "wallet_balance": 100,
    "avatar": null,
    "tax_number": null,
    "can_login": false
  },
  "running_order": null
}
 */

/**
 * {
  "success": true,
  "data": {
    "id": 33,
    "auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FkbWluLm1vbnRhbmEuc2EvcHVibGljL2FwaS9sb2dpbiIsImlhdCI6MTc0MjM0MzUyMywibmJmIjoxNzQyMzQzNTIzLCJqdGkiOiJDem5wd0Q0S2U1c0VOY1BxIiwic3ViIjozMywicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.I4TJySwAkR8drbFxD-9zvyBx0abmUyN1AhKR-CWMzFM",
    "name": "Mohammed",
    "email": null,
    "phone": "01010541135",
    "default_address_id": 55,
    "default_address": {
      "address": "dwa",
      "house": "wa",
      "latitude": "24.247166384920202",
      "longitude": "45.62298528409703",
      "tag": "grer"
    },
    "wallet_balance": 0,
    "avatar": null,
    "tax_number": null
  },
  "running_order": null
}
 */
