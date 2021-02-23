---
tags: 
  - vuex
---

# State Management

POC / Ideas

## Model

Each module should have three core state properties: loading, data, and error.

```js
export default {
  namespaced: true,
  state: {
    data: null,
    loading: false,
    error: null
  }
}
```

## Actions

- controllers abstracted for easier testing modules.
- how can we keep this DRY without too much abstraction

```js
// @/store/actions.js

const actionsHelper = ({get, update, create, delete}) => {
  return {
    async getProperty(context, data) {
      context.commit('DATA_REQUEST')
      try {
        const result = await get(data)
        context.commit('DATA_SUCCESS', result)
      } catch (error) {
        context.commit('DATA_ERROR', error)
      }
    },
    async updateProperty(context, data) {
      try {
        context.commit('UPDATE_REQUEST')
        const result = await update(data)
        context.commit('UPDATE_SUCCESS')
      } catch (error) {
        context.commit('UPDATE_ERROR', error)
      }
    }
  }
}
```

```js
// @/store/modules/part.js
import actionsHelper from "../actions"
import mutations from "../mutations"
import {getPart, updatePart, createPart, deletePart} from "@/controllers"

export default {
  namespaced: true,
  state: {
    data: null,
    loading: false,
    error: null
  },
  actions: {
    ...actionsHelper({
      get: getPart,
      update: updatePart,
      create: createPart, 
      delete: deletePart
    }),
    async anotherAction () {
      // stuff
    }
  },
  mutations
} 
```

## Mutations