---
layout: post
title: "GPT-5.6에서 먼저 볼 것: 모델 등급보다 tool calling 경로"
date: 2026-07-10
category: news
tags: [gpt-5.6, llm, agents]
summary: GPT-5.6은 Sol·Terra·Luna 세 등급으로 나뉩니다. 등급을 고르는 일보다 Programmatic Tool Calling이 호출 경로와 로그를 어떻게 바꾸는지가 먼저 볼 지점입니다.
image: /assets/images/posts/2026-07-10-gpt-5-6.svg
---

![GPT-5.6: Sol, Terra, Luna](/assets/images/posts/2026-07-10-gpt-5-6.svg)

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/)이 일반 공개됐습니다. Sol, Terra, Luna라는 세 모델과 `ultra`, Programmatic Tool Calling이 같이 나왔습니다. 벤치마크 숫자는 발표 자료에 충분히 실려 있으니, 여기서는 에이전트를 붙여 쓰는 쪽에서 실제로 달라지는 지점만 봅니다.

> **적어 둠**
> 등급 선택은 나중에 측정으로 조정할 수 있습니다. Programmatic Tool Calling은 중간 결과와 실패 지점이 어디에 남는지까지 바꾸므로, 붙이기 전에 로그 구조를 먼저 정해야 합니다.
{: .callout-summary}

## 모델 등급: Sol · Terra · Luna

5.6은 세대 이름이고 Sol, Terra, Luna는 성능과 가격이 다른 모델 등급입니다. 공식 발표에서는 Sol을 flagship, Terra를 일상 작업용 균형 모델, Luna를 가장 빠르고 저렴한 모델로 설명합니다.

| 모델 | 성격 | 이럴 때 | 출시가 (입력/출력, 100만 토큰) |
|------|------|---------|-------------------------------|
| **Sol** | 제일 세고 제일 비쌈 | 어려운 추론, 마지막 합치기 | $5 / $30 |
| **Terra** | 중간 (5.5쯤) | 일반적인 reasoning | $2.50 / $15 |
| **Luna** | 제일 싸고 빠름 | 분류·플래닝·간단한 서브태스크 | $1 / $6 |

> **갱신 (2026-08)**
> 출시 3주 뒤인 7월 30일 OpenAI가 [Luna를 80%, Terra를 20% 인하](https://www.cnbc.com/2026/07/30/open-ai-price-cut-gpt.html)했습니다. Luna는 $0.20 / $1.20, Terra는 $2 / $12가 됐고 Sol은 그대로입니다. 이 글의 등급 배치 판단은 인하 전 가격을 기준으로 쓴 것입니다.
{: .callout-warn}

인하 전에도 출력 토큰 기준으로 Sol은 Luna의 다섯 배였는데, 인하 뒤에는 스물다섯 배로 벌어졌습니다. 호출 수가 많은 단계에 어떤 등급을 두느냐가 처음보다 훨씬 크게 작용한다는 뜻입니다. 분류나 초안 분해처럼 호출이 잦고 판단이 단순한 자리는 Luna나 Terra로 내리고, 마지막 병합처럼 한 번 틀리면 전체가 흔들리는 자리만 Sol로 두는 배치가 자연스럽습니다. 다만 어느 단계에서 품질이 실제로 꺾이는지는 같은 입력 묶음으로 재 보기 전에는 알 수 없습니다.

## Programmatic tool calling

이번 발표에서 구조를 가장 크게 바꾸는 건 Programmatic Tool Calling입니다. GPT-5.6은 Responses API에서 tool을 조정하고 중간 결과를 처리하는 프로그램을 메모리 안에서 작성하고 실행할 수 있습니다. 큰 tool 결과에서 필요한 값만 남기거나 다음 호출을 고르는 일을, 모델 호출 사이가 아니라 그 프로그램 안에서 처리하는 방식입니다.

멀티에이전트에서는 `tool 호출 → 결과 → 다음 모델 호출` 왕복이 금방 길어집니다. OpenAI가 공개한 수치로는 같은 품질을 유지하면서 출력 토큰 24%, 완료 시간 28%를 줄였고, 이름을 밝힌 고객 사례에서는 토큰 절감이 38~63.5%까지 올라갑니다. 절감 폭 자체는 분명합니다.

문제는 관측 가능성입니다. 지금은 orchestration 로그에서 분해·검증·병합 중 어디가 틀렸는지 볼 수 있지만, 중간 선택이 생성된 프로그램 안으로 들어가면 그 경계가 사라집니다. 프로그램의 입력, 고른 분기, 축약 전후 값을 따로 남기지 않으면 실패 원인을 한 요청 안에서 찾을 수 없습니다. 비용 절감만 보고 전체 파이프라인을 옮길 일은 아니고, 결과가 큰 tool 하나에서 필요한 필드만 고르는 좁은 경로부터 붙여 보는 편이 안전합니다.

## Prompt caching

GPT-5.6부터는 `prompt_cache_options.ttl`로 cache breakpoint의 최소 수명을 지정할 수 있고, 현재 지원값은 기본값이기도 한 `30m`입니다. 캐시 쓰기는 해당 모델의 미캐시 입력 요금의 1.25배로 과금됩니다. 반복 eval처럼 시스템 프롬프트와 공통 컨텍스트를 매번 보내는 작업이라면 효과가 큽니다. 다만 캐시가 얼마나 오래 남는지보다, 요청별 cache read 토큰과 그 비용을 응답에서 실제로 수집할 수 있는지가 먼저입니다. 적중률을 지표로 쓰려면 로그 스키마부터 맞아야 합니다.

## ultra 병렬 모드

`ultra`는 복잡한 작업을 위해 여러 agent workstream을 병렬로 조정하는 고성능 설정입니다. 공식 발표 기준으로 기본값은 네 agent이고, Terminal-Bench 2.1에서 88.8%를 91.9%로 올렸습니다.

> **주의**
> 병렬 수만 늘리면 비용만 늘어납니다. 중간에 무엇을 검증할지 정하지 않은 파이프라인이면 ultra는 답이 아니라 지출입니다.
{: .callout-warn}

3%p를 위해 네 배의 호출을 감당할 값어치가 있는지는 작업마다 다릅니다. 후보를 여러 개 만들고 고르는 단계가 실제 병목인지, 한 후보를 더 오래 다듬는 편이 나은지 먼저 확인할 문제입니다.

## 직접 확인할 때 볼 값

발표 자료의 벤치마크는 내 입력 분포를 대신해 주지 않습니다. 같은 입력 묶음을 기존 경로와 새 경로에 각각 넣고 아래 값을 비교하는 편이 빠릅니다. 평균만 보면 긴 입력 한두 개가 결과를 가리므로 중앙값과 최댓값도 같이 남깁니다.

| 항목 | 이유 |
|------|------|
| 출력의 형식·제약 위반 | 결과가 실제로 깨졌는지 확인 |
| 사람 검토 통과율 | 형식 검증이 놓치는 품질 확인 |
| 요청당 토큰과 비용 | 등급 배치와 cache의 효과 확인 |
| 종료까지 걸린 시간 | 왕복 감소가 체감 지연으로 이어지는지 확인 |

호출은 Responses API로 시작합니다.

```bash
# Terra에 요청 하나를 보내는 최소 형태
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "input": "..."
  }'
```

## 참고

- [OpenAI: GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI API: Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
- [OpenAI API: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [CNBC: OpenAI cuts prices for two of its GPT-5.6 AI models (2026-07-30)](https://www.cnbc.com/2026/07/30/open-ai-price-cut-gpt.html)
