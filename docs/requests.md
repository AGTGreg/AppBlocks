## Requests

A key concept in AppBlocks, is to cover the most common use cases of a front-end micro app. One of those use cases is to be able to make requests.

With AppBlocks you can use `fetch` or [Axios](https://github.com/axios/axios) to make requests. AppBlocks wraps these APIs and takes care of our app's state and rendering for us.

### Usage

#### Fetch
**`App.fetchRequest(url, options, callbacks, delay);`**

- `options`: Read [this](https://developer.mozilla.org/en-US/docs/Web/API/fetch#options) for what can go into the `options`.
- `callbacks`: success, error and finally callback functions.
- `delay`: You may add a delay in milliseconds for the request. This is handy if you want to throttle your requests.

**Example:**
```js
App.fetchRequest("https://example.com",
  {
    method: 'GET'
  },
  {
    success(response) { console.log(response); },
    error(error) { console.log(error); },
    finally() { alert('Request is finished'); }
  }, 300)
```

#### Axios
**`App.axiosRequest(config, callbacks, delay);`**

- `config`: Read [this](https://axios-http.com/docs/req_config) for what can go into the `config`.
- `callbacks`: success, error and finally callback functions.
- `delay`: You may add a delay in milliseconds for the request. This is handy if you want to throttle your requests.

> To make use of the axiosRequest featute, we must first include the Axios library in our document since Axios is not included in AppBlocs:
> ```html
> <script src="https://cdn.jsdelivr.net/npm/axios/dist/ axios.min.js"></script>
> ```

**Example:**
```js
App.axiosRequest(
  {
    url: 'https://example.com',
    method: 'GET'
  },
  {
    success(response) { console.log(response); },
    error(error) { console.log(error); },
    finally() { alert('Request is finished'); }
  }, 300)
```

### State

AppBlocks will update the state of our app depending on the result of the request. We can use that state to structure our UI, based on the request. The state can be one of the following: `isLoading, isSuccessful, hasError`.

State is exposed as methods so we can use them in our UI with directives:

```html
  <p c-if="isLoading">Loading</p>

  <p c-if="hasError">An error occurred</p>

  <div c-if="isSuccessful">
    <!-- Display data -->
  </div>
```


### A complete requests example

Lets make an app, that makes a `GET` request to [reqres.in](https://reqres.in/), when the user clicks on a button to get a list of users. Then display that list on our page.

Lets make the UI part of our app:

```html
<div id="app"></div>

<template id="appTemplate">
  <button id="get-data">Get Data</button>

  <p c-if="isLoading">Loading</p>

  <p c-if="hasError">{data.errorMessage}</p>

  <div c-if="isSuccessful">
    <ul>
      <li c-for="user in data.data">
        <span>{user.email} - {user.first_name} {user.last_name}</span>
      </li>
    </ul>
  </div>

</div>
```

And this is how we make a request, when the user cliks the button:

```js
var app = new AppBlock({

  el: document.getElementById('app'),
  template: getElementById('appTemplate'),

  data: {
    errorMessage: "",
    user: {}
  },

  events: {
    'click #get-data': function(e) {
      const app = this.Parent;
      app.fetchRequest('https://reqres.in/api/users/2',
        {
            method: 'GET',
        },
        {
            success(data) {
                console.log(data);
                app.data.user = data.data;
            },
            error(error) {
                app.data.errorMessage = error.message
            },
            finally() {console.log('finished')}
        }, 1000)
  }
})
```