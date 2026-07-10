---
layout: home
title: 홈
permalink: /
---

<section class="hero">
  <div class="hero-avatar">
    <img src="{{ site.author.avatar }}" alt="{{ site.author.name }}" width="148" height="148">
  </div>
  <div class="hero-content">
    <h1>{{ site.author.name }}<span class="name-ko">{{ site.author.name_ko }}</span></h1>
    <p class="hero-tagline">{{ site.author.tagline }}</p>
    <p class="hero-bio">
      에이전트가 어디로 가는지 가까이에서 지켜보는 걸 좋아하는 연구자이자 개발자입니다.
      멀티에이전트 구성, eval harness, tool use, 그 주변 인프라에 시간을 씁니다.
      논문을 읽고, 실제로 바뀌는 것과 리브랜딩만 된 것을 구분하며, 검증이 필요하면 작은 코드를 짭니다.
      인간중심 AI 배경 덕분에 벤치마크 숫자만이 아니라, 실제로 신뢰하고 쓰기 어려운 시스템도 눈에 들어옵니다.
    </p>
    <div class="affiliation-chips">
      <span class="chip"><strong>PIAI</strong> Research Intern</span>
      <span class="chip"><strong>HCAC</strong> Researcher</span>
      <span class="chip"><strong>상명대</strong> 인간중심 AI 공학</span>
    </div>
    <div class="hero-actions">
      <a class="btn btn-primary" href="{{ '/cv/' | relative_url }}">이력 보기</a>
      <a class="btn btn-ghost" href="{{ '/publications/' | relative_url }}">논문</a>
      <a class="btn btn-ghost" href="{{ '/blog/' | relative_url }}">블로그</a>
      <a class="btn btn-ghost" href="{{ site.author.github }}" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-section-header">
    <div>
      <p class="section-label">01 — Projects</p>
      <h2>주요 프로젝트</h2>
    </div>
    <a class="section-link" href="{{ site.author.github }}?tab=repositories" target="_blank" rel="noopener">전체 repo ↗</a>
  </div>
  <div class="project-grid">
    {% for project in site.data.projects.featured %}
      {% include project-card.html project=project %}
    {% endfor %}
  </div>
</section>

<section class="home-section">
  <div class="home-section-header">
    <div>
      <p class="section-label">02 — Writing</p>
      <h2>최근 글</h2>
    </div>
    <a class="section-link" href="{{ '/blog/' | relative_url }}">모든 글 →</a>
  </div>
  {% if site.posts.size > 0 %}
  <ul class="post-list">
    {% for post in site.posts limit:5 %}
    <li>
      <span class="date">{{ post.date | date: '%Y.%m.%d' }}</span>
      <div>
        <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.excerpt %}
        <p class="excerpt">{{ post.excerpt | strip_html | truncate: 100 }}</p>
        {% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p style="color: var(--ink-muted);">아직 글이 없습니다. <code>_posts/</code>에 마크다운을 추가하세요.</p>
  {% endif %}
</section>

<section class="home-section">
  <div class="home-section-header">
    <div>
      <p class="section-label">03 — Earlier</p>
      <h2>이전 작업</h2>
    </div>
  </div>
  <ul class="earlier-list">
    {% for project in site.data.projects.earlier %}
    <li>
      <span class="emoji">{{ project.emoji }}</span>
      <div>
        <a href="{{ project.url }}" target="_blank" rel="noopener">{{ project.name }}</a>
        <span class="desc"> — {{ project.desc }}</span>
      </div>
    </li>
    {% endfor %}
  </ul>
</section>
