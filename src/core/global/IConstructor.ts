/**
 * 这个文件是给全局设置一个IConstructor接口而设计的
*/
interface IConstructor extends Function
{
    new (...args:any[]):any;
}