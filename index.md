---
layout: home
title: 홈
permalink: /
---

<div class="home-shell">
<section class="hero reveal">
  <div class="hero-aside">
    <p class="hero-eyebrow">Researcher · Builder</p>
    <div class="hero-avatar">
      <a href="{{ site.author.github }}" target="_blank" rel="noopener noreferrer me" title="GitHub @{{ site.author.handle }}">
        <img src="{{ site.author.avatar }}" alt="{{ site.author.name }}" width="160" height="160">
      </a>
    </div>
    <ul class="hero-meta-list">
      <li><span>PIAI</span> Research Intern</li>
      <li><span>HCAC</span> Researcher</li>
      <li><span>SMU</span> HCAI Engineering</li>
    </ul>
  </div>

  <div class="hero-content">
    <h1 class="hero-title">
      <span class="hero-title-en">{{ site.author.name }}</span>
      <span class="hero-title-ko">{{ site.author.name_ko }}</span>
    </h1>
    <p class="hero-tagline">{{ site.author.tagline }}</p>
    <p class="hero-bio">
      에이전트가 어디로 가는지 가까이에서 지켜보는 연구자이자 개발자입니다.
      멀티에이전트 구성, eval harness, tool use — 그 주변 인프라에 시간을 씁니다.
      벤치마크 숫자 너머, 실제로 신뢰하고 쓰기 어려운 시스템도 봅니다.
    </p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/cv/' | relative_url }}">이력</a>
      <a class="btn btn-ghost" href="{{ '/publications/' | relative_url }}">논문</a>
      <a class="btn btn-ghost" href="{{ '/blog/' | relative_url }}">블로그</a>
      <a class="btn btn-ghost" href="{{ site.author.github }}" target="_blank" rel="noopener noreferrer me">GitHub</a>
    </div>
    {% include social-links.html %}
  </div>
</section>

<section class="home-section reveal" style="--section-num: '01'">
  <div class="home-section-header">
    <div>
      <p class="section-label">Projects</p>
      <h2>주요 프로젝트</h2>
    </div>
    <a class="section-link" href="{{ site.author.github_repos }}" target="_blank" rel="noopener noreferrer">전체 repo</a>
  </div>
  <div class="project-grid">
    {% for project in site.data.projects.featured %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section class="home-section reveal" style="--section-num: '02'">
  <div class="home-section-header">
    <div>
      <p class="section-label">Writing</p>
      <h2>최근 글</h2>
    </div>
    <a class="section-link" href="{{ '/blog/' | relative_url }}">모든 글</a>
  </div>
  {% if site.posts.size > 0 %}
  <ul class="post-list post-list-editorial">
    {% for post in site.posts limit:5 %}
    <li class="reveal-child">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%Y.%m.%d' }}</time>
      <div class="post-list-body">
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.excerpt %}
        <p class="excerpt">{{ post.excerpt | strip_html | truncate: 110 }}</p>
        {% endif %}
      </div>
      <span class="post-arrow" aria-hidden="true">→</span>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p class="empty-note">아직 글이 없습니다. <code>_posts/</code>에 마크다운을 추가하세요.</p>
  {% endif %}
</section>

<section class="home-section reveal" style="--section-num: '03'">
  <div class="home-section-header">
    <div>
      <p class="section-label">Archive</p>
      <h2>이전 작업</h2>
    </div>
  </div>
  <ul class="earlier-list">
    {% for project in site.data.projects.earlier %}
    <li class="reveal-child">
      <span class="emoji">{{ project.emoji }}</span>
      <div>
        <a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
        <span class="desc">{{ project.desc }}</span>
      </div>
    </li>
    {% endfor %}
  </ul>
</section>
</div>
