---
layout: post
title: "GPT-5.6 — 모델 이름이 Sol, Terra, Luna가 됐을 때"
date: 2026-07-10
tags: [gpt-5.6, llm, agents]
summary: 세대 번호와 티어를 분리한 5.6 라인업. 에이전트 파이프라인에 꽂아볼 포인트만.
---

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/) 정식 공개. 6월 말 프리뷰 때는 "또 업데이트네" 정도로 봤는데, 이번엔 [ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)까지 같이 나와서 제품 쪽 의도가 좀 더 분명해졌다.

> **핵심**
> 벤치 하나 올린 게 아니라 **티어 셋 + 병렬 에이전트 + 워크스페이스** 묶음에 가깝다. sympo 같은 멀티스텝 파이프라인 쓰는 입장에선 라우팅이랑 eval을 어떻게 짜느냐가 더 중요해질 듯.
{: .callout-summary}

## 라인업

| 모델 | 쓸 만한 곳 | API (in / out, 1M 토큰) |
|------|-----------|-------------------------|
| **Sol** | 어려운 추론, 최종 합성 | $5 / $30 |
| **Terra** | 5.5급 근처, 일반 reasoning | $2.50 / $15 |
| **Luna** | 분류·플래닝·가벼운 서브태스크 | $1 / $6 |

5.6이라는 세대 번호랑 Sol/Terra/Luna라는 티어가 따로 놀고 있다. API 고를 때 `gpt-5.6`만 보고 들어가면 헷갈릴 수 있음.

내 쪽에서 상상하는 조합은 대충 이런 식이다. Luna로 태스크 쪼개고 분류하고, Terra가 중간 단계 맡고, Sol은 마지막에 묶는다. 아직 실험 전이라 맞는지는 모름 — sympo PRD→WBS에 넣어보면 금방 티 날 것 같다.

## Sol `ultra`

여러 에이전트를 동시에 돌려서 합치는 모드. 스펙 시트에 **동시 workstream**이라고 적혀 있음.

> **주의**
> 병렬만 늘리면 비용만 커지는 경우가 많다. 중간에 뭘 검사할지 없으면 그냥 빠른 낭비.
{: .callout-warn}

솔직히 모델 성능보다 오케스트레이션이 병목인 파이프라인에서는, ultra가 도움이 될지 돈 먹는 구멍이 될지는 eval 없이는 말하기 어렵다.

## ChatGPT Work

Codex 계열을 문서·스프레드시트·프레젠 쪽에 붙인 제품. Slack이나 Gmail 플러그인 목록이 늘어나는 것보다, **업무 컨텍스트를 어디까지 가져오느냐**가 더 관심 갈 부분이다. 개발자 입장에선 API 라우팅이 먼저고, 이쪽은 나중에 봐도 될 듯.

## 다음에 할 것

Terra로 multi-step 태스크 몇 개 돌려보고 로그 남길 예정. 호출 형태는 대략 이렇다:

```bash
# Terra — 중간 reasoning용으로 먼저 시도
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "messages": [{"role": "user", "content": "..."}]
  }'
```

토큰 쓴 양은 [token-stack](https://github.com/sukoji/token-stack)으로 README 카드 뽑아볼 생각. 숫자 나오면 여기에 덧붙이겠다.

## 읽을 곳

- [OpenAI — GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI — ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- [The Verge — 출시 배경](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work)
