---
layout: post
title: "GPT-5.6 출시 메모: Sol·Terra·Luna와 에이전트 시대의 다음 레이어"
date: 2026-07-10
tags: [llm, gpt-5.6, agents, notes]
---

7월 9일, OpenAI가 [GPT-5.6 패밀리](https://openai.com/index/gpt-5-6/)를 정식 공개했다. 6월 26일부터 이어진 limited preview를 거쳐 Sol·Terra·Luna 세 티어로 GA에 들어갔고, 같은 날 [ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)도 함께 나왔다.

벤치마크 숫자를 나열하는 글은 이미 많을 테니, 멀티에이전트 쪽에서 일하는 입장에서 **무엇이 실제로 바뀌는지**만 짧게 정리해 본다.

## 세 티어가 의미하는 것

GPT-5.6은 세대 번호(5.6)와 능력 티어(Sol / Terra / Luna)를 분리한 구조다.

| 모델 | 포지션 | 대략적인 가격 (API) |
|------|--------|---------------------|
| **Sol** | 플래그십 | $5 / $30 per 1M tokens |
| **Terra** | 일상 업무용, 5.5급 성능·저비용 | $2.50 / $15 |
| **Luna** | 가장 빠르고 저렴 | $1 / $6 |

연구나 에이전트 파이프라인을 짤 때는 "항상 최상위 모델"이 정답이 아니다. 라우팅·플래닝·서브태스크 분해에 Luna/Terra를 쓰고, 최종 합성이나 난이도 높은 reasoning에 Sol을 쓰는 식의 **tiered orchestration**이 더 현실적이다. GPT-5.5 대비 토큰 효율이 좋아졌다는 [발표](https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/)를 보면, 같은 예산으로 더 긴 에이전트 체인을 돌릴 여지가 생긴 셈이다.

## Sol Ultra와 병렬 에이전트

Sol에는 `ultra` 설정이 붙어, 여러 에이전트를 병렬로 돌리고 결과를 합치는 모드가 있다. 단일 프롬프트 품질 경쟁을 넘어 **동시 workstream**이 제품 스펙으로 올라온 점이 눈에 띈다.

다만 "에이전트를 많이 돌린다"와 "일이 잘 끝난다"는 다르다. eval harness, 중간 산출물 검증, human-in-the-loop 지점 설계가 없으면 병렬화는 비용만 키운다. sympo 같은 PRD→WBS 파이프라인에서 이미 보는 패턴과 같다 — 모델이 좋아질수록 **오케스트레이션과 평가** 쪽이 병목이 된다.

## ChatGPT Work

ChatGPT Work는 Codex 계열 능력을 비개발 업무(문서, 스프레드시트, 프레젠테이션)로 끌어내린 제품이다. Slack, Gmail, Drive 등과 연결되는 unified plugins directory가 핵심이다.

연구자 입장에서는 흥미로운 지점이 두 가지다.

1. **컨텍스트 수집 범위** — 파일·앱·워크플로에서 맥락을 끌어오는 방식이 RAG 파이프라인과 어디서 겹치고 어디서 다른지
2. **완성본 산출** — 중간 초안이 아니라 "finished materials"를 목표로 한다는 프레이밍

에이전트가 도구를 쓰는 것과, 도구 생태계 전체를 흡수하는 것은 다른 문제다. 후자로 갈수록 로컬 eval과 재현 가능한 벤치마크가 더 중요해진다.

## 사이버 보안 논쟁 이후의 출시

GPT-5.6은 preview 기간 동안 정부 승인 조직에만 제한 배포되기도 했고, 사이버 보안 능력을 둘러싼 논의가 있었다. [The Verge](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work) 보도에 따르면 방어적 활용(위협 모델링, 코드 리뷰, 패칭)을 강조하면서 public rollout이 이뤄졌다.

모델 카드와 실제 misuse surface를 분리해서 보는 습관은 여전히 필요하다. "가장 강한 사이버 모델"이라는 마케팅과, 내가 설계하는 시스템의 trust boundary는 별개다.

## 정리

GPT-5.6은 **단일 모델 업그레이드**라기보다 **티어드 모델 + 병렬 에이전트 + 워크스페이스 에이전트**를 한 번에 밀어붙인 릴리스에 가깝다.

당장 체감할 변화는:

- API 비용 구조가 세분화되면서 에이전트 라우팅 설계가 더 중요해짐
- Codex / ChatGPT / Work 경계가 흐려지면서 "어디서 무엇을 평가할지"가 어려워짐
- 벤치마크는 오를 테지만, 신뢰·사용성·실패 모드는 여전히 직접 까봐야 알 수 있음

다음 주에는 Luna/Terra로 간단한 multi-step 태스크를 돌려 보고, 토큰 사용량과 실패 패턴을 [token-stack](https://github.com/sukoji/token-stack)으로 로그해 볼 예정이다. 숫자보다 로그가 낫다.

---

**참고**

- [OpenAI — GPT-5.6](https://openai.com/index/gpt-5-6/)
- [OpenAI — ChatGPT Work](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- [TechCrunch](https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/)
- [The Verge](https://www.theverge.com/ai-artificial-intelligence/963464/openai-gpt-5-6-codex-chatgpt-work)
