export class ResourceItem{


	/**
	 *
	 * XML 文件。
	 */
	public static TYPE_XML:string = "xml";

	/**
	 *
	 * 图片文件。
	 */
	public static TYPE_IMAGE:string = "image";
	
	/**
	 *
	 * 图片文件。
	 */
	public static TYPE_SHEET:string = "sheet";

	/**
	 *
	 * 文本文件。
	 */
	public static TYPE_TEXT:string = "text";

	/**
	 *
	 * JSON 文件。
	 */
	public static TYPE_JSON:string = "json";

	/**
	 *
	 * 声音文件。
	 */
	public static TYPE_SOUND:string = "sound";


	/**
	 *
	 * 构造函数。
	 * @param name 加载项名称。
	 * @param url 要加载的文件地址。
	 * @param type 加载项文件类型。
	 * @memberof ResourceItem
	 */
	public constructor(name:string,url:string,type:string){
		this.name = name;
		this.url = url;
		this.type = type;
	}

	/**
	 *
	 * 加载项名称。
	 */
	public name:string;

	/**
	 *
	 * 要加载的文件地址。
	 */
	public url:string;

	/**
	 *
	 * 加载项文件类型。
	 */
	public type:string;

	/**
	 *
	 * 资源所属的组名。
	 */
	public groupName:string = "";

	/**
	 *
	 * 被引用的原始数据对象。
	 */
	public data:any = null;
	
	private _loaded:boolean = false;

	/**
	 *
	 * 加载完成的标志。
	 */
	public get loaded():boolean{
		return this.data?this.data.loaded:this._loaded;
	}

	public set loaded(value:boolean){
		if(this.data)
			this.data.loaded = value;
		this._loaded = value;
	}
}