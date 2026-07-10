---
layout: post
title: "GPT-5.6 API — Sol/Terra/Luna부터 보면 됨"
date: 2026-07-10
tags: [gpt-5.6, llm, agents]
summary: 5.6은 세대 이름이고 Sol/Terra/Luna가 실제 모델. sympo 꽂기 전에 라우팅부터 손볼 일.
---

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/)가 나왔습니다. 6월 프리뷰 때는 그냥 넘겼는데, [ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)까지 같이 올라와서 이번엔 제품 쪽도 같이 봐야 할 것 같습니다.

> **적어 둠**
> 벤치보다 **티어 셋**(Sol/Terra/Luna)이랑 **ultra** 병렬, Work 에이전트가 같이 온 게 더 큽니다. sympo 같은 파이프라인이면 라우팅·eval부터 손댈 게 많아질 것 같습니다.
{: .callout-summary}

## 티어

| 모델 | 대충 이렇게 쓸 듯 | API (in / out, 1M) |
|------|-------------------|---------------------|
| **Sol** | 어려운 거, 마지막 합치기 | $5 / $30 |
| **Terra** | 5.5쯤, 중간 reasoning | $2.50 / $15 |
| **Luna** | 분류·플래닝·싼 서브태스크 | $1 / $6 |

버전은 5.6인데 모델 이름은 Sol/Terra/Luna입니다. 문서에서 `gpt-5.6`만 보고 고르면 헷갈립니다.

저라면 Luna로 쪼개고 분류하고, Terra가 중간, Sol이 마지막 — 정도로 나눌 것 같습니다. 아직 안 해봐서 확신은 없습니다. sympo PRD→WBS에 붙여보면 바로 알 것 같습니다.

## ultra

에이전트 여러 개를 동시에 돌려서 합치는 모드입니다. 스펙에 concurrent workstream이라고 적혀 있습니다.

> **주의**
> 병렬만 늘리면 돈만 더 듭니다. 중간에 뭘 확인할지 없으면 의미 없습니다.
{: .callout-warn}

오케스트레이션이 이미 병목인 파이프라인이면, ultra가 답인지 돈 구멍인지 eval 없이는 모르겠습니다.

## Work

Codex 계열을 문서·시트·프레젠에 쓰는 제품입니다. Slack/Gmail 플러그인 늘리는 것보다 컨텍스트를 어디까지 긁어오는지가 궁금합니다. API는 Terra부터 돌려보고 Work는 뒤에 볼 예정입니다.

## Terra로 한번 돌려보기

multi-step 태스크 몇 개를 Terra로 시도해 볼 예정입니다. 호출은 대략 이렇습니다.

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "messages": [{"role": "user", "content": "..."}]
  }'
```

토큰은 [token-stack](https://github.com/sukoji/token-stack)으로 카드를 뽑아볼 예정입니다. 숫자가 나오면 여기에 추가하겠습니다.

## 링크

- [OpenAI — GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI — ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- [The Verge](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work)
