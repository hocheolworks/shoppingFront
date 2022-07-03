module.exports = {
  siteUrl: "https://jinsoltrade.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/account"], // <= exclude here
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/account/"],
      },
    ],
    additionalSitemaps: [
      "https://jinsoltrade.com/server-sitemap.xml", // <==== Add here
    ],
  },
};
