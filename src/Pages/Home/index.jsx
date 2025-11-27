import getPage from "../../translation";
import Banner from "./Banner";
import Products from "./Products";
import Departments from "./Departments";
import Occassions from "./Occasions";
import About from "./About";
// import Rate from "./Rate";
import Services from "./Services";

import "./index.scss";
import "swiper/css/bundle";
// import { useState } from "react";
import { useSelector } from "react-redux";

/* eslint-disable import/no-anonymous-default-export */
const getText = getPage("home"),
  excluded = [3, 4, 5, 6, 7],
  categories = {
    loaded: false,
    Occassions: new Set(),
    Departments: new Set(),
  };

export default function () {
  const miniCategories = useSelector((e) => e.Products).miniCategories;

  miniCategories
    .filter((c) => c.id !== 13 && c.id !== 8)
    .forEach((c) => {
      const targetCat = excluded.includes(c.id) ? "Departments" : "Occassions";
      categories[targetCat].add(c);
    });

  return (
    <>
      <Banner />
      <Products id="new-items" title={getText(11)} categoryKey="is_new" />
      <Products
        id="popular-items"
        title={getText(12)}
        categoryKey="is_popular"
      />
      <Departments
        data={Array.from(categories.Departments)}
        sectionName={getText(13)}
      />
      <Occassions
        data={Array.from(categories.Occassions)}
        sectionName={getText(14)}
      />
      <Services sectionName={getText(15)} />
      {/* <Rate /> */}
      <About />
    </>
  );
}
