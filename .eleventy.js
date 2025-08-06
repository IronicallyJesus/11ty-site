module.exports = function(eleventyConfig) {
  // Pass through static assets from the "src" directory
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
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

  // Add a shortcode for the current year for the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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
