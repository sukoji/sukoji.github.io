---
layout: post
title: "GPT-5.6 나온 날 메모"
date: 2026-07-10
tags: [gpt-5.6, llm, agents]
summary: Sol / Terra / Luna 티어 분리, ChatGPT Work, 에이전트 라우팅 관점에서 짧게 정리.
---

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/) GA. 6월 말 limited preview 이후 정식 공개됐고, 같은 날 [ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)도 같이 나옴.

> **한 줄 요약**
> 모델 업그레이드라기보다 **티어 분리 + 병렬 에이전트 + 워크스페이스 에이전트** 패키지에 가깝다. 에이전트 쓸 때는 라우팅·eval 설계가 더 중요해짐.
{: .callout-summary}

## 모델 라인업

| 모델 | 포지션 | API 가격 (in / out, per 1M) |
|------|--------|-----------------------------|
| **Sol** | 플래그십 | $5 / $30 |
| **Terra** | 5.5급 근처, 저비용 | $2.50 / $15 |
| **Luna** | 가장 빠르고 저렴 | $1 / $6 |

세대 번호(5.6)와 티어(Sol / Terra / Luna)를 분리한 게 이번에 눈에 띔.

에이전트 파이프라인 예시:

- **Luna** — planning, 분류, cheap subtask
- **Terra** — 중간 reasoning
- **Sol** — 최종 synthesis, difficult step

## Sol `ultra`

여러 에이전트를 병렬로 돌리고 합치는 모드. 제품 스펙에 **동시 workstream**이 들어간 셈.

> **주의**
> 병렬만 늘리면 비용만 커지는 경우가 많음. eval·중간 체크포인트 없으면 의미 없음.
{: .callout-warn}

sympo 같은 PRD→WBS 파이프라인 돌려보면 바로 체감됨 — 모델이 좋아질수록 오케스트레이션 쪽이 병목.

## ChatGPT Work

Codex 계열을 비개발 업무(문서, 스프레드시트, 프레젠)에 붙인 제품. Slack / Gmail / Drive 플러그인 디렉터리보다 **컨텍스트를 어디까지 긁어오느냐**가 관건.

## 직접 써볼 때

Terra로 간단한 multi-step 태스크 돌려보고 로그 남길 예정. API 호출은 대략 이런 식:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "messages": [{"role": "user", "content": "..."}]
  }'
```

토큰 사용량은 [token-stack](https://github.com/sukoji/token-stack)으로 README 카드 만들 예정.

## 참고

- [OpenAI — GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI — ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- [The Verge — 출시 배경](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work)
