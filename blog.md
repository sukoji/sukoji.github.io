---
layout: page
title: 블로그
permalink: /blog/
---

{% if site.posts.size == 0 %}
아직 글이 없습니다. `_posts/` 폴더에 마크다운 파일을 추가하세요.
{% else %}
<ul class="post-list post-list-full">
  {% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="meta">{{ post.date | date: '%Y.%m.%d' }}</span>
    {% if post.excerpt %}
    <p class="excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
{% endif %}
