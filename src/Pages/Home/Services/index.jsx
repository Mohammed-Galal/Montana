/* eslint-disable jsx-a11y/alt-text */
import getPage, { getActiveLang } from "../../../translation";
import { Link } from "react-router-dom";
import "./index.scss";
import { useSelector } from "react-redux";

const getText = getPage("home"),
  targetLang = getActiveLang() === "العربية";

/* eslint-disable import/no-anonymous-default-export */
export default ({ sectionName }) => {
  const store = useSelector((e) => e),
    { loaded, main, other } = store.Sliders;

  if (!loaded) return null;

  const nameArg = targetLang ? "name_ar" : "name";
  const descArg = targetLang ? "description_ar" : "description";

  return (
    <section
      key="services"
      id="services"
      className="container-fluid container-lg d-flex flex-column text-center container-fluid container-lg"
    >
      {sectionName && (
        <h2 className="d-flex align-items-center">{sectionName}</h2>
      )}

      <div className="align-items-stretch d-flex flex-wrap flex-md-nowrap gap-3">
        {!!main.name && (
          <div className="align-items-stretch d-grid">
            <div className="align-items-center d-flex flex-column h-100 justify-content-center">
              <h2 className="d-block h4">{main[nameArg]}</h2>

              <span dangerouslySetInnerHTML={{ __html: main[descArg] }}></span>

              <Link to="/design" className="text-decoration-none mt-3">
                {getText(9)}
              </Link>
            </div>

            <img src={main.image} alt="special order" />
          </div>
        )}

        {!!other.name && (
          <div className="align-items-stretch d-grid">
            <div className="align-items-center d-flex flex-column h-100 justify-content-center">
              <h2 className="d-block h4">{other[nameArg]}</h2>

              <span dangerouslySetInnerHTML={{ __html: other[descArg] }}></span>

              <Link to="/early-booking" className="text-decoration-none mt-3">
                {getText(10)}
              </Link>
            </div>

            <img src={other.image} alt="early order" />
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * {
        "name": "test",
        "name_ar": null,
        "description": null,
        "description_ar": null,
        "ex_data": null,
        "image": "https://admin.montana.sa/public/assets/img/slider/1726662935Lu07TBfKUO.jpg"
    }
 */
