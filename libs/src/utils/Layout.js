export function BasicLayout(target, unscaledWidth, unscaledHeight) {
    if (!target) {
        return;
    }
    var count = target['children'].length;
    var maxX = 0;
    var maxY = 0;
    for (var i = 0; i < count; i++) {
        var layoutElement = target['getChildAt'](i);
        if (!layoutElement.includeInLayout) {
            continue;
        }
        var _config = layoutElement._config;
        var bounds = {
            x: parseFloat(_config.x) || 0,
            y: parseFloat(_config.y) || 0,
            width: parseFloat(_config.width) || layoutElement.width || 0,
            height: parseFloat(_config.height) || layoutElement.height || 0,
        };
        var hCenter = formatRelative(layoutElement.horizontalCenter, unscaledWidth * 0.5);
        var vCenter = formatRelative(layoutElement.verticalCenter, unscaledHeight * 0.5);
        var left = formatRelative(layoutElement.left, unscaledWidth);
        var right = formatRelative(layoutElement.right, unscaledWidth);
        var top_1 = formatRelative(layoutElement.top, unscaledHeight);
        var bottom = formatRelative(layoutElement.bottom, unscaledHeight);
        var percentWidth = layoutElement.percentWidth;
        var percentHeight = layoutElement.percentHeight;
        var childWidth = NaN;
        var childHeight = NaN;
        if (!isNaN(left) && !isNaN(right)) {
            childWidth = unscaledWidth - right - left;
        }
        else if (!isNaN(percentWidth)) {
            childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
        }
        if (!isNaN(top_1) && !isNaN(bottom)) {
            childHeight = unscaledHeight - bottom - top_1;
        }
        else if (!isNaN(percentHeight)) {
            childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
        }
        layoutElement.explicitWidth = childWidth;
        layoutElement.explicitHeight = childHeight;
        var elementWidth = bounds.width;
        var elementHeight = bounds.height;
        var childX = NaN;
        var childY = NaN;
        if (!isNaN(hCenter)) {
            childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
        }
        else if (!isNaN(left)) {
            childX = left;
        }
        else if (!isNaN(right)) {
            childX = unscaledWidth - elementWidth - right;
        }
        else {
            childX = bounds.x;
        }
        if (!isNaN(vCenter)) {
            childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
        }
        else if (!isNaN(top_1)) {
            childY = top_1;
        }
        else if (!isNaN(bottom)) {
            childY = unscaledHeight - elementHeight - bottom;
        }
        else {
            childY = bounds.y;
        }
        layoutElement.x = childX;
        layoutElement.y = childY;
    }
}
function formatRelative(value, total) {
    if (!value || typeof value === 'number') {
        return value;
    }
    var str = value;
    var index = str.indexOf('%');
    if (index === -1) {
        return +str;
    }
    var percent = +str.substring(0, index);
    return percent * 0.01 * total;
}
//# sourceMappingURL=Layout.js.map