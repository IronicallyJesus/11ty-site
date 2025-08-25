module.exports = function(eleventyConfig) {
  const { createProxyMiddleware } = require('http-proxy-middleware');
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

  // Pass through static assets from the "src" directory
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "favicon" : "/" } );
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy({ 'src/sitemap.xml': '/sitemap.xml' });

  eleventyConfig.addPlugin(syntaxHighlight);

  // Add a filter for readable dates using vanilla JS
  eleventyConfig.addFilter("readableDate", dateObj => {
    // The toLocaleDateString method can be used to format dates
    // without any external libraries.
    // The 'UTC' timeZone option is added to prevent off-by-one day errors.
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' 
    });
  });

  // Add htmlDateString filter for sitemap <lastmod>
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    if (!dateObj) return "";
    // Format date as YYYY-MM-DD for sitemaps
    const d = new Date(dateObj);
    return d.toISOString().split("T")[0];
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
