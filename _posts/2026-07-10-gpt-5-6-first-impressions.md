---
layout: post
title: "GPT-5.6에서 먼저 볼 것: 모델 등급보다 tool calling 경로"
date: 2026-07-10
category: news
tags: [gpt-5.6, llm, agents]
summary: GPT-5.6은 Sol·Terra·Luna 세 등급으로 나뉩니다. sympo에서는 모델 라우팅보다 programmatic tool calling의 관측 가능성이 먼저 검증할 항목입니다.
image: /assets/images/posts/2026-07-10-gpt-5-6.svg
---

![GPT-5.6: Sol, Terra, Luna](/assets/images/posts/2026-07-10-gpt-5-6.svg)

7월 9일 [GPT-5.6](https://openai.com/index/gpt-5-6/)이 일반 공개됐습니다. Sol, Terra, Luna라는 세 모델과 `ultra`, Programmatic Tool Calling이 같이 나왔습니다. 벤치마크 숫자보다 sympo의 PRD→WBS 파이프라인에서 호출 경로가 어떻게 달라지는지가 먼저 궁금했습니다.

> **적어 둠**
> Sol·Terra·Luna의 라우팅은 측정으로 조정할 수 있습니다. 반면 Programmatic Tool Calling은 중간 결과와 실패 지점을 어떻게 남길지까지 바꾸므로, sympo에는 작은 실험부터 붙여야 합니다.
{: .callout-summary}

## 모델 등급: Sol · Terra · Luna

5.6은 세대 이름이고 Sol, Terra, Luna는 성능과 가격이 다른 모델 등급입니다. 공식 발표에서는 Sol을 flagship, Terra를 일상 작업용 균형 모델, Luna를 가장 빠르고 저렴한 모델로 설명합니다. API 비용도 이 등급을 따라 달라집니다.

| 모델 | 성격 | 이럴 때 | API 가격 (입력 / 출력, 100만 토큰) |
|------|------|---------|-----------------------------------|
| **Sol** | 제일 세고 제일 비쌈 | 어려운 추론, 마지막 합치기 | $5 / $30 |
| **Terra** | 중간 (5.5쯤) | 일반적인 reasoning | $2.50 / $15 |
| **Luna** | 제일 싸고 빠름 | 분류·플래닝·간단한 서브태스크 | $1 / $6 |

출력 토큰 가격만 보면 Sol은 Luna의 다섯 배입니다. 호출 수가 많은 단계에 Sol을 기본값으로 두기 전에, 같은 PRD 묶음에서 품질·입출력 토큰·지연 시간을 함께 재야 합니다. sympo에서는 분류와 초안 분해를 Luna 또는 Terra로, 최종 병합을 Sol로 두는 실험부터 할 생각입니다. 이 배치가 좋은지는 아직 모릅니다. 태스크 누락률과 의존성 오류가 어느 단계에서 늘어나는지 봐야 합니다.

## Programmatic tool calling

이번에 먼저 확인할 기능은 Programmatic Tool Calling입니다. GPT-5.6은 Responses API에서 tool을 조정하고 중간 결과를 처리하는 프로그램을 메모리 안에서 작성하고 실행할 수 있습니다. 큰 tool 결과에서 필요한 값만 남기거나, 다음 호출을 고르는 일을 모델 호출 사이가 아니라 그 프로그램 안에서 처리하는 방식입니다.

멀티에이전트에서는 `tool 호출 → 결과 → 다음 모델 호출` 왕복이 금방 길어집니다. Programmatic Tool Calling이 그 왕복과 전달 토큰을 줄일 수 있다는 점은 분명합니다. 대신 sympo에서는 실패 원인을 찾기 어려워질 수 있습니다. 지금은 orchestration 로그에서 분해, 검증, 병합 중 어디가 틀렸는지 볼 수 있는데, 중간 선택이 생성 프로그램 안으로 들어가면 입력·선택·출력을 따로 남겨야 합니다. 비용 절감만 보고 바로 옮길 일은 아닙니다.

| 확인할 것 | 남길 로그 | 중단 기준 |
|------|------|------|
| 토큰·지연 | 요청별 입력·출력 토큰, 총 시간 | 기존 경로보다 비용만 늘어날 때 |
| 결과 품질 | WBS 누락, 의존성 순환, 사람 검토 결과 | 같은 PRD에서 오류가 늘어날 때 |
| 관측 가능성 | tool 입력, 선택한 분기, 축약 전후 값 | 실패 원인을 한 요청 안에서 못 찾을 때 |

## Prompt caching

GPT-5.6부터는 `prompt_cache_options.ttl`로 cache breakpoint의 최소 수명을 지정할 수 있고, 현재 지원값은 기본값이기도 한 `30m`입니다. 반복 eval에서 시스템 프롬프트와 공통 PRD 컨텍스트를 매번 보내는 sympo에는 반가운 변화입니다. 다만 캐시가 얼마나 오래 남는지가 아니라, 요청별 cache read 토큰과 비용을 실제 응답에서 수집할 수 있는지가 먼저입니다. token-stack 카드에 적중률을 넣기 전, 로그 스키마부터 확인하겠습니다.

## ultra 병렬 모드

`ultra`는 복잡한 작업을 위해 여러 agent workstream을 병렬로 조정하는 고성능 설정입니다. 공식 발표 기준으로 기본값은 네 agent입니다.

> **주의**
> 병렬 수만 늘리면 비용만 붑니다. 중간에 뭘 검증할지 없는 파이프라인이면 ultra는 답이 아니라 지출입니다.
{: .callout-warn}

sympo에 필요한지는 별개입니다. 분해 후보를 여러 개 만들고 judge로 고르는 단계가 실제 병목인지, 한 후보를 더 오래 다듬는 편이 나은지 같은 PRD 셋으로 비교해야 합니다.

## sympo에서 먼저 돌릴 비교

같은 PRD 20개를 기존 경로와 Terra 경로에 각각 넣고, 아래 네 값을 비교합니다. 평균만 보면 긴 입력 한두 개가 결과를 가릴 수 있으므로 중앙값과 최댓값도 같이 남깁니다.

| 항목 | 이유 |
|------|------|
| WBS 누락·의존성 오류 | 결과가 실제로 깨졌는지 확인 |
| 사람 검토 통과율 | 형식 검증이 놓치는 품질 확인 |
| 요청당 토큰과 비용 | 라우팅과 cache의 효과 확인 |
| 종료까지 걸린 시간 | 왕복 감소가 체감 지연으로 이어지는지 확인 |

호출은 Responses API로 시작합니다.

```bash
# Terra에 PRD 하나를 보내는 최소 요청
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-terra",
    "input": "아래 PRD를 WBS로 분해하세요: ..."
  }'
```

처음에는 Programmatic Tool Calling을 전체 파이프라인에 넣지 않습니다. 결과가 큰 tool 하나에서 필요한 필드만 고르는 좁은 경로에 붙이고, 기존 방식과 같은 PRD를 돌리겠습니다. 숫자가 쌓이면 라우팅과 로그 구조를 같이 바꾸겠습니다.

## 참고

- [OpenAI: GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI API: Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
- [OpenAI API: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [본인 repo: sympo](https://github.com/sukoji/sympo)
- [본인 repo: token-stack](https://github.com/sukoji/token-stack)
