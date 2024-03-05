export const logError = function(comp, msg) {
    console.error(`${comp.name}: ${msg}`);
}


export const logWarning = function(comp, msg) {
    console.warn(`${comp.name}: ${msg}`);
}


export const logInfo = function(comp, msg) {
    console.info(`${comp.name}: ${msg}`);
}