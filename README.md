# sukoji.github.io

[Seokho Jin](https://sukoji.github.io) 개인 사이트 — 이력, 논문, 블로그.

**Live** · https://sukoji.github.io  
**Stack** · Jekyll + GitHub Pages

## 구조

```
├── _config.yml           # 사이트 설정
├── _data/                # 이력·프로젝트·논문 데이터
│   ├── experience.yml
│   ├── projects.yml
│   └── publications.yml
├── _posts/               # 블로그 글
├── _layouts/             # 페이지 레이아웃
├── _includes/            # 헤더, 푸터, 컴포넌트
├── assets/               # CSS, JS
├── index.md              # 홈
├── about.md              # 소개
├── cv.md                 # 이력
├── publications.md       # 논문
└── blog.md               # 블로그 목록
```

## 콘텐츠 수정

| 파일 | 내용 |
|------|------|
| `_data/experience.yml` | 학력, 경력, 기술 |
| `_data/projects.yml` | 프로젝트 카드 |
| `_data/publications.yml` | 논문 목록 |
| `_posts/*.md` | 블로그 글 |
| `_config.yml` | 이름, 이메일, GitHub 링크 |
| `assets/images/profile.jpg` | 프로필 사진 (본인 사진으로 교체) |

### 논문 추가 예시 (`_data/publications.yml`)

```yaml
conferences:
  - year: 2026
    title: "논문 제목"
    authors: "Seokho Jin, et al."
    venue: "학회명 2026"
    abstract: "초록 (선택)"
    links:
      - label: PDF
        url: "https://..."
      - label: Code
        url: "https://github.com/sukoji/..."
```

### 블로그 글 추가

`_posts/2025-07-15-제목.md`:

```yaml
---
layout: post
title: 글 제목
date: 2025-07-15
tags: [태그]
---
```

`main` 브랜치에 push하면 GitHub Pages가 자동 배포됩니다.

## 로컬 미리보기

```bash
bundle install
bundle exec jekyll serve
```

http://localhost:4000

## License

MIT — see [LICENSE](LICENSE).
