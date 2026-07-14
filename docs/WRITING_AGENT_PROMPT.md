# 글쓰기 에이전트에 넘기는 프롬프트

새 글을 에이전트한테 맡길 때, 아래 프롬프트를 그대로 복사하고 `{{주제}}` 자리만 채워서 준다. 이 저장소 안에서 실행하는 에이전트를 전제로 한다 (파일 읽기 가능).

---

## 복사해서 쓰는 프롬프트

```
sukoji.github.io 블로그에 새 글을 쓴다. 주제: {{주제}}

먼저 이 문서들을 읽고 그대로 따른다:
- docs/BLOG_WRITING.md  (톤·구조·callout·표·코드·사실확인·커버이미지 규칙)
- _posts/_TEMPLATE.md   (front matter + 본문 뼈대)
- .cursor/skills/humanizer/SKILL.md  (초안 후 AI 문체 제거)
- 최근 예시: _posts/ 안의 최신 글 1개 (톤·포맷 맞추기)

작성 순서:
1. 사실 확인 먼저. 모델·가격·날짜·기능 등은 web search로 1차 출처 확인.
   지식 컷오프 이후 사건이면 검증 없이 쓰지 말 것. 확인한 출처는 참고 링크에 넣는다.
2. 초안 작성. ~합니다체. 불확실성("아직", "~일 것 같습니다").
   기술 용어는 영어 그대로(tool calling, prompt caching, eval …), 조사만 한글.
   처음 나오는 전문어는 한 번 쉽게 풀어준다(비유 하나면 충분).
   문체는 category에 맞춘다(BLOG_WRITING.md 2.6): deepdive/news는 주제 중심,
   내 프로젝트(sympo/token-stack)를 억지로 끌어오지 않고 원문·출처 링크로 닫는다.
   1인칭 경험과 프로젝트 연결·"다음 액션" 엔딩은 log(내 작업 기록)에서만 쓴다.
3. humanizer 기준으로 다듬는다: 병렬 구조, 같은 종결 3연속, 빈 섹션 제목,
   em dash, rule-of-three, 마케팅 수식어 제거.
4. front matter 채운다: layout: post, title(구체적·검색가능), date,
   category(deepdive/news/log 중 하나 — 논문 심층 리뷰면 deepdive, 새 모델 소식이면
   news, 내 프로젝트 작업기록이면 log), tags(2~4개, 프로젝트 태그와 겹치게),
   summary(80자), image(아래 6번).
5. callout-summary 1개 + 표 또는 복붙 가능한 bash 블록 중 최소 1개.
6. 커버 이미지: assets/images/posts/YYYY-MM-DD-slug.svg 로 16:9(viewBox 0 0 1600 900)
   SVG 생성. 로고·상표 복제 금지 → 자체 제작 추상 마크. front matter image에 연결하고
   본문 맨 위에도 ![alt](경로)로 히어로 삽입.
7. 파일명 _posts/YYYY-MM-DD-slug.md 로 저장.

마지막에 docs/BLOG_WRITING.md 의 체크리스트로 self-check 한 줄씩 확인 결과를 보고한다.
로컬 빌드는 안 돌려도 됨(GitHub Pages가 push 시 빌드). 커밋/푸시는 사용자가 지시할 때만.
```

---

## 왜 이 순서인가 (에이전트가 놓치기 쉬운 것)

- **사실 확인을 초안보다 먼저** 두는 게 핵심. GPT-5.6 글은 컷오프 이후 사건이라 검색 없이 썼으면 전부 환각이었다. 그럴듯함 ≠ 사실.
- **영어 용어 유지**. 억지 음차("툴콜")는 오히려 없어 보인다. 대신 전문어는 한 번 풀어준다.
- **문체는 category별로**. deepdive/news는 주제 자체로 완결한다. sympo/token-stack을 억지로 끌어오면 티가 난다. 프로젝트 관점은 log 글의 몫.
- **커버 이미지 16:9**. 카드가 `object-fit: cover`라 비율 안 맞으면 잘린다.
- **태그를 프로젝트와 겹치게**. `/graph/` 연결 그래프가 태그로 글·프로젝트를 잇는다.

## 넘기기 전에 사람이 정할 것

- 주제와 각도(무엇을, 왜 지금).
- 실제 실험·수치가 있으면 같이 준다 (있으면 글이 훨씬 좋아짐).
- 커버 이미지 방향(추상 마크 / 스크린샷 / 다이어그램).
