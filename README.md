# sukoji.github.io

개인 이력·논문·블로그 사이트 (GitHub Pages + Jekyll)

## 구조

```
├── index.md              # 홈
├── about.md              # 소개
├── cv.md                 # 이력
├── publications.md       # 논문
├── blog.md               # 블로그 목록
├── _posts/               # 블로그 글 (마크다운)
├── _layouts/             # 페이지 레이아웃
├── _includes/            # 헤더, 푸터 등
└── assets/css/main.css   # 스타일
```

## 블로그 글 작성

`_posts/2025-07-15-글제목.md` 형식으로 파일 생성:

```markdown
---
layout: post
title: 글 제목
date: 2025-07-15
tags: [태그]
---

본문...
```

## 로컬 미리보기

```bash
bundle install
bundle exec jekyll serve
```

## 배포

`main` 브랜치에 push → GitHub Pages가 자동 빌드 → https://sukoji.github.io

Settings → Pages → Source: Deploy from branch (`main`, `/ (root)`)
