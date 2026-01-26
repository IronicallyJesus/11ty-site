const { createProxyMiddleware } = require('http-proxy-middleware');
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

  // Add a global data property for the build time
  eleventyConfig.addGlobalData("buildTime", () => new Date().getTime());

  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/favicon" : "/" } );
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy({ 'src/sitemap.xml': '/sitemap.xml' });
  eleventyConfig.addPassthroughCopy("src/css/prism.css");
  eleventyConfig.addPassthroughCopy("src/assets/fontawesome");
  eleventyConfig.addPassthroughCopy("src/assets/googlefonts");

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "blog", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Jesus's Blog Posts",
			subtitle: "An archive of cool projects I have worked on.",
			base: "https://jesus.twk95.com/",
			author: {
				name: "Jesus Otero Lagunes",
				email: "", // Optional
			}
		}
	});


  // Add a filter for readable dates using Luxon
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    // When Eleventy parses a date like "2025-08-25", it creates a Date object
    // at midnight UTC. Using Luxon to format this date while treating it as UTC
    // prevents the date from shifting to the previous day due to timezone conversion.
    return DateTime.fromJSDate(dateObj, { zone: 'UTC' }).toFormat('LLLL d, yyyy');
  });
  // Reading time filter
  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const noHtml = content.replace(/<[^>]*>/g, "");
    const wordCount = noHtml.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
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

  // Shortcode for creating a console output
  // This is a "paired shortcode" which means it has a start and end tag.
  eleventyConfig.addPairedShortcode("command", function(content, user, host, output,) {
      return `<pre class="command-line language-bash" data-user="${ user }" data-host="${ host }" data-output="${ output }">
                  <code class="language-bash">${content}</code>
              </pre>`;
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
          target: 'http://localhost:3000', // The local API server
          changeOrigin: true,
        }),
      ],
      // Watch for changes to the compiled CSS and reload the browser.
      // This is more efficient than `addWatchTarget` which triggers a full rebuild.
      watch: ['_site/css/style.css'],
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
