---
title: "Second blog post"
date: "2025-08-06"
layout: "base.njk"
---

## Purpose
This post is moreso a feature showcase of what I can do with Markdown

## What is Eleventy?
Eleventy (or 11ty) is a simpler static site generator. It's written in JavaScript and transforms a directory of templates of various types into a folder of plain HTML files. It's known for its flexibility, speed, and the fact that it doesn't ship any client-side JavaScript by default.

***

## Markdown Features
Eleventy has excellent support for Markdown. Here are some examples of what you can do.

### Basic Formatting
You can use **bold text**, *italic text*, and even ***both***. You can also create links, like this one to the [official Eleventy website](https://www.11ty.dev/).

### Lists
* Unordered list item 1
* Unordered list item 2
    * Nested item

1.  Ordered list item 1
2.  Ordered list item 2

### Code Blocks
You can include inline code like `<div>` within a sentence. For larger code blocks, you can use fenced code blocks with syntax highlighting:

```js
// This is a JavaScript code block
function greet(name) {
    console.log(`Hello, ${name}!`);
}
greet('World');
```

### Tables

| Feature         | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| Templating      | Supports over 10 different templating languages.            |
| Data Cascade    | Merge data from different sources to use in your templates. |

### Blockquotes
> "The web should be a platform for creativity and expression. Eleventy helps make that a reality."

### Markdown Plugins
You can extend Markdown's functionality with plugins. For example, with `markdown-it-emoji`, you can write things like :tada: and get 🎉.

***

## Templating and Data
Eleventy can use data from JSON or JavaScript files. Imagine you have a `_data/users.json` file. You could then use a templating language like Nunjucks within your Markdown file to loop through this data:

### Team Members:
<ul>
{%- for user in users -%}
    <li><strong>{{ user.name }}</strong> - {{ user.role }}</li>
{%- endfor -%}
</ul>

***

## Shortcodes
Shortcodes are reusable snippets of content. You could create a shortcode for a callout box like this:

{% callout "Heads up!" %}
This is a custom callout box created with a shortcode. It's a great way to create reusable components.
{% endcallout %}

***

## Layouts
Layouts allow you to wrap your content in a parent template. For example, this entire page could be a Markdown file that uses a main layout file to provide the header, footer, and overall page structure. This avoids repeating the same HTML in every file.

In your Markdown file's front matter, you would specify the layout like this:
```
---
layout: base.njk
title: My Awesome Page
---
Your Markdown content goes here...
