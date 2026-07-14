---
layout: page
title: 블로그
permalink: /blog/
subtitle: 딥다이브 · 소식 · 작업로그
---

{% if site.posts.size == 0 %}
<p class="empty-note">아직 글이 없습니다. <code>_posts/YYYY-MM-DD-제목.md</code> 형식으로 마크다운 파일을 추가하세요.</p>
{% else %}

<nav class="blog-filter" aria-label="카테고리">
  <a class="blog-filter-chip is-active" href="#all">전체</a>
  {% for cat in site.data.categories %}
    {% assign catposts = site.posts | where: "category", cat.slug %}
    {% if catposts.size > 0 %}
    <a class="blog-filter-chip cat-{{ cat.slug }}" href="#{{ cat.slug }}">{{ cat.label }}</a>
    {% endif %}
  {% endfor %}
</nav>

<span id="all"></span>
{% for cat in site.data.categories %}
  {% assign catposts = site.posts | where: "category", cat.slug %}
  {% if catposts.size > 0 %}
  <section id="{{ cat.slug }}" class="blog-cat-section">
    <div class="blog-cat-head">
      <h2><span class="blog-cat-label cat-{{ cat.slug }}">{{ cat.label }}</span> <span class="blog-cat-en">{{ cat.en }}</span></h2>
      <p class="blog-cat-desc">{{ cat.desc }}</p>
    </div>
    <div class="blog-card-grid">
      {% for post in catposts %}
        {% include post-card.html post=post %}
      {% endfor %}
    </div>
  </section>
  {% endif %}
{% endfor %}

{% assign known = "" | split: "" %}
{% for cat in site.data.categories %}{% assign known = known | push: cat.slug %}{% endfor %}
{% assign uncategorized = "" | split: "" %}
{% for post in site.posts %}{% unless known contains post.category %}{% assign uncategorized = uncategorized | push: post %}{% endunless %}{% endfor %}
{% if uncategorized.size > 0 %}
<section id="misc" class="blog-cat-section">
  <div class="blog-cat-head">
    <h2><span class="blog-cat-label">기타</span></h2>
    <p class="blog-cat-desc">아직 카테고리가 지정되지 않은 글.</p>
  </div>
  <div class="blog-card-grid">
    {% for post in uncategorized %}
      {% include post-card.html post=post %}
    {% endfor %}
  </div>
</section>
{% endif %}

{% endif %}
