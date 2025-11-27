/* eslint-disable import/no-anonymous-default-export */
import getPage from "../../../../translation";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const getText = getPage("settings"),
  phaseComponent = [ChangeNonOTPData, ChangePhoneNumber],
  liStyle = {
    borderRadius: "inherit",
    transition: "0.3s",
  };

export default function () {
  const User = useSelector((e) => e.User).data,
    [targetAction, setTargetAction] = useState(0),
    TargetComponent = phaseComponent[targetAction];

  return (
    <div className="d-flex flex-column">
      <ul
        className="d-inline-flex gap-3 list-unstyled mb-5 px-2 py-2"
        style={{
          background: "aliceblue",
          borderRadius: "30px",
          color: "var(--primary)",
          alignSelf: "center",
        }}
      >
        <li
          onClick={() => setTargetAction(0)}
          className="py-1 px-3"
          style={{
            ...liStyle,
            backgroundColor: "#fff" + (!targetAction ? "f" : "0"),
          }}
        >
          {getText(34)}
        </li>
        <li
          onClick={() => setTargetAction(1)}
          className="py-1 px-3"
          style={{
            ...liStyle,
            backgroundColor: "#fff" + (!!targetAction ? "f" : "0"),
          }}
        >
          {getText(35)}
        </li>
      </ul>

      <TargetComponent userData={User} />
    </div>
  );
}

function ChangeNonOTPData({ userData }) {
  const [changePassword, setChangePassword] = useState(false),
    [err, setErr] = useState(""),
    reqBody = useRef({
      name: "",
      phone: "",
      // email: "",
      new_password: "",
      old_password: "",
    }).current;

  reqBody.name = userData.name;

  return (
    <div
      className="d-flex flex-column gap-3 mx-auto w-100"
      style={{
        maxWidth: "600px",
        color: "var(--primary)",
        accentColor: "var(--primary)",
      }}
    >
      <label>
        {getText(36)}
        <input
          type="text"
          className="form-control mt-3"
          placeholder={userData.name}
          defaultValue={reqBody.name}
          autoComplete={false}
          onChange={({ target }) => (reqBody.name = target.value)}
        />
      </label>

      <label>
        <input
          type="checkbox"
          autoComplete={false}
          onChange={({ target }) => setChangePassword(target.checked)}
        />{" "}
        {getText(37)}
      </label>

      {changePassword && (
        <label>
          {getText(38)}
          <input
            type="password"
            className="form-control mt-2"
            autoComplete={false}
            defaultValue={reqBody.new_password}
            onChange={({ target }) => (reqBody.new_password = target.value)}
          />
        </label>
      )}

      <label>
        {getText(40)}
        <input
          type="password"
          autoComplete={false}
          className="form-control mt-2"
          onChange={({ target }) => (reqBody.old_password = target.value)}
        />
      </label>

      <span className="text-danger text-center">{err}</span>

      <div className="d-flex flex-column gap-3 mt-4">
        <button
          type="button"
          className="btn"
          onClick={updateUserData}
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            width: "100%",
            borderRadius: "0.375rem",
          }}
        >
          {getText(39)}
        </button>

        <button
          type="button"
          className="btn btn-outline-danger w-100"
          onClick={() =>
            window.modalOptions.open(
              "هل ترغب حقاً في حذف الحساب ؟",
              console.log
            )
          }
        >
          {"حذف الحساب"}
        </button>
      </div>
    </div>
  );

  function updateUserData() {
    fetch(process.env.REACT_APP_API_URL + "/public/api/update-user-data", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        Authorization: "Bearer " + userData.auth_token,
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        r.success
          ? window.location.reload()
          : setErr(JSON.stringify(r.messages));
      })
      .catch(() => setErr(getText(43)));
  }
}

function ChangePhoneNumber({ userData }) {
  const [newPhone, setNewPhone] = useState(""),
    [otpErr, setOtpErr] = useState(""),
    [err, setErr] = useState(""),
    phone = userData.phone;

  let OTP = null;

  return (
    <div
      className="d-flex flex-column gap-4 mx-auto w-100"
      style={{ maxWidth: "600px" }}
    >
      <div className="input-group" dir="ltr">
        <span className="input-group-text">966</span>
        <input
          type="tel"
          className="form-control"
          placeholder={phone}
          maxLength={9}
          onChange={({ target }) => setNewPhone(target.value)}
        />
      </div>

      <span className="text-danger">{err}</span>

      <button
        className="btn mx-auto w-100"
        disabled={newPhone.length === 0}
        onClick={openPhoneOTP}
        style={{
          background: "var(--primary)",
          color: "#fff",
          borderRadius: "30px",
        }}
      >
        {getText(44)}
      </button>

      <div
        id="phone-otp"
        popover="manual"
        className="w-100"
        style={{
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid aliceblue",
          maxWidth: "600px",
          color: "var(--primary)",
        }}
      >
        <div className="align-items-center d-flex flex-column gap-3 px-4 py-3">
          <label>{getText(45)}</label>

          <input
            type="number"
            className="form-control"
            placeholder={getText(45)}
            onChange={({ target }) => (OTP = target.value)}
          />

          <span className="text-danger">{otpErr || err}</span>

          <button
            type="button"
            className="btn px-5"
            style={{
              background: "var(--primary)",
              color: "#fff",
              borderRadius: "30px",
            }}
            onClick={confirmOTP}
          >
            {getText(46)}
          </button>
        </div>
      </div>
    </div>
  );

  function openPhoneOTP() {
    if (newPhone.length !== 9) return setErr(getText(47));
    const phoneOTP = document.getElementById("phone-otp");

    fetch(process.env.REACT_APP_API_URL + "/public/api/change-mobile-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
      headers: {
        "Content-type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((r) => {
        // debugger;
        r.success ? phoneOTP.showPopover() : setErr(getText(41));
      });
  }

  function confirmOTP() {
    fetch(process.env.REACT_APP_API_URL + "/public/api/change-mobile", {
      method: "POST",
      body: JSON.stringify({ phone: newPhone, otp: OTP }),
      headers: {
        "Content-type": "application/json",
        Authorization: window.localStorage.getItem("token"),
      },
    })
      .then((r) => r.json())
      .then((r) => {
        r.success ? window.location.reload() : setOtpErr(r.msg);
      });
  }
}


