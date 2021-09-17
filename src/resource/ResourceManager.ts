import { ResourceLoader } from './ResourceLoader';
import { ResourceConfig } from './ResourceConfig';
import { ResourceItem } from './ResourceItem';
import { Injectable } from './../core/injector/Injector';
import { core } from './../core/Core';
import { JSFile } from './../core/interfaces/JSFile';

@Injectable
export class ResourceManagerClass{

	public GROUP_ERROR    = 'GROUP_ERROR';
	public GROUP_COMPLETE = 'GROUP_COMPLETE';
	public GROUP_PROGRESS = 'GROUP_PROGRESS';
	public LOAD_GROUP_COMPLETE = 'LOAD_GROUP_COMPLETE';
	
	/**
	 * 队列加载器
	 */
	private resourceLoader:ResourceLoader;
	/**
	 * 配置数据
	 */
	private resourceConfig:ResourceConfig;
	 /**
	 * 初始化
	 */
	private init():void{
		
		this.configsList = [];
		this.resourceConfig = new ResourceConfig();
		this.resourceLoader = new ResourceLoader();
		this.resourceLoader.callBack = this.onResourceItemComp;
		this.resourceLoader.resInstance = this;
		this.listen( this.GROUP_COMPLETE, this.onGROUP_COMPLETE, this);
		this.listen( this.GROUP_ERROR, this.onGROUP_ERROR, this);
	}

	private configsList:any[] = [];

	private loadingConfigList:any[];

	/**
	 * 配置文件加载解析完成标志
	 */
	private configComplete:boolean = false;


	public constructor() {
		this.init();
	}

	/**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof ResourceManagerClass
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void{
		core.listen(type,handler,thisArg,once);
	}

	/**
     * 移除内核消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否是一次性监听
     * @memberof Core
     */
	public unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
	{
		core.unlisten(type,handler,thisArg,once);
	}

    private _onConfigComplete:Function;
    private _onConfigCompleteTarget:any;
	private _pathDict = {};
      /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
	 * @param $pilfererLoad   是否静默加载JSON中的Group
     * @memberof ResourceManagerClass
     */
    public addConfig(jsonPath:string, filePath:string = '',pilfererLoad:boolean = false):void {
		let configItem = [jsonPath,filePath,pilfererLoad];
		this._pathDict[filePath + jsonPath] = filePath;
		this.configsList.push(configItem);
	}

     /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     * @memberof ResourceManagerClass
     */
    public loadConfig($onConfigComplete:Function, $onConfigCompleteTarget:any):void {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    }

    /**
     * 加载
     * @memberof ResourceManagerClass
     */
    private loadNextConfig():void {
        //加载完成
        if (this.configsList.length == 0) {
						this.configComplete = true;  
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
						this._onConfigCompleteTarget = null;
            return;
        }
				
		let arr:any = this.configsList.shift();
		this.configPreLoad = arr[2] || false;
		let _str = `${arr[1]}${arr[0]}`;
		this.resourceLoader.loadAssets(_str, this.onConfigCompleteHandle.bind(this));
	}
	private configPreLoad:boolean = false;

     /**
     * 加载完成
	 * @param {any} assets 加载成功反回的数据源
	 * @param {string} path 素材地址
     * @returns {void} 
     * @memberof ResourceManagerClass
     */
    private onConfigCompleteHandle(assets:any, path:string | null) {
			// 获取加载返回的字符串并解析成JSON数据
			let _data = JSON.parse(assets);

			//TODO  修改为不依赖assets/ 通过addConfig传入的prefix解决
			let folder = this._pathDict[path];
			this.resourceConfig.parseConfig( _data, folder);

			// 静默加载解析的JSON Group 
			if(this.configPreLoad && _data && _data.groups.length){
				this.configPreLoad = false;
				let i:number = 0,len = _data.groups.length;
				while(i<len){
					let name = _data.groups[i].name;
					this.pilfererLoadGroup( name);
					i++;
				}
			}

			// 解析成功 开始加载下一个JSON
			this.loadNextConfig();
    }

	/**
	 * 已经加载过组名列表
	 */
	private loadedGroups:string[] = [];
	/**
	 * 检查某个资源组是否已经加载完成
	 * @param {string} name 资源组名称
     * @returns {boolean} 
     * @memberof ResourceManagerClass
	 */
	public isGroupLoaded(name:string):boolean{
		return this.loadedGroups.indexOf(name)!=-1;
	}
	/**
	 * 根据组名获取组加载项列表
	 * @param {string} name 资源组名称
	 * @returns {Array<ResourceItem>}
	 * @memberof ResourceManagerClass
	 */
	public getGroupByName(name:string):Array<ResourceItem>{
		return this.resourceConfig.getGroupByName(name);
	}

	private groupNameList:any[] = [];
	/**
	 * 根据组名加载一组资源
	 * @param {string} name 资源组名称
	 * @param {number} priority 队列优先级
	 * @memberof ResourceManagerClass
	 */
	public loadGroup(name:string,priority:number=0):void{
		if(this.loadedGroups.indexOf(name)!=-1){
			core.dispatch('GROUP_COMPLETE',name);
			return;
		}
		if(this.resourceLoader.isGroupInLoading(name))
			return;
		if(this.configComplete){
			let group:Array<ResourceItem> = this.resourceConfig.getGroupByName(name);
			this.resourceLoader.loadGroup(group,name,priority);
		}
		else{
			this.groupNameList.push({name:name,priority:priority});
		}
	}
	/**
	 * 创建自定义的加载资源组
	 * @param {string} name 要创建的加载资源组的组名
	 * @param {string[]} keys 要包含的键名列表
	 * @param {boolean} override 是否需要覆盖同名资源组 默认false
	 * @returns {boolean} 
	 * @memberof ResourceManagerClass
	 */
	public createGroup(name:string,keys:string[],override:boolean=false):boolean{
		if(override){
			let index:number = this.loadedGroups.indexOf(name);
			if(index!=-1){
				this.loadedGroups.splice(index,1);
			}
		}
		return this.resourceConfig.createGroup(name,keys,override);
	}
	
	/**
	 * 队列加载完成事件
	 * @param {string} groupName 加载成功的资源组名称
	 * @memberof ResourceManagerClass
	 */
	// @GlobalMessageHandler('GROUP_COMPLETE')
	private async onGROUP_COMPLETE(groupName:string){  
		core.dispatch(this.LOAD_GROUP_COMPLETE,groupName);
	}
	/**
	 * 启动延迟的组加载
	 */
	private loadDelayGroups():void{
		let groupNameList:any[] = this.groupNameList;
		this.groupNameList = [];
		let length:number = groupNameList.length;
		for(let i:number=0;i<length;i++){
			let item:any = groupNameList[i];
			this.loadGroup(item.name,item.priority);
		}

	}
	/**
	 * 队列加载失败事件
	 * @param {string} groupname 加载成功的资源组名称
	 * @memberof ResourceManagerClass
	 */
	// @GlobalMessageHandler('GROUP_ERROR')
	private onGROUP_ERROR(groupname):void{
		// 返回加载失败的资源组 + 成功事件 的组合事件
		core.dispatch(`${groupname}_GROUP_ERROR`);
	}

	/**
	 * 解析配置文件
	 * @param {any} data JSON数据源
	 * @param {string} folder 
	 * @memberof ResourceManagerClass
	 */
	public parseConfig(data:any, folder:string):void {
		this.resourceConfig.parseConfig(data,folder);
		if(!this.configComplete&&!this.loadingConfigList){
			this.configComplete = true;
			this.loadDelayGroups();
		}
	}

	/**
     * 获取资源，同步的，且如果找不到资源并不会触发加载
     * 
     * @param {string} keyOrPath 资源的短名称或路径
     * @returns {*} 
     * @memberof ResourceManagerClass
     */
	public async getAssets(key:string, load = true){
		let type:string = this.resourceConfig.getType(key);
		if(type === ""){ 
			return null;
		}

		if(type === 'sound' || type === 'music') return console.log('暂未支持');
		
		if(type === 'text' || type === 'json' || type === 'bin' || type === 'sheet') {
			let url = this.resourceConfig.getResourceItem(key).url;
			return this.resourceLoader.getAssets(url);
		}
	}	

	/**
	 * 获取key对应的加载项信息
	 * 
	 * @param {string} key 资源名称
	 * @returns {ResourceItem} 
	 * @memberof ResourceManagerClass
	 */
	public getResourceItem(key:string){
		return this.resourceConfig.getResourceItem(key);
	}

	/**
	 * 根据URL获取对应的键名
	 * @param {string} key
	 * @memberof ResourceManagerClass
	 */
	public getResourceNameByUrl(key:string):string {
		return this.resourceConfig.getResourceNameByUrl(key);
	}

	/**
     * 加载资源，如果已加载过则同步回调，如果未加载则加载后异步回调
     * 
     * @param {string|string[]} keyOrPath 资源短名称或资源路径
     * @param {(assets?:any|any[])=>void} complete 完成回调，如果加载失败则参数是个Error对象
     * @param {XMLHttpRequestResponseType} [responseType] 加载类型
     * @param {(keyOrPath?:string, assets?:any)=>void} [oneComplete] 一个资源加载完毕会调用这个回调，如果有的话。仅在keyOrPath是数组情况下生效
     * @returns {void} 
     * @memberof ResourceManagerClass
     */
	public loadAssets(keyOrPath:string|string[], complete:(assets?:any|any[], path?:string)=>void, responseType?:XMLHttpRequestResponseType, oneComplete?:(keyOrPath?:string, assets?:any)=>void):void
	{	
		this.resourceLoader.loadAssets(keyOrPath,complete,responseType,oneComplete);
	}

	/**
	 * 异步获取资源参数缓存字典
	 */
	private asyncDic:any = {};

	/**
	 * 一个加载项加载完成  //FIXME
	 */
	private onResourceItemComp(item:ResourceItem):void{
		let argsList:any[] = this.asyncDic[item.name];
		delete this.asyncDic[item.name];
	}

	/**
	 * 获取当前资源是否正在被加载  //FIXME
	 */
	private isResInLoadedGroup(name:string):boolean {
		let loadedGroups:string[] = this.loadedGroups;
		let loadedGroupLength:number = loadedGroups.length;
		for(let i:number = 0 ; i < loadedGroupLength ; i++) {
			let group:any[] = this.resourceConfig.getRawGroupByName(loadedGroups[i]);
			let length:number = group.length;
			for(let j:number = 0 ; j < length ; j++) {
				let item:any = group[j];
				if(item.name == name) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 设置加载线程数				//FIXME
	 * @param thread 
	 */
	public setMaxLoadingThread(thread:number):void{
		if(thread<1){
			thread = 1;
		}
		this.resourceLoader.thread = thread;
	}

	/**
	 * 设置资源加载失败时的重试次数。  //FIXME
	 * @param retry 要设置的重试次数。
	 */
	public setMaxRetryTimes(retry:number):void{
		retry = Math.max(retry, 0);
		this.resourceLoader.maxRetryTimes = retry;
	}

	/**
     * 加载CSS样式文件
     * 
     * @param {string[]} cssFiles 样式文件URL列表
     * @param {(err?:Error)=>void} handler 完成回调
     * @memberof ResourceManagerClass
     */
	public loadStyleFiles(cssFiles:string[], handler:(err?:Error)=>void):void
    {
		this.resourceLoader.loadStyleFiles(cssFiles,handler);
	}


	/**
	 * 加载JS文件
	 * 
	 * @param {JSFile[]} jsFiles js文件列表
	 * @param {(err?:Error)=>void} handler 完成回调
	 * @param {boolean} [ordered=false] 是否保证标签形式js的执行顺序，保证执行顺序会降低标签形式js的加载速度，因为必须串行加载。该参数不会影响JSONP形式的加载速度和执行顺序，JSONP形式脚本总是并行加载且顺序执行的。默认是true
	 * @memberof ResourceManagerClass
	 */
	public loadJsFiles(jsFiles:JSFile[], handler:(err?:Error)=>void, ordered:boolean=false):void
    {
		this.resourceLoader.loadJsFiles(jsFiles,handler,ordered);
	}


	
	/**
	 * 静默加载
	 * @param {string} $groupName 资源组名称
	 * @param {Array<any>} $groupName 所包含的组名称或者key名称数组
	 * @memberof ResourceManagerClass
	 */
	public pilfererLoadGroup($groupName:string, $subGroups:Array<any> = null):void {
			//添加前缀，防止与正常加载组名重复
			var useGroupName = "pilferer_" + $groupName;
			if (!$subGroups) {
					$subGroups = [$groupName];
			}
			this.createGroup(useGroupName, $subGroups, true);
			this.configComplete = true   //TODO 这句代码是为了兼容parseConfig以后加载GROUOP用的，但是可能会导致config队列未完成触发加载GROUP的操作。
			this.loadGroup(useGroupName, -1);
	}
}
/** 再额外导出一个单例 */
export const resourceManager:ResourceManagerClass = core.getInject(ResourceManagerClass);