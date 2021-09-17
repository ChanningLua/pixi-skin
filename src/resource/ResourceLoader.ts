import {ResourceItem} from './ResourceItem';
import { core } from "./../core/Core";
import { JSFile, JSFileData, JSLoadMode } from './../core/interfaces/JSFile';
import { unique } from "./../utils/ArrayUtil";
import { load } from "./../utils/HTTPUtil";
import { isAbsolutePath } from "./../utils/URLUtil";

export class ResourceLoader{


    private _assetsDict:{[path:string]:any} = {};
	/**
	 * 最大并发加载数
	 */
	public thread: number = 3;
	/**
	 * 正在加载的线程计数
	 */
	private loadingCount:number = 0;
	/**
	 * 加载结束回调函数 
     * 无论加载成功或者出错都将执行回调函数
	 */
	public callBack:Function = null;
	/**
	 * 加载器单例
	 */
	public resInstance:any = null;

	/**
	 * 当前组加载总个数
	 */
	private groupTotalDic:any = {};
	/**
	 * 已经加载的个数
	 */
	private numLoadedDic:any = {};
	/**
	 * 正在加载的组列表
	 */
	private itemListDic:any = {};
	/**
	 * 加载失败的组ming列表
	 */
	private groupErrorDic:any = {};

	private retryTimesDic: any = {};
	public maxRetryTimes = 3;
	private failedList: Array<ResourceItem> = new Array<ResourceItem>();

	/**
	 * 优先级队列,key为priority，value为groupName列表
	 */
	private priorityQueue:any = {};
	/**
	 * 检查指定的组是否正在加载中
	 * @param {string} groupName 
	 * @returns {boolean}
     * @memberof ResourceLoader
	 */
	public isGroupInLoading(groupName:string):boolean{
		return this.itemListDic[groupName]!==undefined;
	}
	/**
	 * 开始加载一组资源
	 * @param {Array<ResourceItem>} list  加载项列表
	 * @param  {string} groupName 组名
	 * @param {number} priority  加载优先级
     * @memberof ResourceLoader
	 */
	public loadGroup(list:Array<ResourceItem>,groupName:string,priority:number=0):void{
        // 过滤无效信息
		if(this.itemListDic[groupName] || !groupName){
			console.trace('RESOURCE: groupName is undefined');
			return;
		}
		if(!list || list.length === 0){
			console.trace('RESOURCE: resource list is null');
			return;
		}
        // 设置加载优先级
		if(this.priorityQueue[priority]){
			this.priorityQueue[priority].push(groupName);
		}else{
			this.priorityQueue[priority] = [groupName];
		}

        // 缓存加载项
		this.itemListDic[groupName] = list;
        //数据替换
		let length:number = list.length;
		for(let i:number=0;i<length;i++){
			let resourceItem:ResourceItem = list[i];
			resourceItem.groupName = groupName;
		}
        // 初始化加载信息
		this.groupTotalDic[groupName] = list.length;
		this.numLoadedDic[groupName] = 0;
        // 开始加载
		this.next();
	}
	/**
	 * 延迟加载队列
	 */
	private lazyLoadList:Array<ResourceItem> = new Array<ResourceItem>();
	/**
	 * 开始加载一项资源
	 * @param {ResourceItem} resourceItem  
     * @memberof ResourceLoader
	 */
	public loadItem(resourceItem:ResourceItem):void{
		this.lazyLoadList.push(resourceItem);
		resourceItem.groupName = "";
		this.next();
	}

	/**
	 * 开始加载下一项资源
     * @memberof ResourceLoader
	 */
	private async next(){
        // 根据策咯判断线程数
		while(this.loadingCount<this.thread) {
            //生成需要加载的个项
			let resourceItem:ResourceItem = this.getOneResourceItem();
			if(!resourceItem)
                break;
            //引用计数
            this.loadingCount++;
            // 判断是否已经加载
			if(resourceItem.loaded){
				this.onItemComplete(resourceItem);
			}
			else{   // 开始加载
                //FIXME resourceItem.type
                let responseType:XMLHttpRequestResponseType;
				switch (resourceItem.type){
					case 'sound':
                    case 'music':
                        // 设置加载完成
                        resourceItem.loaded = true;
                        // 通过回调进行下一个加载项
                        this.onItemComplete(resourceItem);
                        return;
                        break
                    case 'image':
                        responseType = 'blob';  // pixi phaser 中默认为blob类型  
                        break;
                    case 'text':
                    case 'json':
                        responseType = 'text';
                        break;
                    case 'bin':
                        responseType = 'arraybuffer';  
                        break;
					default:
                        responseType = 'text';  
                }
                // 开始加载资源
                this.loadAssets(resourceItem.url, function (result){
                    // 设置加载完成
                    resourceItem.loaded = true;
                    // 通过回调进行下一个加载项
                    this.onItemComplete(resourceItem);
                }.bind(this), responseType);
			}
		}
	}

	/**
	 * 加载同优先级队列的第几列
	 */
	private queueIndex:number = 0;
	/**
	 * 获取下一个待加载项
     * @memberof ResourceLoader
	 */
	private getOneResourceItem():ResourceItem{
        // 处理加载失败的加载项
		if (this.failedList.length > 0)
            return this.failedList.shift();
        //设置优先级相关
		let maxPriority:number = Number.NEGATIVE_INFINITY;
		for(let p in this.priorityQueue){
			maxPriority = Math.max(maxPriority,<number><any> p);
        }
        //开始队列
		let queue:any[] = this.priorityQueue[maxPriority];
		if(!queue || queue.length === 0){
			if(this.lazyLoadList.length === 0)
				return null;
			//后请求的先加载，以便更快获取当前需要的资源
			return this.lazyLoadList.pop();
		}
		let length:number = queue.length;
		let list:Array<ResourceItem>;
		for(let i:number=0;i<length;i++){
			if(this.queueIndex>=length)
				this.queueIndex = 0;
			list = this.itemListDic[queue[this.queueIndex]];
			if(list.length>0)
				break;
			this.queueIndex++;
		}
		if(list.length==0)
			return null;
		return list.shift();
	}
	/**
	 * 加载结束的回调
     * @param {ResourceItem} resourceItem 单个加载项的信息
     * @memberof ResourceLoader
	 */
	private onItemComplete(resourceItem:ResourceItem):void{
		this.loadingCount--;
		let groupName:string = resourceItem.groupName;
		if(!resourceItem.loaded){ // 加载失败的处理
			let times = this.retryTimesDic[resourceItem.name] || 1;
			if (times > this.maxRetryTimes) {
                delete this.retryTimesDic[resourceItem.name];
                //TODO 因为默认已有加载机制，所以暂不对外暴露。后续根据业务需求处理
				// core.dispatch('Load_Source_Error', groupName, resourceItem); 
			}
			else {
				this.retryTimesDic[resourceItem.name] = times + 1;
				this.failedList.push(resourceItem);
				this.next();
				return;
			}
        }
        //处理相关队列的缓存
		if(groupName){
			this.numLoadedDic[groupName]++;
			let itemsLoaded:number = this.numLoadedDic[groupName];
			let itemsTotal:number = this.groupTotalDic[groupName];
			if(!resourceItem.loaded){
				this.groupErrorDic[groupName] = true;
			}

			core.dispatch( this.resInstance.GROUP_PROGRESS, groupName, resourceItem, itemsLoaded, itemsTotal);
			if(itemsLoaded==itemsTotal){
				let groupError:boolean = this.groupErrorDic[groupName];
				this.removeGroupName(groupName);
				delete this.groupTotalDic[groupName];
				delete this.numLoadedDic[groupName];
				delete this.itemListDic[groupName];
				delete this.groupErrorDic[groupName];
				if(groupError){
					core.dispatch( this.resInstance.GROUP_ERROR,groupName);
				}
				else{
                    core.dispatch( this.resInstance.GROUP_COMPLETE,groupName);
                }
                return;  //TODO 加载完毕结束循环调用
			}
		}
		else{
			this.callBack.call(this.resInstance,resourceItem);
        }
        // 如果没有加载完所有列表则继续加载下一加载项
		this.next();
	}
	/**
	 * 从队列优先级中移除指定的组
     * @param {string} groupName 单个加载项的信息
     * @memberof ResourceLoader
	 */
	private removeGroupName(groupName:string):void{
		for(let p in this.priorityQueue){
            // 从优先级队列找到对应的ITEM
			let queue:any[] = this.priorityQueue[p];
			let index:number = 0;
			let found:boolean = false;
            let length:number = queue.length;
            // 遍历删除
			for(let i:number=0;i<length;i++){
                let name:string = queue[i];
                // 找到指定组的索引并删除
				if(name==groupName){
					queue.splice(index,1);
					found = true;
					break;
				}
				index++;
            }
            // 删除在队列中的缓存
			if(found){
				if(queue.length==0){
					delete this.priorityQueue[p];
				}
				break;
			}
		}
	}


	/**
     * 获取资源，同步的，且如果找不到资源并不会触发加载
     * @param {string} keyOrPath 资源的短名称或路径
     * @returns {*} 
     * @memberof ResourceLoader
     */
    public getAssets(keyOrPath:string):any
    {
        var path:string = keyOrPath;
        // 获取缓存的结果
        var result:any = this._assetsDict[path];
        // 如果是个数组则表示正在加载中，返回undefined
        if(result instanceof Array) return undefined;
        else return result;
    }


    /**
     * 加载资源，如果已加载过则同步回调，如果未加载则加载后异步回调
     * @param {string|string[]} keyOrPath 资源短名称或资源路径
     * @param {(assets?:any|any[])=>void} complete 完成回调，如果加载失败则参数是个Error对象
     * @param {XMLHttpRequestResponseType} [responseType] 加载类型
     * @param {(keyOrPath?:string, assets?:any)=>void} [oneComplete] 一个资源加载完毕会调用这个回调，如果有的话。仅在keyOrPath是数组情况下生效
     * @returns {void} 
     * @memberof ResourceLoader
     */
    public loadAssets(keyOrPath:string|string[], complete:(assets?:any|any[], path?:string)=>void, responseType?:XMLHttpRequestResponseType, oneComplete?:(keyOrPath?:string, assets?:any)=>void):void
    {
        // 非空判断
        if(!keyOrPath)
        {
            complete && complete(value);
            return;
        }
        // 获取路径
        if(keyOrPath instanceof Array)
        {
            // 数loadAssets组去重
            keyOrPath = unique(keyOrPath);
            // 是个数组，转换成单一名称或对象
            var count:number = keyOrPath.length;
            var results:any[] = [];
            // 判断数量
            if(count > 0)
            {
                // 声明回调
                var handler:(keyOrPath?:string, assets?:any)=>void = (path:string, assets:any)=>{
                    oneComplete && oneComplete(path, assets);
                    var index:number = keyOrPath.indexOf(path);
                    results[index] = assets;
                    // 判断完成
                    if(-- count === 0)
                        complete && complete(results);
                };
                // 并行加载资源
                for(var i:number = 0, len:number = count; i < len; i++)
                {
                    var path:string = keyOrPath[i];
                    this.loadAssets(path, null, null, handler);
                }
            }
            else
            {
                // 直接完成
                complete && complete(results,path);
            }
        }
        else
        {
            // 是单一名称或对象
            var path:string = keyOrPath;
            var value:any = this._assetsDict[path];
            if(value instanceof Array)
            {
                // 正在加载中，等待之
                value.push(complete);
            }
            else if(value)
            {
                // 已经加载过了，直接返回
                oneComplete && oneComplete(keyOrPath, value);
                complete && complete(value,keyOrPath);
            }
            else
            {
                // 没有就去加载
                this._assetsDict[path] = value = [(result:any)=>{
                    oneComplete && oneComplete(<string>keyOrPath, result);
                    complete && complete(result,path);
                }];
                load({
                    url: path,
                    responseType: responseType,
                    onResponse: (result:any)=>{
                        // 记录结果
                        this._assetsDict[path] = result;
                        // 通知各个回调
                        for(var handler of value)
                        {
                            handler(result);
                        }
                    },
                    onError: (err:Error)=>{
                        // 移除结果
                        delete this._assetsDict[path];
                        // 通知各个回调
                        for(var handler of value)
                        {
                            handler(err);
                        }
                    }
                })
            }
        }
    }

    /**
     * 加载CSS样式文件
     * 
     * @param {string[]} cssFiles 样式文件URL列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @memberof ResourceLoader
     */
    public loadStyleFiles(cssFiles:string[], handler:(err?:Error)=>void):void
    {
        if(!cssFiles || cssFiles.length === 0)
        {
            handler();
            return;
        }
        var count:number = cssFiles.length;
        var stop:boolean = false;
        for(var cssFile of cssFiles)
        {
            var cssNode:HTMLLinkElement= document.createElement("link");
            cssNode.rel = "stylesheet";
            cssNode.type = "text/css";
            cssNode.href = cssFile;
            cssNode.onload = onLoadOne;
            cssNode.onerror = onErrorOne;
            document.body.appendChild(cssNode);
        }

        function onLoadOne():void
        {
            // 如果全部加载完毕则调用回调
            if(!stop && --count === 0) handler();
        }

        function onErrorOne(evt:Event):void
        {
            if(!stop)
            {
                stop = true;
                handler(new Error("CSS加载失败"));
            }
        }
    }
	

	/**
     * 加载JS文件
     * 
     * @param {JSFile[]} jsFiles js文件列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
     * @memberof ResourceLoader
     */
    public loadJsFiles(jsFiles:JSFile[], handler:(err?:Error)=>void, ordered:boolean=false):void
    {
        if(!jsFiles || jsFiles.length === 0)
        {
            handler();
            return;
        }
        jsFiles = jsFiles.concat();
        var count:number = jsFiles.length;
        var jsonpCount:number = 0;
        var stop:boolean = false;
        var nodes:HTMLScriptElement[] = [];
        // 遍历加载js
        for(var i in jsFiles)
        {
            var jsFile:JSFile = jsFiles[i];
            // 统一类型
            if(typeof jsFile === "string")
            {
                // 是简单路径，变成JSFileData
                jsFiles[i] = jsFile = {
                    url: jsFile,
                    mode: JSLoadMode.AUTO
                };
            }
            // 创建一个空的script标签
            var jsNode:HTMLScriptElement = document.createElement("script");
            jsNode.type = "text/javascript";
            nodes.push(jsNode);
            // 开始加载
            if(jsFile.mode === JSLoadMode.JSONP || (jsFile.mode === JSLoadMode.AUTO && !isAbsolutePath(jsFile.url)))
            {
                this.loadAssets(jsFile.url, null, null, onCompleteOne);
                // 递增数量
                jsonpCount ++;
            }
            else
            {
                // 使用script标签方式加载，不用在意顺序
                jsNode.onload = onLoadOne;
                jsNode.onerror = onErrorOne;
                jsNode.src = jsFile.url;
            }
        }
        // 判断一次
        var appendIndex:number = 0;
        judgeAppend();

        function judgeAppend():void
        {
            if(jsonpCount === 0)
            {
                // 这里统一将所有script标签添加到DOM中，以此保持顺序
                for(var i:number = appendIndex, len:number = nodes.length; i < len; )
                {
                    var node:HTMLScriptElement = nodes[i];
                    document.body.appendChild(node);
                    // 记录添加索引
                    appendIndex = ++ i;
                    // 如果需要保持顺序且当前是标签形式js，则停止添加，等待加载完毕再继续
                    if(ordered && node.src) break;
                }
            }
        }

        function onCompleteOne(url:string, result:string|Error):void
        {
            if(result instanceof Error)
            {
                // 调用失败
                onErrorOne();
            }
            else
            {
                // 取到索引
                var index:number = -1;
                for(var i:number = 0, len:number = jsFiles.length; i < len; i++)
                {
                    var jsFile:JSFileData = <JSFileData>jsFiles[i];
                    if(jsFile.url === url)
                    {
                        index = i;
                        break;
                    }
                }
                // 填充script标签内容
                if(index >= 0)
                {
                    var jsNode = nodes[index];
                    jsNode.innerHTML = result;
                }
                // 递减jsonp数量
                jsonpCount --;
                // 调用成功
                onLoadOne();
            }
        }

        function onLoadOne():void
        {
            // 添加标签
            judgeAppend();
            // 如果全部加载完毕则调用回调
            if(!stop && --count === 0) handler();
        }

        function onErrorOne():void
        {
            if(!stop)
            {
                stop = true;
                handler(new Error("JS加载失败"));
            }
        }
    }
}