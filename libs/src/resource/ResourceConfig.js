import { ResourceItem } from './ResourceItem';
var ResourceConfig = (function () {
    function ResourceConfig() {
        this.keyMap = {};
        this.groupDic = {};
    }
    ResourceConfig.prototype.getGroupByName = function (name) {
        var group = new Array();
        if (!this.groupDic[name])
            return group;
        var list = this.groupDic[name];
        var length = list.length, i = 0;
        for (; i < length; i++) {
            var obj = list[i];
            group.push(this.parseResourceItem(obj));
        }
        return group;
    };
    ResourceConfig.prototype.getRawGroupByName = function (name) {
        if (this.groupDic[name])
            return this.groupDic[name];
        return [];
    };
    ResourceConfig.prototype.createGroup = function (name, keys, override) {
        if (override === void 0) { override = false; }
        if ((!override && this.groupDic[name]) || !keys || keys.length == 0)
            return false;
        var groupDic = this.groupDic;
        var group = [];
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            var g = groupDic[key];
            if (g) {
                var len = g.length;
                for (var j = 0; j < len; j++) {
                    var item = g[j];
                    if (group.indexOf(item) == -1)
                        group.push(item);
                }
            }
            else {
                var item = this.keyMap[key];
                if (item) {
                    if (group.indexOf(item) == -1)
                        group.push(item);
                }
                else {
                    console.error(key);
                }
            }
        }
        if (group.length == 0)
            return false;
        this.groupDic[name] = group;
        return true;
    };
    ResourceConfig.prototype.parseConfig = function (data, folder) {
        if (!data)
            return;
        var resources = data["resources"];
        if (resources) {
            var len = resources.length, i = 0;
            for (; i < len; i++) {
                var item = resources[i];
                var url = item.url;
                if (url && url.indexOf("://") == -1) {
                    item.url = folder + url;
                }
                this.addItemToKeyMap(item);
            }
        }
        var groups = data["groups"];
        if (groups) {
            var len = groups.length, i = 0;
            for (; i < len; i++) {
                var group = groups[i];
                var list = [];
                var keys = group.keys.split(",");
                var l = keys.length, j = 0;
                for (; j < l; j++) {
                    var name_1 = keys[j].trim();
                    var item = this.keyMap[name_1];
                    if (item && list.indexOf(item) == -1) {
                        list.push(item);
                    }
                }
                this.groupDic[group.name] = list;
            }
        }
    };
    ResourceConfig.prototype.addSubkey = function (subkey, name) {
        var item = this.keyMap[name];
        if (item && !this.keyMap[subkey]) {
            this.keyMap[subkey] = item;
        }
    };
    ResourceConfig.prototype.addItemToKeyMap = function (item) {
        if (!this.keyMap[item.name])
            this.keyMap[item.name] = item;
    };
    ResourceConfig.prototype.getName = function (key) {
        var data = this.keyMap[key];
        return data ? data.name : "";
    };
    ResourceConfig.prototype.getType = function (key) {
        var data = this.keyMap[key];
        return data ? data.type : "";
    };
    ResourceConfig.prototype.getResourceItem = function (key) {
        var data = this.keyMap[key];
        if (data)
            return this.parseResourceItem(data);
        return null;
    };
    ResourceConfig.prototype.parseResourceItem = function (data) {
        var resItem = new ResourceItem(data.name, data.url, data.type);
        resItem.data = data;
        return resItem;
    };
    return ResourceConfig;
}());
export { ResourceConfig };
//# sourceMappingURL=ResourceConfig.js.map