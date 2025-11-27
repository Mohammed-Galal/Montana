import getPage, { observeLang } from "./translation";

const getText_checkout = getPage("checkout");
const getText_user = getPage("user");

const modal = document.createElement("div"),
  container = document.createElement("div"),
  msg = document.createElement("span"),
  dismisser = document.createElement("div"),
  btnsGroup = document.createElement("div"),
  confirmBtn = document.createElement("button"),
  closeBtn = document.createElement("button");

document.body.append(modal);
modal.id = "modal";
modal.className = "d-none";
Object.assign(modal.style, {
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  inset: "0",
  zIndex: 10,
});

btnsGroup.append(confirmBtn, closeBtn);
container.append(msg, btnsGroup);
modal.append(dismisser, container);
dismisser.style = "position: absolute; inset: 0; background: #0002";

const modalMethods = (window.modalOptions = {});

modalMethods.open = function (txt, confirmCallback) {
  msg.innerText = txt;
  modal.classList.remove("d-none");

  modalMethods.callback = confirmCallback || null;
  if (confirmCallback) {
    confirmBtn.classList.remove("d-none");
    confirmBtn.onclick = function () {
      modalMethods.close(true);
    };
  }
};

modalMethods.close = function (res) {
  msg.innerText = "";
  modal.classList.add("d-none");
  confirmBtn.classList.add("d-none");
  if (modalMethods.callback) modalMethods.callback(res);
};

dismisser.onclick = closeBtn.onclick = () => modalMethods.close(false);

btnsGroup.className = "d-flex gap-3 justify-content-center w-100";
confirmBtn.className = "btn btn-primary flex-grow-1 px-5 d-none";
closeBtn.className = "btn btn-outline-danger flex-grow-1 px-5";
observeLang(() => {
  confirmBtn.textContent = getText_user(2);
  closeBtn.textContent = getText_checkout(17);
});

container.className =
  "align-items-center d-flex flex-column gap-3 justify-content-center px-5 py-3";
Object.assign(container.style, {
  maxWidth: "740px",
  background: "rgb(255, 255, 255)",
  border: "1px solid aliceblue",
  borderRadius: "6px",
  zIndex: "1",
});

// modalMethods.open("hello world!!");
