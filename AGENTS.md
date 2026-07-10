# Agent notes — blog posts

블로그 글을 작성·수정할 때 **반드시** 다음을 읽고 따릅니다:

- [`docs/BLOG_WRITING.md`](docs/BLOG_WRITING.md) — 톤, 구조, callout, 표, 코드, 사실 확인, 커버 이미지 규칙
- [`_posts/_TEMPLATE.md`](_posts/_TEMPLATE.md) — front matter + 본문 뼈대
- [humanizer skill](.cursor/skills/humanizer/SKILL.md) — 초안 작성 후 AI 문체 패턴 제거·문장 다듬기

**글 작성을 에이전트에 통째로 맡길 땐** [`docs/WRITING_AGENT_PROMPT.md`](docs/WRITING_AGENT_PROMPT.md)의 프롬프트를 복사해 주제만 채워 넘긴다.

## 핵심

1. **사실 확인 먼저.** 모델·가격·날짜·기능은 web search로 1차 출처 확인 후 작성. 컷오프 이후 사건이면 검증 없이 쓰지 말 것.
2. 다른 글 문장 복붙 금지. 출처 링크 + 자기 말로 요약.
3. `summary` front matter 필수. `image`로 커버 이미지(16:9 SVG) 연결.
4. `callout-summary`, 표, 복붙 가능한 `bash` 블록 적극 사용.
5. 기술 용어는 영어 그대로(tool calling 등), 전문어는 한 번 쉽게 풀기. 내 프로젝트(sympo/token-stack) 관점으로 엮기.
6. 마케팅 문구·이모지·과한 bullet 금지.
7. 문체는 `~합니다`체. **초안 후 humanizer 스킬로 한 번 더 다듬기** (병렬 구조, 같은 `~합니다` 종결 3연속, "핵심/다음에 할 것" 같은 빈 제목 제거).
8. 태그는 2~4개, 프로젝트 태그와 겹치게(연결 그래프 `/graph/`가 태그로 잇는다).
9. 커밋/푸시는 사용자 지시 시. (로컬에 Ruby/Jekyll 없으면 빌드 생략, Pages가 push 때 빌드)
