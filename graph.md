---
layout: page
title: 그래프
permalink: /graph/
graph: true
---

<p class="graph-intro">글과 프로젝트를 태그로 연결한 지도입니다. 점을 끌어 옮기거나, 글·프로젝트 점을 누르면 해당 페이지로 갑니다.</p>

<div class="graph-wrap" data-graph>
  <canvas class="graph-canvas" aria-hidden="true"></canvas>
  <ul class="graph-legend">
    <li><span class="dot dot-post"></span>글</li>
    <li><span class="dot dot-project"></span>프로젝트</li>
    <li><span class="dot dot-tag"></span>태그</li>
  </ul>
  <p class="graph-fallback">그래프를 그리려면 JavaScript가 필요합니다. 아래 목록으로도 같은 내용을 볼 수 있습니다.</p>
</div>

<script type="application/json" id="graph-data">
{
  "nodes": [
    {% assign sep = "" -%}
    {% for post in site.posts -%}
    {{ sep }}{ "id": "post:{{ post.url }}", "label": {{ post.title | jsonify }}, "type": "post", "url": {{ post.url | relative_url | jsonify }} }
    {%- assign sep = "," -%}
    {%- for tag in post.tags -%}
    {{ sep }}{ "id": "tag:{{ tag | slugify }}", "label": {{ tag | jsonify }}, "type": "tag" }
    {%- endfor -%}
    {%- endfor -%}
    {%- for project in site.data.projects.featured -%}
    {{ sep }}{ "id": "proj:{{ project.name | slugify }}", "label": {{ project.name | jsonify }}, "type": "project", "url": {{ project.url | jsonify }} }
    {%- for tag in project.tags -%}
    {{ sep }}{ "id": "tag:{{ tag | slugify }}", "label": {{ tag | jsonify }}, "type": "tag" }
    {%- endfor -%}
    {%- endfor %}
  ],
  "links": [
    {% assign lsep = "" -%}
    {% for post in site.posts -%}
    {%- for tag in post.tags -%}
    {{ lsep }}{ "source": "post:{{ post.url }}", "target": "tag:{{ tag | slugify }}" }
    {%- assign lsep = "," -%}
    {%- endfor -%}
    {%- endfor -%}
    {%- for project in site.data.projects.featured -%}
    {%- for tag in project.tags -%}
    {{ lsep }}{ "source": "proj:{{ project.name | slugify }}", "target": "tag:{{ tag | slugify }}" }
    {%- assign lsep = "," -%}
    {%- endfor -%}
    {%- endfor %}
  ]
}
</script>

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
