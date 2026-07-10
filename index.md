---
layout: home
title: 홈
permalink: /
---

<section class="home-hero reveal">
  <p class="home-hero-eyebrow">POSTECH · PIAI</p>
  <h1 class="home-hero-title">
    <span class="home-hero-en">{{ site.author.name }}</span>
    <span class="home-hero-ko">{{ site.author.name_ko }}</span>
  </h1>
  <p class="home-hero-tagline">{{ site.author.tagline }}</p>
  <p class="home-hero-intro">멀티에이전트와 에이전트 평가를 연구합니다. 논문 속 주장이 실제 코드로도 되는지 확인하고, 되는 건 블로그에, 코드는 GitHub에 남깁니다.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="{{ '/cv/' | relative_url }}">이력</a>
    <a class="btn btn-ghost" href="{{ '/blog/' | relative_url }}">글</a>
    <a class="btn btn-ghost" href="{{ site.author.github }}" target="_blank" rel="noopener noreferrer me">GitHub</a>
  </div>
</section>

<section class="home-section reveal">
  <div class="home-section-header">
    <h2>프로젝트</h2>
    <a class="section-link" href="{{ site.author.github_repos }}" target="_blank" rel="noopener noreferrer">전체 repo</a>
  </div>
  <div class="project-grid">
    {% for project in site.data.projects.featured %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section class="home-section reveal">
  <div class="home-section-header">
    <h2>최근 글</h2>
    <a class="section-link" href="{{ '/blog/' | relative_url }}">더 보기</a>
  </div>
  {% if site.posts.size > 0 %}
  <ul class="post-list post-list-editorial">
    {% for post in site.posts limit:5 %}
    <li class="reveal-child">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
      <div class="post-list-body">
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.summary %}
        <p class="excerpt">{{ post.summary }}</p>
        {% elsif post.excerpt %}
        <p class="excerpt">{{ post.excerpt | strip_html | truncate: 110 }}</p>
        {% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>
  {% endif %}
</section>

<section class="home-section reveal">
  <div class="home-section-header">
    <h2>이전에 만든 것</h2>
  </div>
  <ul class="earlier-list">
    {% for project in site.data.projects.earlier %}
    <li class="reveal-child">
      <a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
      <span class="desc">{{ project.desc }}</span>
    </li>
    {% endfor %}
  </ul>
</section>
