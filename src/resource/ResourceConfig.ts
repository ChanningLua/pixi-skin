import {ResourceItem} from './ResourceItem';


/**
 * FIXME 
 */
export class ResourceConfig {
	/**
	 * 根据组名获取组加载项列表
	 * @param {string} name 
	 * @memberof ResourceConfig
	 */
	public getGroupByName(name:string):Array<ResourceItem> {
		let group:Array<ResourceItem> = new Array<ResourceItem>();
		//判断前置条件
		if (!this.groupDic[name])
			return group;

		//根据祖组名获取对应的列表
		let list:any[] = this.groupDic[name];

		let length:number = list.length,i:number = 0;
		for  ( ; i < length; i++) {
			let obj:any = list[i];
			group.push(this.parseResourceItem(obj));
		}
		return group;
	}
	/**
	 * 根据组名获取原始的组加载项列表
	 * @param {string} name 
	 * @memberof ResourceConfig
	 */
	public getRawGroupByName(name:string):any[]{
		if (this.groupDic[name])
			return this.groupDic[name];
		return [];
	}

	/**
	 * 创建自定义加载组
	 * @param {string} name 自定义的组名
	 * @param {string[]} keys {ResourceItem}
	 * @param {boolean} override 是否覆盖原有组名，默认不覆盖 
	 * @memberof ResourceConfig
	 */
	public createGroup(name:string, keys:string[], override:boolean = false):boolean {
		// 过滤无效信息
		if ((!override && this.groupDic[name]) || !keys || keys.length == 0)
			return false;
		// 开始组建加载项信息
		let groupDic:any = this.groupDic;
		let group:any[] = [];
		let length:number = keys.length;
		for (let i:number = 0; i < length; i++) {
			let key:string = keys[i];
			let g:any[] = groupDic[key];
			// 判断是否已有该组名 如果有则重新组合
			if(g){
				let len:number = g.length;
				for(let j:number=0;j<len;j++){
					let item:any = g[j];
					if (group.indexOf(item) == -1)
						group.push(item);
				}
			}
			else{
				// 传入的item信息有误
				let item = this.keyMap[key];
				if (item){
					if(group.indexOf(item) == -1)
						group.push(item);
				}
				else{
					console.error(key);
				}
			}

		}
		// 创建失败，信息不正确
		if (group.length == 0)
			return false;
		this.groupDic[name] = group;
		// 创建成功，返回true
		return true;
	}

	/**
	 * 一级键名字典
	 */
	private keyMap:any = {};
	/**
	 * URL字典
	 */
	private urlMap:any = {};
	/**
	 * 加载组字典
	 */
	private groupDic:any = {};

	/**
	 * 解析一个配置文件
	 * @param {any}} data assets.json
	 * @param {string} floder 素材前置路径
	 * @memberof ResourceConfig
	 */
	public parseConfig(data:any, folder:string):void {
		// 判断数据来源
		if (!data)
			return;

		// 获取数据
		let resources:any[] = data["resources"];
		if (resources) {
			let len:number = resources.length, i = 0;
			for (; i < len; i++) {
				let item:any = resources[i];
				let url:string = item.url;
				if(url&&url.indexOf("://")==-1){
					item.url = folder + url;
				}
				// 获取数据对应的KEY VULUE
				this.addItemToKeyMap(item);
			}
		}

		//解析数据到字典
		let groups:any[] = data["groups"];
		if (groups) {
			let len = groups.length,i = 0
			for ( ; i < len; i++) {
				let group:any = groups[i];
				let list:any[] = [];
				let keys:string[] = (<string> group.keys).split(",");

				let l:number = keys.length ,j = 0;
				for ( ; j < l; j++) {
					let name:string = keys[j].trim();
					let item = this.keyMap[name];
					if (item && list.indexOf(item) == -1) {
						list.push(item);
					}
				}
				this.groupDic[group.name] = list;
			}
		}
	}

	/**
	 * 添加一个二级键名到配置列表
	 * @param {string} subkey  item {name}
	 * @param {string} name item{value} 
	 * @memberof ResourceConfig
	 */
	public addSubkey(subkey:string,name:string):void{
		let item:any = this.keyMap[name];
		if(item&&!this.keyMap[subkey]){
			this.keyMap[subkey] = item;
		}
	}

	/**
	 * 添加一个加载项数据到列表
	 * @param {any} item  ResourceItem
	 * @memberof ResourceConfig
	 */
	public addItemToKeyMap(item:any):void{
		if(!this.keyMap[item.name]) {
			this.keyMap[item.name] = item;
			this.urlMap[item.url] = item.name;
		}
	}

	/**
	 * 获取加载项的name属性
	 * @param {string} key 缓存键名
	 * @memberof ResourceConfig
	 */
	public getName(key:string):string{
		let data:any = this.keyMap[key];
		return data ? data.name : "";
	}

	/**
	 * 获取加载项类型。
	 * @param {string} key
	 * @memberof ResourceConfig
	 */
	public getType(key:string):string {
		let data:any = this.keyMap[key];
		return data ? data.type : "";
	}

	/**
	 * 获取加载项信息对象
	 * @param {string} key
	 * @memberof ResourceConfig
	 */
	public getResourceItem(key:string):ResourceItem {
		let data:any = this.keyMap[key];
		if (data)
			return this.parseResourceItem(data);
		return null;
	}

	/**
	 * 根据URL获取对应的键名
	 * @param {string} key
	 * @memberof ResourceConfig
	 */
	public getResourceNameByUrl(key:string):string {
		return this.urlMap[key] || null;
	}

	/**
	 * 转换Object数据为ResourceItem对象
	 * @param {any} data 一组key:value对象
	 * @memberof ResourceConfig
	 */
	private parseResourceItem(data:any):ResourceItem {
		let resItem:ResourceItem = new ResourceItem(data.name, data.url, data.type);
		resItem.data = data;
		return resItem;
	}
}