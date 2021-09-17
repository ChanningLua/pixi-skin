var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
import { ResourceLoader } from './ResourceLoader';
import { ResourceConfig } from './ResourceConfig';
import { Injectable } from './../core/injector/Injector';
import { core } from './../core/Core';
var ResourceManagerClass = (function () {
    function ResourceManagerClass() {
        this.GROUP_ERROR = 'GROUP_ERROR';
        this.GROUP_COMPLETE = 'GROUP_COMPLETE';
        this.GROUP_PROGRESS = 'GROUP_PROGRESS';
        this.LOAD_GROUP_COMPLETE = 'LOAD_GROUP_COMPLETE';
        this.configsList = [];
        this.configComplete = false;
        this._pathDict = {};
        this.configPreLoad = false;
        this.loadedGroups = [];
        this.groupNameList = [];
        this.asyncDic = {};
        this.init();
    }
    ResourceManagerClass.prototype.init = function () {
        this.configsList = [];
        this.resourceConfig = new ResourceConfig();
        this.resourceLoader = new ResourceLoader();
        this.resourceLoader.callBack = this.onResourceItemComp;
        this.resourceLoader.resInstance = this;
        this.listen(this.GROUP_COMPLETE, this.onGROUP_COMPLETE, this);
        this.listen(this.GROUP_ERROR, this.onGROUP_ERROR, this);
    };
    ResourceManagerClass.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        core.listen(type, handler, thisArg, once);
    };
    ResourceManagerClass.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        core.unlisten(type, handler, thisArg, once);
    };
    ResourceManagerClass.prototype.addConfig = function (jsonPath, filePath, pilfererLoad) {
        if (filePath === void 0) { filePath = ''; }
        if (pilfererLoad === void 0) { pilfererLoad = false; }
        var configItem = [jsonPath, filePath, pilfererLoad];
        this._pathDict[filePath + jsonPath] = filePath;
        this.configsList.push(configItem);
    };
    ResourceManagerClass.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    ResourceManagerClass.prototype.loadNextConfig = function () {
        if (this.configsList.length == 0) {
            this.configComplete = true;
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this.configsList.shift();
        this.configPreLoad = arr[2] || false;
        var _str = "" + arr[1] + arr[0];
        this.resourceLoader.loadAssets(_str, this.onConfigCompleteHandle.bind(this));
    };
    ResourceManagerClass.prototype.onConfigCompleteHandle = function (assets, path) {
        var _data = JSON.parse(assets);
        var folder = this._pathDict[path];
        this.resourceConfig.parseConfig(_data, folder);
        if (this.configPreLoad && _data && _data.groups.length) {
            this.configPreLoad = false;
            var i = 0, len = _data.groups.length;
            while (i < len) {
                var name_1 = _data.groups[i].name;
                this.pilfererLoadGroup(name_1);
                i++;
            }
        }
        this.loadNextConfig();
    };
    ResourceManagerClass.prototype.isGroupLoaded = function (name) {
        return this.loadedGroups.indexOf(name) != -1;
    };
    ResourceManagerClass.prototype.getGroupByName = function (name) {
        return this.resourceConfig.getGroupByName(name);
    };
    ResourceManagerClass.prototype.loadGroup = function (name, priority) {
        if (priority === void 0) { priority = 0; }
        if (this.loadedGroups.indexOf(name) != -1) {
            core.dispatch('GROUP_COMPLETE', name);
            return;
        }
        if (this.resourceLoader.isGroupInLoading(name))
            return;
        if (this.configComplete) {
            var group = this.resourceConfig.getGroupByName(name);
            this.resourceLoader.loadGroup(group, name, priority);
        }
        else {
            this.groupNameList.push({ name: name, priority: priority });
        }
    };
    ResourceManagerClass.prototype.createGroup = function (name, keys, override) {
        if (override === void 0) { override = false; }
        if (override) {
            var index = this.loadedGroups.indexOf(name);
            if (index != -1) {
                this.loadedGroups.splice(index, 1);
            }
        }
        return this.resourceConfig.createGroup(name, keys, override);
    };
    ResourceManagerClass.prototype.onGROUP_COMPLETE = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                core.dispatch(this.LOAD_GROUP_COMPLETE, groupName);
                return [2];
            });
        });
    };
    ResourceManagerClass.prototype.loadDelayGroups = function () {
        var groupNameList = this.groupNameList;
        this.groupNameList = [];
        var length = groupNameList.length;
        for (var i = 0; i < length; i++) {
            var item = groupNameList[i];
            this.loadGroup(item.name, item.priority);
        }
    };
    ResourceManagerClass.prototype.onGROUP_ERROR = function (groupname) {
        core.dispatch(groupname + "_GROUP_ERROR");
    };
    ResourceManagerClass.prototype.parseConfig = function (data, folder) {
        this.resourceConfig.parseConfig(data, folder);
        if (!this.configComplete && !this.loadingConfigList) {
            this.configComplete = true;
            this.loadDelayGroups();
        }
    };
    ResourceManagerClass.prototype.getAssets = function (key, load) {
        if (load === void 0) { load = true; }
        return __awaiter(this, void 0, void 0, function () {
            var type, url;
            return __generator(this, function (_a) {
                type = this.resourceConfig.getType(key);
                if (type === "") {
                    return [2, null];
                }
                if (type === 'sound' || type === 'music')
                    return [2, console.log('暂未支持')];
                if (type === 'text' || type === 'json' || type === 'bin' || type === 'sheet') {
                    url = this.resourceConfig.getResourceItem(key).url;
                    return [2, this.resourceLoader.getAssets(url)];
                }
                return [2];
            });
        });
    };
    ResourceManagerClass.prototype.getResourceItem = function (key) {
        return this.resourceConfig.getResourceItem(key);
    };
    ResourceManagerClass.prototype.getResourceNameByUrl = function (key) {
        return this.resourceConfig.getResourceNameByUrl(key);
    };
    ResourceManagerClass.prototype.loadAssets = function (keyOrPath, complete, responseType, oneComplete) {
        this.resourceLoader.loadAssets(keyOrPath, complete, responseType, oneComplete);
    };
    ResourceManagerClass.prototype.onResourceItemComp = function (item) {
        var argsList = this.asyncDic[item.name];
        delete this.asyncDic[item.name];
    };
    ResourceManagerClass.prototype.isResInLoadedGroup = function (name) {
        var loadedGroups = this.loadedGroups;
        var loadedGroupLength = loadedGroups.length;
        for (var i = 0; i < loadedGroupLength; i++) {
            var group = this.resourceConfig.getRawGroupByName(loadedGroups[i]);
            var length_1 = group.length;
            for (var j = 0; j < length_1; j++) {
                var item = group[j];
                if (item.name == name) {
                    return true;
                }
            }
        }
        return false;
    };
    ResourceManagerClass.prototype.setMaxLoadingThread = function (thread) {
        if (thread < 1) {
            thread = 1;
        }
        this.resourceLoader.thread = thread;
    };
    ResourceManagerClass.prototype.setMaxRetryTimes = function (retry) {
        retry = Math.max(retry, 0);
        this.resourceLoader.maxRetryTimes = retry;
    };
    ResourceManagerClass.prototype.loadStyleFiles = function (cssFiles, handler) {
        this.resourceLoader.loadStyleFiles(cssFiles, handler);
    };
    ResourceManagerClass.prototype.loadJsFiles = function (jsFiles, handler, ordered) {
        if (ordered === void 0) { ordered = false; }
        this.resourceLoader.loadJsFiles(jsFiles, handler, ordered);
    };
    ResourceManagerClass.prototype.pilfererLoadGroup = function ($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        this.createGroup(useGroupName, $subGroups, true);
        this.configComplete = true;
        this.loadGroup(useGroupName, -1);
    };
    ResourceManagerClass = __decorate([
        Injectable,
        __metadata("design:paramtypes", [])
    ], ResourceManagerClass);
    return ResourceManagerClass;
}());
export { ResourceManagerClass };
export var resourceManager = core.getInject(ResourceManagerClass);
//# sourceMappingURL=ResourceManager.js.map