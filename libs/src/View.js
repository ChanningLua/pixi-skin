import { parseSkinConfig } from './utils/SkinParser';
import { Component } from './components/Component';
var View = (function () {
    function View() {
        this.compoment = null;
    }
    View.prototype.parseSkinConfig = function (name) {
        this.compoment = new Component();
        parseSkinConfig(this.compoment, name);
    };
    View.prototype.getSkin = function () {
        return this.compoment;
    };
    return View;
}());
export { View };
//# sourceMappingURL=View.js.map