export const filters = {
    'toUpperCase': function(comp, value) {
        console.log("toUpperCase");
        console.log(value);
        return value.toUpperCase();
    },
    'toLowerCase': function(comp, value) {
        return value.toLowerCase();
    }
}


export const applyCustomFilter = function(comp, value, filterName) {
    return filters[filterName](comp, value);
}