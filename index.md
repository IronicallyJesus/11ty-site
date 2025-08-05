---
subject: World
---
# Hello {{ subject }}

You can type here!

- [Markdown](https://www.11ty.dev/docs/languages/markdown/)
- [Liquid](https://www.11ty.dev/docs/languages/liquid/)

## Posts

{%- for post in collections.posts %}
- [{{ post.data.title }}]({{ post.url}})
{%- endfor %}

_Built with {{ eleventy.generator }}_