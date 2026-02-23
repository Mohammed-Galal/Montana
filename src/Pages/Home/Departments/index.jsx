import { Link } from "react-router-dom";
import "./index.scss";
import { getActiveLang } from "../../../translation";

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */

export default ({ sectionName, data }) => {
  if (data.length === 0) return null;

  return (
    <section id="moon-sections">
      <div className="container-fluid container-lg d-flex flex-column align-items-center">
        {sectionName && (
          <h2
            className="d-flex align-items-center justify-content-between"
            style={{
              width: "100%",
              color: "var(--primary)",
              marginBottom: "var(--internal-gap)",
            }}
          >
            {sectionName}
          </h2>
        )}

        <div className="d-flex flex-wrap gap-3 justify-content-around">
          {data.slice(0, 4).map(sectionItem)}

          <Link
            className="align-items-center d-none d-md-flex flex-column gap-2 p-4"
            to={"/all-products/" + data[4].name + "?miniCategories=1"}
          >
            <img
              className="my-auto"
              src={data[4].image_url}
              alt={data[4].name}
            />
            <h3 className="m-0 h5">{data[4].name}</h3>
          </Link>
        </div>

        <ExtraItem url={"/all-products/"} />
      </div>
    </section>
  );
};

 function sectionItem(item) {
   const { image_url, name, id } = item;
   return (
     <Link
       key={id}
       className="align-items-center d-flex flex-column gap-2 p-4"
       to={"/all-products/" + name + "?miniCategories=1"}
     >
       <img className="my-auto" src={image_url} alt={name} />
       <h3 className="m-0 h5">{name}</h3>
     </Link>
   );
 }

 export function ExtraItem({ url }) {
   const moreTxt = getActiveLang() === "العربية" ? "المزيد" : "More";
   return (
     <Link
       className="align-items-center d-flex d-md-none gap-1 mt-4 mx-auto"
       to={url}
       style={{
         border: "none",
         color: "var(--primary)",
         textDecoration: "none",
         fontWeight: "600",
       }}
     >
       {moreTxt}

       <svg style={{ maxWidth: "16px", maxHeight: "16px" }}>
         <use
           xlinkHref="/assets/home/icons/left-arrow.svg"
           href="/assets/home/icons/left-arrow.svg"
           width="12"
           height="14"
         ></use>
       </svg>
     </Link>
   );
 }
