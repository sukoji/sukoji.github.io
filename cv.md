---
layout: page
title: 이력
label: CV
permalink: /cv/
subtitle: Education · Experience · Skills
---

## 학력

<div class="timeline">
{% for item in site.data.experience.education %}
<div class="timeline-item">
  <p class="timeline-period">{{ item.period }}</p>
  <p class="timeline-role">{{ item.role }}</p>
  <p class="timeline-org">{{ item.org }}</p>
  <p class="timeline-detail">{{ item.detail }}</p>
</div>
{% endfor %}
</div>

## 경력

<div class="timeline">
{% for item in site.data.experience.experience %}
<div class="timeline-item">
  <p class="timeline-period">{{ item.period }}</p>
  <p class="timeline-role">{{ item.role }}</p>
  <p class="timeline-org">{{ item.org }}</p>
  <p class="timeline-detail">{{ item.detail }}</p>
</div>
{% endfor %}
</div>

## 기술

<div class="skills-grid">
{% for skill in site.data.experience.skills %}
<div class="skill-card">
  <h3>{{ skill.category }}</h3>
  <p>{{ skill.items }}</p>
</div>
{% endfor %}
</div>

## 프로젝트

주요 프로젝트는 [홈]({{ '/' | relative_url }})에서, 전체 목록은 [GitHub]({{ site.author.github }}?tab=repositories)에서 확인할 수 있습니다.

<div class="project-grid" style="margin-top: 1.5rem;">
{% for project in site.data.projects.featured limit:4 %}
  {% include project-card.html project=project %}
{% endfor %}
</div>

## 연락처

- **Email:** [{{ site.author.email }}](mailto:{{ site.author.email }})
- **GitHub:** [@{{ site.author.handle }}]({{ site.author.github }}) · [Repositories]({{ site.author.github_repos }}) · [Profile README]({{ site.author.github_profile_readme }})
- **Location:** {{ site.author.location }}

{% include social-links.html source=true %}
