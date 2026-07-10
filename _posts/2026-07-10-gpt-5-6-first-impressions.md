---
layout: post
title: "GPT-5.6 훑어보기: 모델 등급보다 tool calling이 더 큰 변화"
date: 2026-07-10
tags: [gpt-5.6, llm, agents]
summary: 5.6은 세대, Sol/Terra/Luna는 성능·가격이 다른 등급입니다. 등급 고르는 일보다 programmatic tool calling이 파이프라인을 더 흔들 것 같습니다.
image: /assets/images/posts/2026-07-10-gpt-5-6.svg
---

![GPT-5.6 — Sol, Terra, Luna](/assets/images/posts/2026-07-10-gpt-5-6.svg)

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/)이 나왔습니다. 6월 프리뷰는 그냥 넘겼는데, 이번엔 ChatGPT Work랑 Codex 업데이트가 같이 올라와서 API만 볼 게 아니게 됐습니다. 벤치 숫자보다 파이프라인에 어떻게 붙일지가 궁금해서 그쪽 위주로 봤습니다.

> **적어 둠**
> 어떤 등급을 쓸지는 라우팅만 정리하면 되는 일입니다. 진짜 손볼 건 모델이 tool을 코드로 직접 호출하는 programmatic tool calling 쪽이라고 봅니다.
{: .callout-summary}

## 모델 이름부터 정리

버전은 5.6인데, 실제로 API에서 부르는 모델 이름은 Sol, Terra, Luna입니다. 숫자(5.6)는 세대를 뜻하고, Sol/Terra/Luna는 **성능과 가격이 다른 등급**입니다. 스마트폰으로 치면 5.6이 출시 연식이고 Sol/Terra/Luna가 Pro·기본·Lite 라인쯤 됩니다. 문서에서 `gpt-5.6`만 보고 고르면 어느 등급인지 안 나오니 이름을 같이 봐야 합니다.

| 모델 | 성격 | 이럴 때 | API 가격 (입력 / 출력, 100만 토큰) |
|------|------|---------|-----------------------------------|
| **Sol** | 제일 세고 제일 비쌈 | 어려운 추론, 마지막 합치기 | $5 / $30 |
| **Terra** | 중간 (5.5쯤) | 일반적인 reasoning | $2.50 / $15 |
| **Luna** | 제일 싸고 빠름 | 분류·플래닝·간단한 서브태스크 | $1 / $6 |

출력 토큰 기준으로 Sol이 Luna의 5배입니다. 파이프라인에서 호출 수가 많은 단계에 Sol을 그냥 꽂으면 비용이 금방 붑니다. 저라면 분류랑 플래닝은 Luna, 중간 단계는 Terra, 마지막 합치는 것만 Sol로 돌릴 것 같습니다. 아직 안 해봐서 이 배치가 맞는지는 모르겠습니다. sympo의 PRD→WBS 단계에 그대로 꽂아보면 어디서 Luna가 무너지는지 바로 보일 겁니다.

## tool calling을 코드로 넘긴다

이번에서 제일 눈에 띄는 건 programmatic tool calling입니다. 지금까지는 모델이 tool을 한 번에 하나씩 부르고, 그 결과를 다시 모델에 넣고, 또 부르는 식이었습니다. 5.6은 여러 tool 호출을 담은 JavaScript를 모델이 직접 써서, 격리된 V8 런타임에서 한 번에 돌립니다. 그 코드는 네트워크에 못 나갑니다.

멀티에이전트를 짜다 보면 "tool 호출 → 결과 받기 → 다시 모델 → 또 tool 호출" 왕복이 계속 쌓입니다. 이 왕복이 곧 토큰이고 지연입니다. 반복 루프를 모델이 쓴 코드 안으로 넣으면 왕복이 줄어들 텐데, 문제는 디버깅입니다. 지금은 오케스트레이션 로그를 보면 어느 스텝에서 틀렸는지 짚이는데, 그 로직이 생성된 코드 안으로 들어가면 추적이 더 까다로워질 것 같습니다. 이건 직접 붙여보기 전엔 감이 안 옵니다.

## 프롬프트 캐싱이 예측 가능해졌다

프롬프트 캐싱에 명시적 cache breakpoint가 생겼고, 캐시 최소 수명이 30분입니다. eval을 돌리면 긴 시스템 프롬프트랑 공통 컨텍스트를 수백 번 반복해서 넣는데, 지금까지는 캐시가 언제까지 살아 있는지가 애매해서 비용 예측이 잘 안 됐습니다. breakpoint를 직접 찍을 수 있으면 반복되는 구간의 비용이 그나마 계산됩니다. token-stack 카드에 캐시 적중률까지 찍히면 좋겠는데, 로그에 그 필드가 들어오는지부터 확인해야 합니다.

## ultra는 돈 구멍일 수도

에이전트 여러 개를 동시에 돌려 결과를 합치는 모드입니다. 스펙에는 concurrent workstream이라고 적혀 있습니다.

> **주의**
> 병렬 수만 늘리면 비용만 붑니다. 중간에 뭘 검증할지 없는 파이프라인이면 ultra는 답이 아니라 지출입니다.
{: .callout-warn}

오케스트레이션이 이미 병목인 경우에만 의미가 있을 텐데, 그게 맞는지는 eval 없이는 판단이 안 섭니다.

## Work는 뒤로 미룹니다

Codex 계열을 문서·시트·프레젠테이션에 붙인 제품입니다. Slack이나 Gmail 플러그인이 몇 개냐보다, 컨텍스트를 어디까지 긁어오는지가 궁금합니다. API를 Terra로 먼저 만져보고 Work는 그다음에 볼 생각입니다.

## Terra로 한번 돌려보기

multi-step 태스크 몇 개를 Terra로 시도해 볼 계획입니다. 호출은 대략 이렇습니다.

```bash
# Terra로 간단한 multi-step 요청 하나
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "messages": [{"role": "user", "content": "..."}]
  }'
```

먼저 할 일은 하나입니다. sympo 라우팅을 Luna/Terra/Sol로 나눠 붙이고, 같은 PRD로 5.5 때랑 토큰·지연·품질을 비교하는 것. 숫자가 나오면 여기에 이어 적겠습니다.

## 참고

- [OpenAI — GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI — Previewing GPT-5.6 Sol](https://openai.com/index/previewing-gpt-5-6-sol/)
- [MarkTechPost — 3-tier family, programmatic tool calling](https://www.marktechpost.com/2026/07/09/openai-releases-gpt-5-6-a-three-tier-model-family-with-programmatic-tool-calling/)
- [본인 repo — sympo](https://github.com/sukoji/sympo)
- [본인 repo — token-stack](https://github.com/sukoji/token-stack)
