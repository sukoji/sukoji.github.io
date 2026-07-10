# Agent notes — blog posts

블로그 글을 작성·수정할 때 **반드시** 다음을 읽고 따른다:

- [`docs/BLOG_WRITING.md`](docs/BLOG_WRITING.md) — 톤, 구조, callout, 표, 코드 블록 규칙
- [`_posts/_TEMPLATE.md`](_posts/_TEMPLATE.md) — front matter + 본문 뼈대
- [humanizer skill](.cursor/skills/humanizer/SKILL.md) — 초안 작성 후 AI 문체 패턴 제거·문장 다듬기

## 핵심

1. 다른 글 문장 복붙 금지. 출처 링크 + 자기 말로 요약.
2. `summary` front matter 필수.
3. `callout-summary`, 표, 복붙 가능한 `bash` 블록 적극 사용.
4. 마케팅 문구·이모지·과한 bullet 금지.
5. **초안 후 humanizer 스킬로 한 번 더 다듬기** (병렬 구조, ~합니다 체 연속, "핵심/다음에 할 것" 같은 빈 제목 제거).
6. 로컬에서 `bundle exec jekyll serve`로 확인 후 push.
