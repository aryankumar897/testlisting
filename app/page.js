"use client";
import Image from "next/image";
import styles from "./page.module.css";

import Home from "@/components/home/Home";
import Counter from "@/components/counter/Counter";
import Featured from "@/components/featured/Featured";
import Category from "@/components/category/Category";
import FeaturedListing from "@/components/featuredlisting/Featured";
import Pricing from "@/components/pricing/Pricing";

import Test from "@/components/testimonials/Test";
import Blog from "@/components/blog/Blog";

import  CategoryCarousel from "@/components/categorycarousel/CategoryCarousel"

export default function Homes() {
  return (
    <main>
      <Home />
      <CategoryCarousel/>
      <Featured />
      <Counter />

      <Category />

      <FeaturedListing />
      <Pricing />
      <Test />
      <Blog />
    </main>
  );
}
