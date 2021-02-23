---
tags: 
  - install
  - setup
  - init
  - deploy
  - build
  - compile
  - start
---

# Guide

## System Requirements

- [Node.js - 14x](https://nodejs.org/en/)

## Getting Started

1. Setup Services. Turbo, Solr, etc.

```
TODO: GET LINKS
```

2. Install Dependencies

```
npm ci
```

3. Start Dev Server

```
npm run serve
```

App will be available at [http://localhost/ui/](http://localhost/ui/)

## Production

### Static / CDN

If you're manually deploying the site, first, check that the `.env` file has the correct values. Then run build: 

```
npm run build
```

Static files will be outputted to `/dist`. From here, you can upload the files to an S3 bucket with static hosting enabled or another static hosting service like Netlify.

### Jenkins

```
Need to confirm Jenkins workflow
```

In pipeline, 

- Clone repo
- Install all project dependencies
```
npm ci
```
- Run lint
```
npm run lint
```
- Run unit tests
```
npm run test:unit
```
- Build app
```
npm run build
```
- Remove development dependencies
```
npm ci --production
```