/**
 * Cookie工具
*/

/**
 * 获取cookie值
 * 
 * @export
 * @param {string} name cookie名称
 * @returns {string} cookie值
 */
export function getCookie(name:string):string
{
    if (document.cookie.length > 0)
    {
        var start:number = document.cookie.indexOf(name + "=");
        if(start != -1)
        {
            start = start + name.length + 1;
            var end:number = document.cookie.indexOf(";", start);
            if (end == -1) end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(start, end));
        }
    }
    return undefined;
}

/**
 * 获取cookie值
 * 
 * @export
 * @param {string} name cookie名称
 * @param {*} value cookie值
 * @param {number} [expire] 有效期时长（毫秒）
 */
export function setCookie(name:string, value:any, expire?:number)
{
    var exstr:string = "";
    if(expire != null)
    {
        var exdate:Date = new Date();
        exdate.setMilliseconds(exdate.getMilliseconds() + expire);
        exstr = ";expires=" + exdate.toUTCString();
    }
    document.cookie = name+ "=" + encodeURIComponent(value) + exstr;
}