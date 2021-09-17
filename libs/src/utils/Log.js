export var LOG_LEVEL_PRINT = 0;
export var LOG_LEVEL_WARNING = 1;
export var LOG_LEVEL_ERROR = 2;
export function log(content, level) {
    if (level === void 0) { level = LOG_LEVEL_PRINT; }
    switch (level) {
        case 0:
            console.log('[log]' + content);
            break;
        case 1:
            console.warn('[warning]' + content);
            break;
        case 2:
            console.error('[error]' + content);
            break;
    }
}
//# sourceMappingURL=Log.js.map