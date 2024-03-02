'use strict';

const Idiomorph = require('idiomorph/dist/idiomorph.cjs');
import {updateTextNodePlaceholders} from './placeholders';
import {directives} from './directives';
import {processNode} from './processing';
import {helpers} from './utils';
import {fetchRequest, axiosRequest} from './requests';

const defaultRequestHeaders = {

}


export function AppBlock(config) {


  this.debug = false,


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
    let tmpDOM = comp.template.cloneNode(true);
    processNode(comp, tmpDOM);
    updateTextNodePlaceholders(comp, tmpDOM);
    return tmpDOM;
  }


  this.render = function(callback) {
    const comp = this;
    if (comp.methods.beforeRender instanceof Function) comp.methods.beforeRender(comp);

    let tmpDOM = this.prepareTmpDom();

    // Start timing
    console.time(comp.renderEngine + " render time");

    if (comp.renderEngine === 'Idiomorph') {
      comp.idiomorphRender(tmpDOM);
    } else if (comp.renderEngine === 'plain') {
      comp.plainRender(tmpDOM);
    } else {
        console.error(`${comp.renderEngine} renderEngine does not exist.`);
    }

    // End timing
    console.timeEnd(comp.renderEngine + " render time");

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

    if ( config.debug ) comp.debug = true;

    // Initialize all the properties and update them from the config if they are included, or exit if no
    // config is provided.
    if (config !== undefined) {

      if (config.el === undefined) {
        if ( comp.debug ) console.warn("el is empty. Please assign a DOM element to el. Current AppBlock is exiting.")
        return;
      }

      if (config.el === null) {
        if ( comp.debug ) console.warn("The element you assigned to el is not present. Current AppBlock is exiting.")
        return;
      }

      comp.el = config.el;
      comp.renderEngine = config.renderEngine ? config.renderEngine : "plain";

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

      // Event handling ------------------------------------------------------------------------------------------------
      comp.events = {};
      if (config.events instanceof Object) {
        Object.assign(comp.events, config.events)
        // Add event listeners to :el for each event
        for (const ev in comp.events) {
          // Events are in this form (event element) so split at space to get the eventName and the element to attach
          // the event on.
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

    } else {
      return false;
    }

    comp.render();
    return comp;
  }

  return this.Init();
}
