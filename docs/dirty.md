# Dirty Manager

`@/store/modules/dirtyManager.js`

The Dirty Manager (DM) is a Vuex module used to track content changes and provide basic validation for the "save" button in the Admin UI header.

## How + Why

When the data in `ComponentOne` is edited, it notifies the DM of the change and whether or not it can be saved. i.e., all component fields are valid.

```js
this.$store.dispatch('dirtyManager/add', {
  name: 'ComponentOne',
  canSave: true
})
```

This adds the component to a list of all dirty components: 

```js
items: [
  {
    name: 'ComponentOne',
    canSave: true
  }
]
```

Then we check to see that all components in the list can be saved with a getter:

```js
getters: {
  saveEnabled: state => {
    if(state.items.length) {
      return state.items.every(item => item.canSave)
    }

    return false
  }
}
```

Say the user now decides to edit `ComponentTwo` but has cleared all the required fields and is no longer valid. The component informs the DM: 

```js
this.$store.dispatch('dirtyManager/add', {
  name: 'ComponentTwo',
  canSave: false
})
```

Now our list of dirty components looks like this: 

```js
items: [
  {
    name: 'ComponentOne',
    canSave: true
  },
  {
    name: 'ComponentTwo',
    canSave: false
  }
]
```

This will cause the `saveEnabled` getter to return `false` which disables the "save" button and prevents the user from submitting bad data. 

```
// src/components/admin/AdminPageWrapper.vue

<b-button :disabled="canSave">
  Save
</b-button>

computed: {
  canSave() {
    return this.$store.state.getters['dirtyManager/saveEnabled']
  }
}
```

This solves a problem with the `provide/inject` based dirty manager where a user could remove all data from a component, making it invalid, then in a separate component, make valid changes which would then enable saving. With this approach, the dirty manager only cared about the most recent changes the user made and would forget about the previous invalid edits.

[Ticket Reference](https://github.com/documoto/enterprise/issues/601)

## Actions

Each component hooked into the DM has watchers on the properties, `save`, `revert`, and `refresh` provided by the `dirtyManagerMixin`.

```js
import {mapState} from 'vuex';

export default {
  data: () => ({
    dirty: false
  }),
  watch: {
    canSave(val) {
      this.$store.dispatch('dirtyManager/add', {
        name: this.$options.name,
        canSave: val
      })
    },
    saveTriggered() {
      this.save();
    },
    revertTriggered() {
      this.revert();
    },
    refreshTriggered() {
      this.refresh();
    }
  },
  computed: {
    ...mapState({
      saveTriggered: (state) => state.dirtyManager.save,
      revertTriggered: (state) => state.dirtyManager.revert,
      refreshTriggered: (state) => state.dirtyManager.refresh
    }),
    canSave() {
      return new Error('Must provide canSave criteria');
    }
  },
  methods: {
    remove() {
      this.$store.dispatch('dirtyManager/remove', this.$options.name)
    },
    refresh() {
      throw new Error('Override refresh method');
    },
    save() {
      throw new Error('Override save method');
    },
    revert() {
      throw new Error('Override revert method');
    }
  },
  created() {
    if (!this.$options.name) {
      throw new Error('Component needs a name');
    }
  }
};
```

Components using this mixin are responsible for providing overrides to the save, revert and refresh methods.

For example, `PageInfo.vue`:

```js
export default {
  name: 'PageInfo'
  mixins: [dirtyManager],
  computed: {
    canSave() {
      return this.dirty && this.requiredFieldValid
    }
  },
  methods: {
    async save() {
      await http.put('/pages', this.requestData) // update the page info
      this.remove() // remove from the DM
      this.refresh() // reload newly edited content
    },
    async refresh() {
      const result = await http.get(`/pages/${this.$route.params.id}`).then(res => res.data)

      this.originalDataReference = JSON.stringify(result)
      this.dataForUI = result
    },
    revert() {
      this.dataForUI = JSON.parse(this.originalDataReference)
    }
  }
}
```

## Considerations

### Dirty Navigation Guard

With this approach, we could potentially consolidate all local dirty state navigation guards into one global check. 

```js
// router/index.js

router.beforeRouteLeave(to, from, next) {
  if(store.state.dirtyManager.items.length) {
    // show confirmation modal
    // trigger save or revert from modal 

    next(false)
  } else {
    next()
  }
}
```

### Refresh Action Unnecessary

The refresh action may be unnecessary. We could take the response from the save/update action and use that to update the UI instead of making an additional API call. 

```js
methods: {
  async save() {
    const result = await http.put(`/entity-endpoint`).then(res => res.data) // update entity
    this.remove() // remove from DM
    this.originalDataReference = JSON.stringify(result) // store data reference
    this.dataForUI = result // update the UI
  }
}
```
