# Testing

## Unit

If you're brand new to unit testing in Vue.js apps, check out Vue Mastery's [What to Test](https://www.vuemastery.com/courses/unit-testing/what-to-test/). This is a great place to start. [The Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/) is another excellent resource. We use [Jest](https://jestjs.io/) and [@vue/test-utils](https://vue-test-utils.vuejs.org/) to test our components as well as [flush-promises](https://www.npmjs.com/package/flush-promises) for checking API interaction.

### Writing a Test

First import the `createWrapper` helper function to quickly create a Vue instance with required globals registered. Based on [this guide](https://lmiller1990.github.io/vue-testing-handbook/reducing-boilerplate-in-tests.html).

```js
// @/utils/create-wrapper.js

import {createLocalVue, mount} from '@vue/test-utils';
import Buefy from 'buefy';
import i18n from '@/locales';
import globalFilters from '@/plugins/globalFilters';

const createWrapper = (component, options = {}) => {
  const localVue = createLocalVue();
  localVue.use(globalFilters);
  localVue.use(Buefy, {
    defaultIconPack: 'fa'
  });
  localVue.directive('indeterminate', jest.fn(() => 'indeterminate'));
  const wrapper = mount(component, ({
    i18n,
    localVue,
    ...options
  }));
  return wrapper;
};

export {createWrapper};
```

### Mocking Globals

Chances are good the component you're looking to test will interact with the store or vue-router. See the examples below for a few ways to mock globals. Learn more here: [Vue Testing Handbook - Mocking Globals](https://lmiller1990.github.io/vue-testing-handbook/mocking-global-objects.html)

#### \$route

Here is an example of testing a component that uses the `$route` global.

```js
const options = {
  mocks: {
    $route: {
      params: {
        id: '123
      },
      path: '/foo-bar'
    }
  }
}

const wrapper = createWrapper(MyComponent, options)
```

#### \$router

Sometimes we'll need to check whether or not [vue-router programmatic navigation](https://router.vuejs.org/guide/essentials/navigation.html) works as intended. Here is an example of testing a component that uses the `$router` global.

```js
const options = {
  mocks: {
    $router: {
      push: jest.fn(() => ({
        catch: jest.fn()
      }))
    }
  }
}

const wrapper = createWrapper(MyComponent, options)
```

#### \$store

Similar to $route, and $router, mocking a Vuex store is pretty straight forward too.

```js
const mockStore = {
  state: {
    data: null,
    loading: false,
    error: false
  },
  dispatch: jest.fn()
}

const options = {
  mocks: {
    $store: mockStore
  }
}

const wrapper = createWrapper(MyComponent, options)

expect(mockStore.dispatch).toHaveBeenNthCalledWith(
  1,
  '[MODULE] FETCH_MY_DATA',
  '123'
)
```

### Testing API Interactions

Testing an API call is very common. It's good to know if the component is sending the correct data and if we handling Promise rejection and resolution as we plan. If writing a new component, add the call to the controllers dir. See [Architecture - Controllers](/architecture). Next create test file `*.spec.js` and add all necessary imports: 

```js
// __tests__/Navigation.spec.js
import {createWrapper} from "@/utils
import Navigation from "../MyComponent.vue"
import {getNavItems} from "@/controllers"
import flushPromises from "flush-promises"
```

Next we want to tell Jest to mock the controllers directory. This way it will know how to handle the `getNavItems` call: 

```js
jest.mock("@/controllers")
```

If we want to ensure the UI handles promise resolution correctly, we can add the following: 

```js
it('makes API call and handles success', async () => {

  getNavItems.mockResolvedValueOnce([{
    title: 'Foo',
    path: '/foo'
  },{
    title: 'Bar',
    path: '/bar'
  }])

  const wrapper = createWrapper(MyComponent)

  await flushPromises()

  expect(wrapper.find('#nav')) // and assert something
})
```


### Coverage

To get coverage reports, cd into the project directory and run `npm run test:coverage`. This will generate a static site in the `coverage/lcov-report/` directory. Once generated, you can use the [`Chrome Web Server Extension`](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en) or simply open the `index.html` file in your browser to view coverage info.

### What to Avoid

#### 1 - Testing the Framework

We can assume that Vuejs core features like props are well tested. No need to test whether or not a component rendered a passed prop to the template UNLESS there is some sort of data transformation which takes place and should be covered.

### Resources

#### Official Docs

- [`Jest`](https://jestjs.io/)
- [`@vue/test-utils`](https://vue-test-utils.vuejs.org/)

#### Guides

- [`Vue Testing Handbook`](https://lmiller1990.github.io/vue-testing-handbook/)
- [`Vue Mastery - Unit Testing`](https://www.vuemastery.com/courses/unit-testing/what-to-test/)

#### Tooling

- [`vscode-jest`](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)


## Integration / E2E

We use [Webdriver.io](https://webdriver.io/) for our E2E tests. To run the test suites, first, define which environment to test against; QA1, Integration, local, etc as well as the test user credentials. Additionally, you can specify whether or not to do a full test run or just a few specific tests. 

From the project directory, run the following:

```bash
# environment
export INT_TEST_URL=<my-test-url>
```

```bash
# username
export TEST_USER_USERNAME=<my-username>
```

```bash
# password
export TEST_USER_PASSWORD=<my-password>
```

```bash
# light test run
export INT_TEST_LIGHT_RUN=true
```

Note, env vars get evaluated as a string so typing anything into the field will be truthy and enable a light test run.

```bash
# also enables light test run
export INT_TEST_LIGHT_RUN=anything
```

If you've previously enabled a light test run, you can disable it by exporting an empty value:

```bash
# full test run
export INT_TEST_LIGHT_RUN=
```

#### Example

```bash
# to test against QA1
export INT_TEST_URL=https://qa1.digabit.com/ui/
```

#### Defaults

By default, we do a full test run against QA1.

```bash
INT_TEST_URL=https://qa1.digabit.com/ui/
TEST_USER_USERNAME=sadmin@manitou.com
TEST_USER_PASSWORD=Password#12
INT_TEST_LIGHT_RUN=
```

#### Command

```bash
# run int tests
npm run test:e2e
```