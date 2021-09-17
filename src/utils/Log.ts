export const LOG_LEVEL_PRINT: number = 0;
export const LOG_LEVEL_WARNING: number = 1;
export const LOG_LEVEL_ERROR: number = 2;

/***
 * 日志
 * @param content
 * @param level
 */
export function log(content: string, level: number = LOG_LEVEL_PRINT): void
{
    switch (level)
    {
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
