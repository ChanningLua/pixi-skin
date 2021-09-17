export function getIFrameContainer() {
    var parentWindow = window.parent;
    if (!parentWindow)
        return null;
    var tempIFrames = parentWindow.document.getElementsByTagName("iframe");
    for (var i = 0, len = tempIFrames.length; i < len; i++) {
        var tempIFrame = tempIFrames[i];
        if (tempIFrame.contentWindow === window)
            return tempIFrame;
    }
    return null;
}
export function getRootWindow() {
    var curWindow = window;
    while (curWindow.parent)
        curWindow = curWindow.parent;
    return curWindow;
}
export function isInIframe() {
    return (getIFrameContainer() !== null);
}
//# sourceMappingURL=HTMLUtil.js.map