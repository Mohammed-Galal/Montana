/* eslint-disable import/no-anonymous-default-export */
import { useState } from "react";
import { useSelector } from "react-redux";
import staticCategories from "./Home/Departments/data.json";
import ProductItem from "../shared/productItem";
import { useParams, useSearchParams } from "react-router-dom";
import getPage from "../translation";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const miniCategories = staticCategories.map((i) => i.title),
  getText = getPage("allProducts"),
  emptyStr = "",
  liStyle = {
    color: "var(--midgray)",
    border: "1px solid currentColor",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f8f9fa",
    fontWeight: "500",
    letterSpacing: "0.8px",
    transition: "all 0.15s",
  },
  activeCatStyle = {
    ...liStyle,
    color: "var(--primary)",
    borderColor: "#ecf5ff",
  };

export default function () {
  const urlParams = useParams(),
    urlCat = urlParams.category || emptyStr,
    { data, categories, customCategoriesExp } = useSelector((e) => e.Products),
    [productName, setProductName] = useState(emptyStr),
    [category, setCategory] = useState(urlCat);

  const [params] = useSearchParams();
  const [loaded, setLoaded] = useState(false);

  const viewOccassions = params.has("occassions"),
    excludedCategories = data.filter((i) =>
      params.has("occassions")
        ? customCategoriesExp.test(i.category_name)
        : !customCategoriesExp.test(i.category_name)
    ),
    items = excludedCategories.map((item, index) => {
      const categoryMatched = item.category_name.includes(category),
        nameExp = new RegExp(productName, "i"),
        nameMatched = nameExp.test(item.name) || nameExp.test(item.name_ar);

      if (categoryMatched && nameMatched) return ProductItem(item, index);
      return false;
    });

  if (data.length && !loaded) {
    setTimeout(() => setLoaded(true), 1000);
  }

  const targetCategories = (
    params.has("miniCategories") ? miniCategories : categories
  ).filter((c) => !customCategoriesExp.test(c));

  return (
    <section
      id="products"
      className="container d-flex flex-column flex-lg-row-reverse gap-5"
    >
      {!viewOccassions && (
        <div style={{ width: "100%", height: "fit-content" }}>
          <input
            type="search"
            placeholder={getText(0)}
            onChange={({ target }) => setProductName(target.value)}
            className="input-group-text m-0 w-100"
            style={{ outline: "none", borderColor: "#ecf5ff" }}
          />

          <h5
            className="my-2 py-1"
            style={{
              color: "var(--primary)",
              borderBottom: "1px solid currentColor",
            }}
          >
            {getText(1)}
          </h5>

          <ul
            className="d-grid gap-3 text-center justify-content-center list-unstyled m-0 p-0"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            {Array.from(targetCategories).map((c) => (
              <li
                key={c}
                className="px-3 py-1"
                onClick={() => setCategory(category === c ? emptyStr : c)}
                style={c === category ? activeCatStyle : liStyle}
              >
                {c}
              </li>
            ))}
          </ul>

          {/* <h5
          className="my-2 py-1"
          style={{
            color: "var(--primary)",
            borderBottom: "1px solid currentColor",
          }}
        >
          {"تصاميم جاهزة لكل مناسبة"}
        </h5> */}
        </div>
      )}

      <div
        className="d-grid d-md-flex flex-wrap gap-4"
        style={{
          flex: "1 0 70%",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {params.has("occassions") && (
          <>
            <h3 style={{ width: "100%", color: "var(--primary)" }}>{urlCat}</h3>
            <span className="d-lg-none"></span>
          </>
        )}
        {loaded ? (
          items
        ) : (
          <>
            <Box sx={{ pt: 0.5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>

            <Box sx={{ pt: 0.5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>

            <Box sx={{ pt: 0.5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Skeleton width={210} />
              <Skeleton width="60%" />
            </Box>

            <Box sx={{ pt: 0.5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Skeleton width={210} />
              <Skeleton width="60%" />
            </Box>
          </>
        )}
      </div>
    </section>
  );
}
