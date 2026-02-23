import getPage from "../../../translation";
import { Link } from "react-router-dom";
import Carousel from "../../../shared/Carousel";
import "./index.scss";
import { ExtraItem } from "../Departments";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */

const getText = getPage("home"),
  availableIds = [10, 11, 12, 17];

export default ({ data }) => {
  if (data.length === 0) return null;
  const items = data.map(oItem);
  return (
    <section
      key="occasions"
      id="occasions"
      className="container-fluid container-lg d-flex flex-column"
    >
      <h2 className="d-flex align-items-center">{getText(7)}</h2>

      <Carousel
        innerItems={items}
        customConfig={{
          className: "d-none d-md-flex",
          loop: true,
          scrollbar: false,
        }}
      />

      <MobileCarousel items={data.filter((i) => availableIds.includes(i.id))} />
    </section>
  );
};

function MobileCarousel({ items }) {
  return (
    <>
      <ul
        className="list-unstyled m-0 p-0 d-grid d-md-none flex-wrap gap-3 justify-content-between"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {items.map((li) => (
          <li key={li.image_url}>{oItem(li)}</li>
        ))}
      </ul>
      <ExtraItem url="/all-products/?occassions=1" />
    </>
  );
}

function oItem({ name, image_url }) {
  return (
    <Link
      key={name}
      to={"/all-products/" + name + "?occassions=1"}
      className="d-flex flex-column gap-2 text-center text-decoration-none"
      style={{ color: "var(--primary)" }}
    >
      <div
        style={{
          border: "1px solid #ffcd00",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <img
          src={image_url}
          alt={name}
          // style={{ width: "100%", height: "150px", objectFit: "fill" }}
        />
      </div>

      {name}
    </Link>
  );
}
