---
tags: 
  - api calls
---

# Architecture

- MVC inspired.

***Note*** This section is a working draft / POC project architecture.

## Models

`@/interfaces`

TBD... Typescript? 

## Controllers 

`@/controllers`

A place for all API calls. Shareable and easy to [mock](/testing.html#testing-api-interactions) in Unit Tests.

```js
// @/controllers/part.js
import http from "@/http"

export const getPartsList = async () => {
  return http.get(`/admin/parts`) // don't result pick if you need response headers
}

export const getPart = async (partId) => {
  return http.get(`/admin/parts/${partId}`).then(res => res.data)
}

export const updatePart = async (partId, data) => {
  return http.put(`/admin/parts/${partId}`, data).then(res => res.data)
}

export const createPart = async (partId, data) => {
  return http.post(`/admin/parts/${partId}`, data).then(res => res.data)
}

export const deletePart = async (partId) => {
  return http.delete(`/admin/parts/${partId}`, data).then(res => res.data)
}
```

Then exported from the barrel: 

```js
// @/controllers/index.js
export * from "./part"
```

## Views

`@/views`

The views directory should try to follow the site-map / UI hierarchy. 

```
src-
 |- views-
    |- admin
      |- dashboard
      |- content
        |- parts 
          |- part creator
          |- part detail
            |- info
            |- comments
            |- related
            |- attachments
            |- pages where used
            |- media where used
            |- pricing
            |- order suggestions
        |- pages 
          |- page creator
          |- page detail
            |- info
            |- illustration
            |- comments
            |- related
            |- attachments
            |- where used
        |- media 
          |- media creator
          |- media detail
            |- info
            |- table of contents
            |- access controls
            |- comments
            |- related
            |- attachments
            |- print settings
        |- templates 
          |- template creator
          |- template detail
            |- info
            |- access controls
            |- comments
            |- related
            |- attachments
        |- process content
        |- media categories
          |- media category detail
        |- part codes
        |- default images
        |- print settings
      |- users
        |- users
          |- user creator
          |- user detail
            |- info
            |- addresses
            |- user groups
        |- organizations
          |- organization creator
          |- organization detail
            |- info
            |- addresses
            |- users
            |- reports
            |- print settings
            |- styles
            |- parts list columns
            |- library settings
            |- order layouts
            |- email recipients
            |- integrations
            |- storefront settings
        |- user groups
          |- user group creator
          |- user group detail
            |- info
            |- users
            |- media categories
      |- library admin
        |- tags
          |- tag creator
          |- tag detail
            |- info
            |- access controls
        |- news items
          |- news item creator
          |- news item detail
        |- labels
          |- label creator
          |- label detail
        |- dynamic naming
        |- styles
        |- browse flows
        |- parts list columns
        |- library settings
      |- storefront
        |- order form fields
        |- order form layouts
        |- order statuses
        |- order email formats
        |- order email recipients
        |- integrations
        |- storefront settings
      |- reports
      |- exporter
      |- settings
      |- super admin
    |- library
      |- home
      |- news items
      |- job manager
      |- settings
      |- feedback
      |- help
      |- about
      |- cart
      |- search
      |- book
        |- landing (TOC?)
        |- info
        |- comments
        |- related
        |- chapter
          |- info
          |- comments
          |- related
          |- page
            |- illustration
            |- info
            |- comments
            |- related
            |- where used
      |- page
        |- illustration
        |- info
        |- comments
        |- related
        |- where used
      |- part
        |- info
        |- comments
        |- related
        |- where used
        |- suggestions
      |- document
        |- landing
        |- info
        |- comments
        |- related
```