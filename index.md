---
layout: page
title: 홈
permalink: /
---

<section class="hero">
  <h1>안녕하세요.</h1>
  <p class="lead">
  이력, 논문, 블로그 글을 정리하는 개인 페이지입니다.
  </p>
  <div class="hero-links">
    <a class="button" href="{{ '/cv/' | relative_url }}">이력 보기</a>
    <a class="button button-secondary" href="{{ '/blog/' | relative_url }}">블로그</a>
  </div>
</section>

<section class="home-section">
  <h2>최근 글</h2>
  <ul class="post-list">
    {% for post in site.posts limit:5 %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="meta">{{ post.date | date: '%Y.%m.%d' }}</span>
    </li>
    {% endfor %}
  </ul>
</section>
