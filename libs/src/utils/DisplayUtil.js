export function replaceDisplay(bridge, current, target) {
    if (current === target)
        return;
    if (bridge.isMySkin(target) && bridge.isMySkin(current)) {
        var parent = bridge.getParent(current);
        if (parent) {
            var index = bridge.getChildIndex(parent, current);
            bridge.addChildAt(parent, target, index);
            bridge.removeChild(parent, current);
        }
    }
}
//# sourceMappingURL=DisplayUtil.js.map