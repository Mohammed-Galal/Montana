import { initLangs } from "./translation.js";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import "./bootstrap.js";
import "./Modal.jsx";
import App from "./Pages";

const root = document.querySelector("body > main"),
  aside = document.querySelector("aside#animation");

initLangs(() => {
  ReactDOM.createRoot(root).render(App);
  setTimeout(removeAnimation, 1000);
  // console.clear();
});

function removeAnimation() {
  if (aside) {
    aside.classList.remove("active");
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


