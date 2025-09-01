const { createProxyMiddleware } = require('http-proxy-middleware');
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/favicon" : "/" } );
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy({ 'src/sitemap.xml': '/sitemap.xml' });
  eleventyConfig.addPassthroughCopy("./src/css/style.css");
  eleventyConfig.addPassthroughCopy("./src/css/prism-tomorrow.css");


  eleventyConfig.addPlugin(syntaxHighlight);

  // Add a filter for readable dates using Luxon
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    // When Eleventy parses a date like "2025-08-25", it creates a Date object
    // at midnight UTC. Using Luxon to format this date while treating it as UTC
    // prevents the date from shifting to the previous day due to timezone conversion.
    return DateTime.fromJSDate(dateObj, { zone: 'UTC' }).toFormat('LLLL d, yyyy');
  });

  // Add htmlDateString filter for sitemap <lastmod>
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    // toISODate() will return the date in YYYY-MM-DD format.
    // We specify UTC zone to ensure the date is not affected by the system's timezone.
    return DateTime.fromJSDate(dateObj, { zone: 'UTC' }).toISODate();
  });

  // Shortcode for creating a callout box
  // This is a "paired shortcode" which means it has a start and end tag.
  eleventyConfig.addPairedShortcode("callout", function(content, title) {
      return `<div class="bg-slate-800 border-l-4 border-blue-500 text-blue-200 p-4" role="alert">
                  <p class="font-bold">${title}</p>
                  <p>${content}</p>
              </div>`;
  });

  // Add a shortcode for the current year for the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Only add the proxy middleware when in serve mode
  if (process.env.ELEVENTY_RUN_MODE === "serve") {
    // Dev server options
    eleventyConfig.setServerOptions({
      // When the site is served by Eleventy's dev server, proxy API requests
      // to the API server which is running in a separate container.
      middleware: [
        createProxyMiddleware({
          pathFilter: '/api/**',
          target: 'http://api:3000', // The 'api' service container
          changeOrigin: true,
        }),
      ],
    });
  }

  // Watch the Tailwind config file for changes
  eleventyConfig.addWatchTarget("./tailwind.config.js");

  return {
    // Set the source and output directories
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
