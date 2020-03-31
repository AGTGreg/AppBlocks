'use strict';

import {updateTextNodePlaceholders} from './placeholders';
import {processNode} from './directives';


export function AppBlock(config) {


  // Sets or Updates the data and then calls render()
  this.setData = function(newData, replaceData = false) {
    if (replaceData) {
      this.data = data;
    } else {
      Object.assign(this.data, newData);
    }
    this.render();
  }
  

  // Resets to the default state. Handy before making a request.
  this.resetState = function() {
    this.state.loading = false;
    this.state.error = false;
    this.state.success = false;
  }


  // Makes a request with axios. Config and callbacks are both objects. Callbacks may contain: 
  // success(response), error(error) and done() callbacks.
  this.request = function(config, callbacks, replaceData) {
    const comp = this;
    if (comp.state.loading) return;

    let cConfig = comp.axiosConfig;
    if (config) { Object.assign(cConfig, config) }

    comp.resetState();
    comp.state.loading = true;
    let responseData;

    comp.render(function() {

      axios.request(cConfig)
      .then(function(response) {
        comp.state.success = true;
        responseData = response.data;
        if (callbacks && callbacks['success'] instanceof Function) callbacks['success'](response);
      })
      .catch(function(error) {
        comp.state.error = true;
        responseData = error;
        if (callbacks && callbacks['error'] instanceof Function) callbacks['error'](error);
      })
      .then(function() {
        comp.state.loading = false;
        comp.setData(responseData, replaceData);
        if (callbacks && callbacks['done'] instanceof Function) callbacks['done']();
      });

    });
  }


  // Render ============================================================================================================
  // This is the heart of an AppBlock. This is where all placeholders and directives get evaluated based on our
  // data, and content gets updated.
  this.render = function(callback) {
    const comp = this;

    let tmpDOM = comp.template.cloneNode(true);
    processNode(comp, tmpDOM);
    updateTextNodePlaceholders(comp, tmpDOM);
    this.el.innerHTML = tmpDOM.innerHTML;
    if (callback instanceof Function) callback();
  }


  // Initialization ====================================================================================================
  this.Init = function() {
    const comp = this;

    // Initialize all the properties from the config or exit if no config is provided.
    if (config !== undefined) {
      
      if (config.el === undefined) {
        throw "==> el is not set or not present in DOM. Set el to a valid DOM element on init.";
      }
      
      comp.el = config.el;

      if (config.template) {
        comp.template = config.template; 
      } else {
        comp.template = comp.el.cloneNode(true);
        comp.el.innerHTML = "";
      }

      comp.state = {
        loading: false,
        error: false,
        success: false
      };

      comp.data = {};
      if (config.data instanceof Object) comp.data = config.data;

      comp.methods = {
        Parent: comp,
        isLoading() {
          return this.Parent.state.loading;
        },
        isSuccessful() {
          return this.Parent.state.success;
        },
        hasError() {
          return this.Parent.state.error;
        }
      };
      if (config.methods instanceof Object) Object.assign(comp.methods, config.methods);

      comp.events = {};
      if (config.events instanceof Object) {
        Object.assign(comp.events, config.events)
        // Add event listeners to :el for each event
        for (const ev in comp.events) {
          // Events are in this form (event element) so split at space to get the eventName and the element to attach the
          // event on.
          const eParts = ev.split(' ');
          const eventName = eParts[0];
          const eventElement = eParts[1];
          
          comp.el.addEventListener(eventName, function(e) {
            comp.el.querySelectorAll(eventElement).forEach(el => {
              if (e.srcElement === el) comp.events[ev](e);
            });
          });
        }
      }
      comp.events['Parent'] = comp;

      comp.axiosConfig = { 
        headers: {'X-Requested-With': 'XMLHttpRequest'} 
      };
      if (config.axiosConfig instanceof Object) Object.assign(comp.axiosConfig, config.axiosConfig)

    } else {
      return false;
    }

    comp.render();
    return comp;
  }

  return this.Init();
}
