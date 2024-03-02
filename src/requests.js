'use strict'


export const fetchRequest = function(comp, url, options, callbacks, delay) {
  /* Makes a request with fetch.
  Args:
    - url: The user to make the request to.
    - options: Options Object for fetch: https://developer.mozilla.org/en-US/docs/Web/API/fetch
    - callbacks:
      - success(data)
      - error(error)
      - finally()
    - delay: Milliseconds to delay the request.
  */
  if (comp.state.loading) return;
  comp.resetState();
  comp.state.loading = true;

  let delayRequest = delay ? delay : 0;

  comp.render(function() {
    setTimeout(function() {
      fetch(url, options)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          app.state.error = true;
          if (callbacks && callbacks['error'] instanceof Function) {
            callbacks['error'](data);
          }
        } else {
          app.state.success = true;
          if (callbacks && callbacks['success'] instanceof Function) {
            callbacks['success'](data);
          }
        }
      })
      .catch(error => {
        app.state.error = true;
        if (callbacks && callbacks['error'] instanceof Function) {
          callbacks['error'](error);
        }
      })
      .finally(() => {
        app.state.loading = false;
        if (callbacks && callbacks['finally'] instanceof Function) {
          callbacks['finally']();
        }
        app.render();
      });
    }, delayRequest);
  });
};


export const axiosRequest = function(comp, config, callbacks, delay) {
  /* Makes a request with Axios.
  Args:
    - config: Configuration Object for Axios: https://axios-http.com/docs/intro
    - callbacks:
      - success(response)
      - error(error)
      - finally()
    - delay: Milliseconds to delay the request.
  */

  if (comp.state.loading) return;
  comp.resetState();
  comp.state.loading = true;

  let delayRequest = delay ? delay : 0;

  comp.render(function() {
    setTimeout(function() {
      axios.request(config)
      .then(function(response) {
        comp.state.success = true;
        if (callbacks && callbacks['success'] instanceof Function) {
          const callbackResponse = callbacks['success'](response);
          if (callbackResponse instanceof Object) response = callbackResponse;
        }
      })
      .catch(function(error) {
        comp.state.error = true;
        if (callbacks && callbacks['error'] instanceof Function) callbacks['error'](error);
      })
      .then(function() {
        comp.state.loading = false;
        if (callbacks && callbacks['finally'] instanceof Function) callbacks['finally']();
        comp.render();
      });
    }, delayRequest);

  });
};
