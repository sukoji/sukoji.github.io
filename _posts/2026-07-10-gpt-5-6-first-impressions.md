---
layout: post
title: "GPT-5.6 나온 날 메모"
date: 2026-07-10
tags: [gpt-5.6, llm]
---

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/) GA 됐다. preview는 6월 말부터였고, 같은 날 [ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)도 같이 나옴.

## 모델 라인업

- **Sol** — 플래그십. API $5 / $30 (in/out per 1M)
- **Terra** — 5.5급 근처, 절반 가격
- **Luna** — 제일 싸고 빠름

이름 체계가 세대(5.6)랑 티어(Sol/Terra/Luna)를 분리한 게 이번에 눈에 띔. 에이전트 짤 때 라우팅 넣기엔 나쁘지 않아 보임 — planning은 Luna, synthesis는 Sol 이런 식.

Sol `ultra`는 에이전트 여러 개 병렬 돌리는 모드. 근데 병렬만 늘면 비용만 늘어나는 경우 많아서, eval이랑 중간 체크포인트 없으면 의미 없음. sympo 돌려보면 바로 느껴짐.

## ChatGPT Work

Codex 계열을 비개발 업무에 붙인 거. Slack/Gmail/Drive 플러그인 디렉터리가 핵심이라기보다, **컨텍스트를 어디까지 긁어오느냐**가 관건일 듯.

## 기타

사이버 보안 때문에 preview 때 제한됐다가 풀린 건 [The Verge](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work) 기사 참고. 방어용 강조는 하는데, 실제로는 직접 써봐야 앎.

이번 주에 Terra로 간단한 multi-step 태스크 돌려보고 [token-stack](https://github.com/sukoji/token-stack)에 로그 남겨볼 예정.
