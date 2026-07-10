---
layout: page
title: 논문
label: Publications
permalink: /publications/
subtitle: Conference papers & preprints
---

## 학회 논문

<div class="pub-list">
{% for pub in site.data.publications.conferences %}
<article class="pub-card">
  <p class="pub-year">{{ pub.year }}</p>
  <h3 class="pub-title">{{ pub.title }}</h3>
  <p class="pub-authors">{{ pub.authors }}</p>
  <p class="pub-venue"><em>{{ pub.venue }}</em></p>
  {% if pub.abstract %}
  <p class="pub-abstract">{{ pub.abstract }}</p>
  {% endif %}
  {% if pub.links.size > 0 %}
  <div class="pub-links">
    {% for link in pub.links %}
    <a href="{{ link.url }}" target="_blank" rel="noopener">{{ link.label }}</a>
    {% endfor %}
  </div>
  {% endif %}
</article>
{% endfor %}
</div>

## 준비 중

<div class="pub-list">
{% for pub in site.data.publications.in_preparation %}
<article class="pub-card" style="opacity: 0.7;">
  <p class="pub-year">{{ pub.year }}</p>
  <h3 class="pub-title">{{ pub.title }}</h3>
</article>
{% endfor %}
</div>

---

새 논문은 `_data/publications.yml`에 항목을 추가하면 자동으로 반영됩니다.

```yaml
conferences:
  - year: 2026
    title: "논문 제목"
    authors: "Seokho Jin, et al."
    venue: "학회명 2026"
    abstract: "초록 (선택)"
    links:
      - label: PDF
        url: "https://..."
      - label: Code
        url: "https://github.com/..."
```
