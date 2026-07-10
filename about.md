---
layout: page
title: 소개
label: About
permalink: /about/
subtitle: Researcher · Builder · Human-centered AI
---

<div class="about-grid">
<div class="prose">

## 안녕하세요

**{{ site.author.name }}** ({{ site.author.name_ko }})입니다. POSTECH Institute for Artificial Intelligence (PIAI)에서 연구 인턴으로 일하고 있으며, 멀티에이전트 시스템과 인간중심 AI를 중심으로 연구·개발합니다.

개발자이자 연구자로서, 에이전트 기술이 실제로 어디까지 왔는지 가까이에서 따라가는 편입니다. 멀티에이전트 구성, evaluation harness, tool use, 그리고 그 주변의 plumbing에 관심이 많습니다.

논문을 꾸준히 읽고, 무엇이 진짜 변화인지 무엇이 리브랜딩인지 구분하려 노력합니다. 검증이 필요하면 작은 코드를 짜서 직접 확인합니다.

## 관심 분야

- **Multi-agent LLM systems** — orchestration, debate, tool routing
- **Evaluation** — ablation, human study, eval harness 설계
- **Human-centered AI** — 신뢰성, 사용성, 실제 현장 적용
- **Memory & RAG** — episodic memory, forgetting curve, salience fusion
- **Speech & dialect** — 방언 TTS, 음성 합성 파이프라인

## 연구 철학

> 벤치마크가 좋아 보이는 것과, 실제로 신뢰하고 쓸 수 있는 시스템은 다릅니다.

인간중심 AI 공학을 전공한 배경 덕분에, 기술이 사람에게 어떻게 다가가는지 — 불편함, 불신, 맥락 손실 — 을 놓치지 않으려 합니다.

## 현재 소속

| 기간 | 소속 | 역할 |
|------|------|------|
| 2026 – | POSTECH Institute for Artificial Intelligence | Research Intern |
| 2024 – 2025 | Human-Centered AI Center (HCAC) | Researcher |
| 2019 – 2025 | Sangmyung University | Human-Centered AI Engineering |

더 자세한 이력은 [이력 페이지]({{ '/cv/' | relative_url }})에서, 논문은 [논문 페이지]({{ '/publications/' | relative_url }})에서 확인할 수 있습니다.

</div>

<aside class="about-sidebar">
  <img src="{{ site.author.avatar }}" alt="{{ site.author.name }}">
  <dl>
    <dt>Name</dt>
    <dd>{{ site.author.name }}</dd>
    <dt>Location</dt>
    <dd>{{ site.author.location }}</dd>
    <dt>Email</dt>
    <dd><a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a></dd>
    <dt>GitHub</dt>
    <dd><a href="{{ site.author.github }}" target="_blank" rel="noopener">@{{ site.author.handle }}</a></dd>
    <dt>Focus</dt>
    <dd>{{ site.author.tagline }}</dd>
  </dl>
</aside>
</div>
