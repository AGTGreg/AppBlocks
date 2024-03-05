import { logError } from "./logger";


export const filters = {}


export const applyCustomFilter = function(comp, value, filterName) {
  if (filterName in filters) {
    return filters[filterName](comp, value);
  } else {
    logError(comp, `${filterName} is not a registered filter.`);
    return value;
  }
}