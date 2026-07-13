---
layout: post
title: "LLM-as-judge를 믿어도 되나"
date: 2026-07-13
tags: [eval, agents, llm-as-judge]
summary: 판정자도 앞자리·긴 답·자기 계열을 편애합니다. 믿기 전에 사람이 라벨한 작은 셋에 먼저 맞춰봐야 합니다.
image: /assets/images/posts/2026-07-13-trusting-llm-judge.svg
---

![기울어진 저울로 표현한 LLM-as-judge의 편향](/assets/images/posts/2026-07-13-trusting-llm-judge.svg)

앞의 두 글에서 저는 LLM-as-judge(모델이 다른 모델의 출력을 채점하게 하는 방식)를 값싼 1차 검증으로 자주 썼습니다. 섀도우 로그를 훑을 때도, 스텝마다 출력을 거를 때도 판정을 사람 대신 모델에 맡겼습니다. 그런데 정작 그 판정자가 제대로 매기는지는 따로 확인한 적이 없었습니다.

> **적어 둠**
> 판정자도 편향됩니다. 앞에 놓인 답을 편애하고(position), 긴 답을 후하게 주고(verbosity), 자기 계열 출력을 높게 봅니다(self-preference). 판정을 믿으려면 사람이 라벨한 작은 셋에 판정자를 먼저 맞춰봐야 합니다.
{: .callout-summary}

## 판정자가 틀리는 세 방식

같은 답이라도 어디에 놓느냐, 얼마나 기냐, 누가 만들었냐에 따라 점수가 흔들립니다.

| 편향 | 증상 | 완화 |
|------|------|------|
| **position** | A/B 중 앞자리를 편애 | 순서 바꿔 두 번 채점(swap), 뒤집히면 사람에게 |
| **verbosity** | 내용과 무관하게 긴 답을 후하게 | 길이 페널티를 프롬프트에 명시 |
| **self-preference** | 자기 계열 모델 출력을 높게 | 판정 모델과 후보 모델 분리, 신원 마스킹 |

position과 verbosity는 MT-Bench 논문에서 처음 정리된 뒤로 잘 알려진 실패 모드입니다. self-preference는 판정자가 평가 대상에 자기 자신이 섞일 때 특히 두드러집니다. 셋 다 "판정자가 답의 질이 아니라 형식이나 출처에 반응한다"는 같은 문제의 다른 얼굴입니다.

## 판정을 검증하는 법

판정자를 믿기 전에, 사람이 직접 라벨한 작은 셋에 먼저 맞춰봅니다. 판정자와 사람의 일치율(Cohen's kappa 같은 지표)이 낮으면 그 판정은 신호가 아니라 잡음입니다. 숫자 몇 개라도 이 일치율을 재 두면, 판정을 어디까지 믿을지 감이 생깁니다.

position bias는 코드로 바로 거를 수 있습니다. 같은 쌍을 순서만 바꿔 두 번 채점하고, 판정이 뒤집히면 그 건은 사람에게 넘깁니다.

```python
# 같은 쌍을 순서만 바꿔 두 번 채점 → 승자가 바뀌면 순서에 휘둘린 판정
def robust_judge(judge, a, b):
    w1 = judge(a, b)          # 슬롯 A=a, B=b
    w2 = judge(b, a)          # 순서만 스왑 (A=b, B=a)
    if w1 == w2:              # 두 번 다 같은 답을 고르면 신뢰
        return w1
    return "needs_human"      # 순서 따라 승자가 바뀌면 사람 게이트로
```

분산이 큰 판정은 같은 입력을 여러 번 돌려 다수결로 누그러뜨릴 수 있습니다. 다만 이건 편향이 아니라 흔들림을 줄이는 것이라, 판정자가 애초에 한쪽으로 치우쳐 있으면 여러 번 돌려도 그대로 치우칩니다.

## sympo의 판정자

sympo는 PRD를 넣으면 여러 후보 WBS가 나오고, 그중 판정자가 낫다고 본 걸 고릅니다. 처음엔 후보를 만든 모델과 판정 모델이 같았는데, 이러면 self-preference가 낍니다. 그래서 판정자는 후보 생성과 다른 모델로 두고, 어느 에이전트가 만든 후보인지 신원을 가린 채 채점하게 바꿨습니다.

아직 사람 라벨 셋이 작아서 일치율 숫자는 못 냈습니다. 그래서 지금 판정자 점수는 "고른 근거" 정도로만 보고, 최종 채택은 사람이 한 번 더 봅니다.

> **주의**
> 판정자-사람 일치율을 안 재고 LLM-as-judge 점수를 리더보드처럼 쓰면, 편향을 성능으로 착각합니다. 점수가 올라도 실제로 나아졌는지는 별개입니다.
{: .callout-warn}

## 다음: 사람 라벨 50쌍으로 일치율 재기

sympo가 고른 WBS 50쌍에 제 판정을 붙이고, 판정자와의 kappa를 재볼 생각입니다. 일치가 낮게 나오는 유형은 사람 게이트로 남기고, 높은 유형만 판정자에 맡기려 합니다. token-stack으로 판정 로그를 유형별로 묶으면 어느 쪽이 자주 어긋나는지 보일 겁니다. 숫자가 나오면 여기 이어 적겠습니다.

## 참고

- [Zheng et al. — Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [Self-Preference Bias in LLM-as-a-Judge](https://arxiv.org/abs/2410.21819)
- [본인 repo — sympo](https://github.com/sukoji/sympo)
- [본인 repo — multi-agent-paper-log](https://github.com/sukoji/multi-agent-paper-log)
