'use strict';

import {Idiomorph} from 'idiomorph/dist/idiomorph.esm.js';
import {updateTextNodePlaceholders} from './placeholders';
import {directives} from './directives';
import {filters} from './filters';
import {processNode} from './processing';
import {helpers} from './utils';
import {fetchRequest, axiosRequest} from './requests';
import { logError } from './logger';

const defaultRequestHeaders = {

}


export function AppBlock(config) {


  // Sets or Updates the data and then calls render()
  this.setData = function(newData, replaceData = false) {
    if (replaceData) {
      this.data = newData;
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


  // Requests
  this.axiosRequest = (options, callbacks, delay) => axiosRequest(this, options, callbacks, delay);
  this.fetchRequest = (url, options, callbacks, delay) => fetchRequest(this, url, options, callbacks, delay);


  // Render ============================================================================================================
  // This is the heart of an AppBlock. This is where all placeholders and directives get evaluated based on our
  // data, and content gets updated.
  this.prepareTmpDom = function() {
    const comp = this;
    const cache = new Map(); // Per-render ephemeral cache
    let tmpDOM = comp.template.cloneNode(true);

    // Wrap in a div to handle directives on root elements
    const wrapper = document.createElement('div');
    wrapper.appendChild(tmpDOM);

    processNode(comp, wrapper, cache);
    updateTextNodePlaceholders(comp, wrapper, null, cache);

    return wrapper;
  }
  this.render = function(callback) {
    const comp = this;
    if (comp.methods.beforeRender instanceof Function) comp.methods.beforeRender(comp);

    let tmpDOM = this.prepareTmpDom();

    if (comp.renderEngine === 'Idiomorph') {
      comp.idiomorphRender(tmpDOM);
    } else if (comp.renderEngine === 'plain') {
      comp.plainRender(tmpDOM);
    } else {
      logError(comp, `${comp.renderEngine} renderEngine does not exist.`);
    }

    if (comp.methods.afterRender instanceof Function) comp.methods.afterRender(comp);
    if (callback instanceof Function) callback();
  }


  // Render engines
  this.plainRender = function(tmpDOM) {
    this.el.innerHTML = '';
    this.el.appendChild(tmpDOM);
  }


  this.idiomorphRender = function(tmpDOM) {
    Idiomorph.morph(this.el, tmpDOM, {morphStyle:'innerHTML'});
  }


  // Initialization ====================================================================================================
  this.Init = function() {
    const comp = this;

    if (config.name) {
      comp.name = config.name;
    } else {
      comp.name = "AppBlock";
    }

    // Initialize all the properties and update them from the config if they are included, or exit if no
    // config is provided.
    if (config !== undefined) {

      if (config.el === undefined) {
        logError(comp, "el is empty. Please assign a DOM element to el.");
        return;
      }

      if (config.el === null) {
        logError(comp, "The element you assigned to el is not present.");
        return;
      }

      comp.el = config.el;
      comp.renderEngine = config.renderEngine ? config.renderEngine : "Idiomorph";

      // Get or create a document fragment with all the app's contents and pass it to the template.
      if (config.template) {
        comp.template = config.template.content;
      } else {
        comp.template = document.createDocumentFragment();
        while (comp.el.firstChild) {
          comp.template.appendChild(comp.el.firstChild);
        }
      }

      comp.state = {
        loading: false,
        error: false,
        success: false
      };

      comp.data = {};
      if (config.data instanceof Object) comp.data = config.data;

      // A set of helper functions.
      comp.utils = helpers;
      comp.utils['comp'] = comp;

      comp.methods = {
        Parent: comp,
        isLoading(thisApp) {
          return thisApp.state.loading;
        },
        isSuccessful(thisApp) {
          return thisApp.state.success;
        },
        hasError(thisApp) {
          return thisApp.state.error;
        },
        beforeRender(thisApp) {},
        afterRender(thisApp) {}
      };
      if (config.methods instanceof Object) Object.assign(comp.methods, config.methods);

      comp.directives = directives;
      if (config.directives instanceof Object) Object.assign(comp.directives, config.directives);

      comp.filters = filters;
      if (config.filters instanceof Object) Object.assign(comp.filters, config.filters);

      // Expression evaluation built-ins allow-list. Expect an array of strings (default: empty, no built-ins allowed).
      comp.allowBuiltins = [];
      if (Array.isArray(config.allowBuiltins)) {
        comp.allowBuiltins = config.allowBuiltins;
      }

      // Placeholder delimiters configuration. Expect an array of two non-empty strings.
      const defaultDelimiters = ['{', '}'];
      if (Array.isArray(config.delimiters) && config.delimiters.length === 2 && typeof config.delimiters[0] === 'string' && typeof config.delimiters[1] === 'string' && config.delimiters[0].length > 0 && config.delimiters[1].length > 0) {
        comp.delimiters = config.delimiters;
      } else {
        if (config.delimiters !== undefined) {
          // Developer provided an invalid configuration — log and fallback to default
          logError(comp, 'Invalid `delimiters` config provided. Falling back to default [`{`,`}`].');
        }
        comp.delimiters = defaultDelimiters;
      }

      // Event handling ------------------------------------------------------------------------------------------------
      comp.events = {};
      if (config.events instanceof Object) {
        Object.assign(comp.events, config.events)
        // Add event listeners to :el for each event
        for (const ev in comp.events) {
          // Events are in this form "<eventName> <cssSelector>" where the selector may contain spaces.
          // Split only on the first space so the remainder is treated as a full selector string.
          const firstSpace = ev.indexOf(' ');
          if (firstSpace === -1) continue; // invalid key
          const eventName = ev.slice(0, firstSpace);
          const eventSelector = ev.slice(firstSpace + 1).trim();

          comp.el.addEventListener(eventName, function(e) {
            const target = e.target || e.srcElement;
            // Use closest to test whether the event originated from within a matching element.
            // Ensure the matched element is inside this AppBlock's root.
            let matched = null;
            try {
              if (target && target.closest) matched = target.closest(eventSelector);
            } catch (err) {
              // If the selector is invalid, skip handling to avoid breaking the app.
              matched = null;
            }
            if (matched && comp.el.contains(matched)) {
              try {
                comp.events[ev](e, matched);
              } catch (err) {
                // swallow handler errors to avoid breaking other handlers
                logError(comp, err && err.message ? err.message : String(err));
              }
            }
          });
        }
      }
      comp.events['Parent'] = comp;

    } else {
      return false;
    }

    comp.render();
    return comp;
  }

  return this.Init();
}
