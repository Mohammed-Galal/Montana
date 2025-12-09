/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable jsx-a11y/alt-text */
import getPage from "../../translation";
import { useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector, useDispatch, useStore } from "react-redux";
import CurrencySymbol from "../../CurrencySymbol";
import NXT from "../../icons/NXT";
import Plus from "../../icons/Plus";
import Minus from "../../icons/Minus";
import Cart from "../../icons/Cart";
import "./index.scss";

const getText = getPage("design"),
  fallbackSrc = "/assets/home/img-placeholder.png";

export default function () {
  const products = useSelector((e) => e.Products),
    customProducts = products.custom,
    params = useParams();

  if (customProducts.length === 0) return null;

  const activeTab = params.style || customProducts[0]?.name,
    availOptions = customProducts.find(
      (i) => i.is_active && i.name === activeTab
    );

  return (
    <>
      <aside>
        <ul className="container d-flex gap-2 list-unstyled my-0">
          {customProducts.map((item) => (
            <li key={item.id} className="py-3">
              <NavLink to={`/design/${item.name}`}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <section id="design" className="container">
        <ul className="d-flex gap-2 justify-content-center list-unstyled mx-0 mb-5 p-0">
          <li>Montana</li>
          <li>{NXT}</li>
          <li>{getText(0)}</li>
          <li>{NXT}</li>
          <li>{availOptions.name}</li>
        </ul>

        <Form productItem={availOptions} />
      </section>
    </>
  );
}

function Form({ productItem }) {
  const form = useRef(),
    customProps = useRef({
      is_special: true,
      phrase: "",
      comment: "",
      images: [],
    }),
    activeOpts = useRef({}),
    resId = useStore().getState().Restaurant.data.id,
    dispatch = useDispatch(),
    [load, setLoad] = useState(false),
    [quantity, setQuantity] = useState(1);

  let totalPrice = +productItem.price;

  const selected_addons = [],
    opts = activeOpts.current,
    optGroup = productItem.addon_categories.map((addonCategory) => {
      const { id, name, type, addons } = addonCategory,
        isSingular = type === "SINGLE",
        container = (opts[name] ||= isSingular ? 0 : new Set());

      const innerOptions = addons.map((addon, index) => {
        const isActive = isSingular
          ? container === index
          : container.has(index);

        if (isActive) {
          totalPrice += +addon.price;
          selected_addons.push({
            addon_id: addon.id,
            addon_category_name: name,
            addon_name: addon.name,
            price: +addon.price,
          });
        }

        return (
          <button
            key={addon.id}
            className="btn"
            data-active={isActive}
            onClick={() => addOption(index)}
          >
            {addon.name}

            <span style={{ fontSize: "smaller", marginLeft: "20px" }}>
              /{addon.price} <CurrencySymbol />
            </span>

            {isActive ? Minus : Plus}
          </button>
        );
      });

      return (
        <li key={id}>
          <span className="title">{name}</span>
          {innerOptions}
        </li>
      );

      function addOption(indx) {
        if (isSingular) opts[name] = indx;
        else
          opts[name].has(indx) ? opts[name].delete(indx) : opts[name].add(indx);

        setLoad(!load);
      }
    });

  totalPrice = totalPrice * quantity;

  const formBody = {
    customProps: customProps.current,
    name: productItem.name,
    restaurant_id: resId,
    id: productItem.id,
    price: +productItem.price,
    totalPrice: totalPrice,
    quantity: quantity,
    addons: selected_addons,
  };

  return (
    <form
      className="d-flex flex-wrap gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <label
        className="align-items-center d-flex flex-column gap-4 justify-content-around"
        style={{
          flex: "1 0 30%",
          textDecoration: "underline",
          color: "var(--primary)",
        }}
      >
        <img
          id="img-preview"
          style={{ maxHeight: "300px" }}
          src={fallbackSrc}
          alt="PH"
        />
        <input
          className="d-none"
          name="images"
          onChange={changePlaceholder}
          multiple="multiple"
          type="file"
          accept="image/*"
        />
        {getText(2)}
      </label>

      <ul className="d-grid gap-3 list-unstyled">
        {optGroup}

        <li>
          <label htmlFor="phrase" className="title">
            {getText(3)}
          </label>
          <input
            type="text"
            name="phrase"
            onChange={(e) => (customProps.current.phrase = e.target.value)}
            className="input-group-text"
            placeholder="Happy Birthday Alaa!"
          />
        </li>

        <li>
          <label htmlFor="notes" className="title">
            {getText(4)}
          </label>

          <input
            type="text"
            name="comment"
            onChange={(e) => (customProps.current.comment = e.target.value)}
            className="input-group-text"
            placeholder={getText(5)}
          />
        </li>

        <li className="align-items-center d-flex">
          <button type="button" onClick={() => setQuantity(quantity + 1)}>
            {Plus}
          </button>
          {quantity}
          <button
            type="button"
            onClick={() => quantity - 1 && setQuantity(quantity - 1)}
          >
            {Minus}
          </button>
          <button
            type="button"
            className="d-flex gap-1 align-items-center"
            onClick={storeFormData}
          >
            {getText(6)}
            {Cart}
          </button>

          <span className="h5 m-0">
            {totalPrice} <CurrencySymbol />
          </span>
        </li>
      </ul>
    </form>
  );

  function changePlaceholder(ev) {
    const { target } = ev,
      img = document.getElementById("img-preview");

    customProps.current.images = Array.from(target.files);

    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.readAsDataURL(target.files[0]);
      // URL.createObjectURL(files[0]);
    }
  }

  function storeFormData() {
    formBody.formData = new FormData(form.current);
    dispatch({ type: "products/addToCart", payload: formBody, special: true });
  }
}
