var ResourceItem = (function () {
    function ResourceItem(name, url, type) {
        this.groupName = "";
        this.data = null;
        this._loaded = false;
        this.name = name;
        this.url = url;
        this.type = type;
    }
    Object.defineProperty(ResourceItem.prototype, "loaded", {
        get: function () {
            return this.data ? this.data.loaded : this._loaded;
        },
        set: function (value) {
            if (this.data)
                this.data.loaded = value;
            this._loaded = value;
        },
        enumerable: false,
        configurable: true
    });
    ResourceItem.TYPE_XML = "xml";
    ResourceItem.TYPE_IMAGE = "image";
    ResourceItem.TYPE_SHEET = "sheet";
    ResourceItem.TYPE_TEXT = "text";
    ResourceItem.TYPE_JSON = "json";
    ResourceItem.TYPE_SOUND = "sound";
    return ResourceItem;
}());
export { ResourceItem };
//# sourceMappingURL=ResourceItem.js.map