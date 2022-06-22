import { getServerSideSitemap } from "next-sitemap";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const fields = [
    {
      loc: "https://jinsoltrade.com", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/product/16", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/product/17", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/product/18", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/menu", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/contacts", // Absolute url
      lastmod: new Date().toISOString(),
      // changefreq
      // priority
    },
    {
      loc: "https://jinsoltrade.com/policy/join_us",
      lastmod: new Date().toISOString(),
    },
  ];
  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default () => {};
