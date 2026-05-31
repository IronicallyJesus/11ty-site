const { createProxyMiddleware } = require('http-proxy-middleware');
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

  // Add a global data property for the build time
  eleventyConfig.addGlobalData("buildTime", () => new Date().getTime());

  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy("src/css/prism.css");
  eleventyConfig.addPassthroughCopy({ "src/css/input.css": "css/style.css" });
  eleventyConfig.addPassthroughCopy("src/assets/fontawesome");
  eleventyConfig.addPassthroughCopy("src/assets/googlefonts");

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "blog",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Jesus's Blog Posts",
      subtitle: "An archive of cool projects I have worked on.",
      base: "https://jesus.twk95.com/",
      author: {
        name: "Jesus Otero Lagunes",
        email: "",
      }
    }
  });

  // Build tag list collection for tag archive pages
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tags = new Set();
    for (const item of collectionApi.getAll()) {
      if (item.data.tags) {
        for (const tag of item.data.tags) {
          if (tag !== "blog") tags.add(tag);
        }
      }
    }
    return [...tags].sort();
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: 'UTC' }).toFormat('LLLL d, yyyy');
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const noHtml = content.replace(/<[^>]*>/g, "");
    const wordCount = noHtml.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: 'UTC' }).toISODate();
  });

  // Callout shortcode (paired)
  eleventyConfig.addPairedShortcode("callout", function (content, title) {
    return `<div class="panel panel-accent" role="alert" style="margin: 1.5rem 0;">
              <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); margin-bottom: 0.5rem;">${title}</div>
              <div style="color: var(--text-primary);">${content}</div>
            </div>`;
  });

  // Command shortcode (paired)
  eleventyConfig.addPairedShortcode("command", function (content, user, host, output) {
    return `<pre class="command-line language-bash" data-user="${user}" data-host="${host}" data-output="${output}">
                  <code class="language-bash">${content}</code>
              </pre>`;
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Dev server: proxy API requests and watch CSS
  if (process.env.ELEVENTY_RUN_MODE === "serve") {
    eleventyConfig.setServerOptions({
      middleware: [
        createProxyMiddleware({
          pathFilter: '/api/**',
          target: 'http://localhost:3000',
          changeOrigin: true,
        }),
      ],
      watch: ['_site/css/style.css'],
    });
  }

  // Watch the CSS source for live reload
  eleventyConfig.addWatchTarget("./src/css/input.css");

  return {
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
