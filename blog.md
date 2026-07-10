---
layout: page
title: 블로그
label: Blog
permalink: /blog/
subtitle: Research notes, TIL, and thoughts
---

{% if site.posts.size == 0 %}
<p class="empty-note">아직 글이 없습니다. <code>_posts/YYYY-MM-DD-제목.md</code> 형식으로 마크다운 파일을 추가하세요.</p>
{% else %}
<ul class="post-list post-list-editorial">
  {% for post in site.posts %}
  <li class="reveal-child">
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
    <div class="post-list-body">
      <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      {% if post.excerpt %}
      <p class="excerpt">{{ post.excerpt | strip_html | truncate: 140 }}</p>
      {% endif %}
      {% if post.tags and post.tags.size > 0 %}
      <ul class="tag-list" style="margin-top: 0.5rem;">
        {% for tag in post.tags %}
        <li>{{ tag }}</li>
        {% endfor %}
      </ul>
      {% endif %}
    </div>
    <span class="post-arrow" aria-hidden="true">→</span>
  </li>
  {% endfor %}
</ul>
{% endif %}
