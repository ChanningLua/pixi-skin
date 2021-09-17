var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { core } from "./../core/Core";
import { JSLoadMode } from './../core/interfaces/JSFile';
import { unique } from "./../utils/ArrayUtil";
import { load } from "./../utils/HTTPUtil";
import { isAbsolutePath } from "./../utils/URLUtil";
var ResourceLoader = (function () {
    function ResourceLoader() {
        this._assetsDict = {};
        this.thread = 3;
        this.loadingCount = 0;
        this.callBack = null;
        this.resInstance = null;
        this.groupTotalDic = {};
        this.numLoadedDic = {};
        this.itemListDic = {};
        this.groupErrorDic = {};
        this.retryTimesDic = {};
        this.maxRetryTimes = 3;
        this.failedList = new Array();
        this.priorityQueue = {};
        this.lazyLoadList = new Array();
        this.queueIndex = 0;
    }
    ResourceLoader.prototype.isGroupInLoading = function (groupName) {
        return this.itemListDic[groupName] !== undefined;
    };
    ResourceLoader.prototype.loadGroup = function (list, groupName, priority) {
        if (priority === void 0) { priority = 0; }
        if (this.itemListDic[groupName] || !groupName) {
            console.trace('RESOURCE: groupName is undefined');
            return;
        }
        if (!list || list.length === 0) {
            console.trace('RESOURCE: resource list is null');
            return;
        }
        if (this.priorityQueue[priority]) {
            this.priorityQueue[priority].push(groupName);
        }
        else {
            this.priorityQueue[priority] = [groupName];
        }
        this.itemListDic[groupName] = list;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var resourceItem = list[i];
            resourceItem.groupName = groupName;
        }
        this.groupTotalDic[groupName] = list.length;
        this.numLoadedDic[groupName] = 0;
        this.next();
    };
    ResourceLoader.prototype.loadItem = function (resourceItem) {
        this.lazyLoadList.push(resourceItem);
        resourceItem.groupName = "";
        this.next();
    };
    ResourceLoader.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, state_1;
            return __generator(this, function (_a) {
                _loop_1 = function () {
                    var resourceItem = this_1.getOneResourceItem();
                    if (!resourceItem)
                        return "break";
                    this_1.loadingCount++;
                    if (resourceItem.loaded) {
                        this_1.onItemComplete(resourceItem);
                    }
                    else {
                        var responseType = void 0;
                        switch (resourceItem.type) {
                            case 'sound':
                            case 'music':
                                resourceItem.loaded = true;
                                this_1.onItemComplete(resourceItem);
                                return { value: void 0 };
                                break;
                            case 'image':
                                responseType = 'blob';
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
                        this_1.loadAssets(resourceItem.url, function (result) {
                            resourceItem.loaded = true;
                            this.onItemComplete(resourceItem);
                        }.bind(this_1), responseType);
                    }
                };
                this_1 = this;
                while (this.loadingCount < this.thread) {
                    state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    if (state_1 === "break")
                        break;
                }
                return [2];
            });
        });
    };
    ResourceLoader.prototype.getOneResourceItem = function () {
        if (this.failedList.length > 0)
            return this.failedList.shift();
        var maxPriority = Number.NEGATIVE_INFINITY;
        for (var p in this.priorityQueue) {
            maxPriority = Math.max(maxPriority, p);
        }
        var queue = this.priorityQueue[maxPriority];
        if (!queue || queue.length === 0) {
            if (this.lazyLoadList.length === 0)
                return null;
            return this.lazyLoadList.pop();
        }
        var length = queue.length;
        var list;
        for (var i = 0; i < length; i++) {
            if (this.queueIndex >= length)
                this.queueIndex = 0;
            list = this.itemListDic[queue[this.queueIndex]];
            if (list.length > 0)
                break;
            this.queueIndex++;
        }
        if (list.length == 0)
            return null;
        return list.shift();
    };
    ResourceLoader.prototype.onItemComplete = function (resourceItem) {
        this.loadingCount--;
        var groupName = resourceItem.groupName;
        if (!resourceItem.loaded) {
            var times = this.retryTimesDic[resourceItem.name] || 1;
            if (times > this.maxRetryTimes) {
                delete this.retryTimesDic[resourceItem.name];
            }
            else {
                this.retryTimesDic[resourceItem.name] = times + 1;
                this.failedList.push(resourceItem);
                this.next();
                return;
            }
        }
        if (groupName) {
            this.numLoadedDic[groupName]++;
            var itemsLoaded = this.numLoadedDic[groupName];
            var itemsTotal = this.groupTotalDic[groupName];
            if (!resourceItem.loaded) {
                this.groupErrorDic[groupName] = true;
            }
            core.dispatch(this.resInstance.GROUP_PROGRESS, groupName, resourceItem, itemsLoaded, itemsTotal);
            if (itemsLoaded == itemsTotal) {
                var groupError = this.groupErrorDic[groupName];
                this.removeGroupName(groupName);
                delete this.groupTotalDic[groupName];
                delete this.numLoadedDic[groupName];
                delete this.itemListDic[groupName];
                delete this.groupErrorDic[groupName];
                if (groupError) {
                    core.dispatch(this.resInstance.GROUP_ERROR, groupName);
                }
                else {
                    core.dispatch(this.resInstance.GROUP_COMPLETE, groupName);
                }
                return;
            }
        }
        else {
            this.callBack.call(this.resInstance, resourceItem);
        }
        this.next();
    };
    ResourceLoader.prototype.removeGroupName = function (groupName) {
        for (var p in this.priorityQueue) {
            var queue = this.priorityQueue[p];
            var index = 0;
            var found = false;
            var length_1 = queue.length;
            for (var i = 0; i < length_1; i++) {
                var name_1 = queue[i];
                if (name_1 == groupName) {
                    queue.splice(index, 1);
                    found = true;
                    break;
                }
                index++;
            }
            if (found) {
                if (queue.length == 0) {
                    delete this.priorityQueue[p];
                }
                break;
            }
        }
    };
    ResourceLoader.prototype.getAssets = function (keyOrPath) {
        var path = keyOrPath;
        var result = this._assetsDict[path];
        if (result instanceof Array)
            return undefined;
        else
            return result;
    };
    ResourceLoader.prototype.loadAssets = function (keyOrPath, complete, responseType, oneComplete) {
        var _this = this;
        if (!keyOrPath) {
            complete && complete(value);
            return;
        }
        if (keyOrPath instanceof Array) {
            keyOrPath = unique(keyOrPath);
            var count = keyOrPath.length;
            var results = [];
            if (count > 0) {
                var handler = function (path, assets) {
                    oneComplete && oneComplete(path, assets);
                    var index = keyOrPath.indexOf(path);
                    results[index] = assets;
                    if (--count === 0)
                        complete && complete(results);
                };
                for (var i = 0, len = count; i < len; i++) {
                    var path = keyOrPath[i];
                    this.loadAssets(path, null, null, handler);
                }
            }
            else {
                complete && complete(results, path);
            }
        }
        else {
            var path = keyOrPath;
            var value = this._assetsDict[path];
            if (value instanceof Array) {
                value.push(complete);
            }
            else if (value) {
                oneComplete && oneComplete(keyOrPath, value);
                complete && complete(value, keyOrPath);
            }
            else {
                this._assetsDict[path] = value = [function (result) {
                        oneComplete && oneComplete(keyOrPath, result);
                        complete && complete(result, path);
                    }];
                load({
                    url: path,
                    responseType: responseType,
                    onResponse: function (result) {
                        var e_1, _a;
                        _this._assetsDict[path] = result;
                        try {
                            for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                                var handler = value_1_1.value;
                                handler(result);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    },
                    onError: function (err) {
                        var e_2, _a;
                        delete _this._assetsDict[path];
                        try {
                            for (var value_2 = __values(value), value_2_1 = value_2.next(); !value_2_1.done; value_2_1 = value_2.next()) {
                                var handler = value_2_1.value;
                                handler(err);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (value_2_1 && !value_2_1.done && (_a = value_2.return)) _a.call(value_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                });
            }
        }
    };
    ResourceLoader.prototype.loadStyleFiles = function (cssFiles, handler) {
        var e_3, _a;
        if (!cssFiles || cssFiles.length === 0) {
            handler();
            return;
        }
        var count = cssFiles.length;
        var stop = false;
        try {
            for (var cssFiles_1 = __values(cssFiles), cssFiles_1_1 = cssFiles_1.next(); !cssFiles_1_1.done; cssFiles_1_1 = cssFiles_1.next()) {
                var cssFile = cssFiles_1_1.value;
                var cssNode = document.createElement("link");
                cssNode.rel = "stylesheet";
                cssNode.type = "text/css";
                cssNode.href = cssFile;
                cssNode.onload = onLoadOne;
                cssNode.onerror = onErrorOne;
                document.body.appendChild(cssNode);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (cssFiles_1_1 && !cssFiles_1_1.done && (_a = cssFiles_1.return)) _a.call(cssFiles_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        function onLoadOne() {
            if (!stop && --count === 0)
                handler();
        }
        function onErrorOne(evt) {
            if (!stop) {
                stop = true;
                handler(new Error("CSS加载失败"));
            }
        }
    };
    ResourceLoader.prototype.loadJsFiles = function (jsFiles, handler, ordered) {
        if (ordered === void 0) { ordered = false; }
        if (!jsFiles || jsFiles.length === 0) {
            handler();
            return;
        }
        jsFiles = jsFiles.concat();
        var count = jsFiles.length;
        var jsonpCount = 0;
        var stop = false;
        var nodes = [];
        for (var i in jsFiles) {
            var jsFile = jsFiles[i];
            if (typeof jsFile === "string") {
                jsFiles[i] = jsFile = {
                    url: jsFile,
                    mode: JSLoadMode.AUTO
                };
            }
            var jsNode = document.createElement("script");
            jsNode.type = "text/javascript";
            nodes.push(jsNode);
            if (jsFile.mode === JSLoadMode.JSONP || (jsFile.mode === JSLoadMode.AUTO && !isAbsolutePath(jsFile.url))) {
                this.loadAssets(jsFile.url, null, null, onCompleteOne);
                jsonpCount++;
            }
            else {
                jsNode.onload = onLoadOne;
                jsNode.onerror = onErrorOne;
                jsNode.src = jsFile.url;
            }
        }
        var appendIndex = 0;
        judgeAppend();
        function judgeAppend() {
            if (jsonpCount === 0) {
                for (var i = appendIndex, len = nodes.length; i < len;) {
                    var node = nodes[i];
                    document.body.appendChild(node);
                    appendIndex = ++i;
                    if (ordered && node.src)
                        break;
                }
            }
        }
        function onCompleteOne(url, result) {
            if (result instanceof Error) {
                onErrorOne();
            }
            else {
                var index = -1;
                for (var i = 0, len = jsFiles.length; i < len; i++) {
                    var jsFile = jsFiles[i];
                    if (jsFile.url === url) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) {
                    var jsNode = nodes[index];
                    jsNode.innerHTML = result;
                }
                jsonpCount--;
                onLoadOne();
            }
        }
        function onLoadOne() {
            judgeAppend();
            if (!stop && --count === 0)
                handler();
        }
        function onErrorOne() {
            if (!stop) {
                stop = true;
                handler(new Error("JS加载失败"));
            }
        }
    };
    return ResourceLoader;
}());
export { ResourceLoader };
//# sourceMappingURL=ResourceLoader.js.map