---
layout: page
title: 그래프
permalink: /graph/
graph: true
---

<p class="graph-intro">글과 프로젝트를 태그로 연결한 지도입니다. 스크롤로 줌, 빈 곳을 끌면 이동, 점을 끌면 노드 이동. 글·프로젝트 점을 누르면 해당 페이지로 가고, 더블클릭하면 화면이 초기화됩니다.</p>

<div class="graph-wrap" data-graph>
  <canvas class="graph-canvas" aria-hidden="true"></canvas>
  <ul class="graph-legend">
    <li><span class="dot dot-deepdive"></span>딥다이브</li>
    <li><span class="dot dot-news"></span>소식</li>
    <li><span class="dot dot-log"></span>작업로그</li>
    <li><span class="dot dot-project"></span>프로젝트</li>
    <li><span class="dot dot-tag"></span>태그</li>
  </ul>
  <p class="graph-fallback">그래프를 그리려면 JavaScript가 필요합니다. 아래 목록으로도 같은 내용을 볼 수 있습니다.</p>
</div>

{% include graph-data.html %}

<div class="graph-index">
  <div class="graph-index-col">
    <h2>글</h2>
    <ul>
      {% for post in site.posts %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.tags.size > 0 %}<span class="graph-index-tags">{{ post.tags | join: " · " }}</span>{% endif %}
      </li>
      {% endfor %}
    </ul>
  </div>
  <div class="graph-index-col">
    <h2>프로젝트</h2>
    <ul>
      {% for project in site.data.projects.featured %}
      <li><a href="{{ project.url }}" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
        {% if project.tags.size > 0 %}<span class="graph-index-tags">{{ project.tags | join: " · " }}</span>{% endif %}
      </li>
      {% endfor %}
    </ul>
  </div>
</div>
