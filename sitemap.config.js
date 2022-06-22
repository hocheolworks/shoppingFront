module.exports = {
  siteUrl: "https://jinsoltrade.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://jinsoltrade.com/server-sitemap.xml", // <==== Add here
    ],
  },
};
