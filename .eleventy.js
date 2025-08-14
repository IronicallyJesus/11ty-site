module.exports = function(eleventyConfig) {

  // Pass through static assets from the "src" directory
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/resume");
  eleventyConfig.addPassthroughCopy("src/assets/images");
 eleventyConfig.addPassthroughCopy({ "favicon" : "/" } );
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
