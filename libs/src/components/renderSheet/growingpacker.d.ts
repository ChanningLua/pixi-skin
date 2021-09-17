export class GrowingPacker {
    constructor(max: any, first: any, buffer: any);
    max: any;
    buffer: any;
    root: {
        x: number;
        y: number;
        w: any;
        h: any;
    };
    finish(maxSize: any): number;
    add(block: any, canvasNumber: any): boolean;
    findNode(root: any, w: any, h: any): any;
    splitNode(node: any, w: any, h: any): any;
    growNode(w: any, h: any): any;
    growRight(w: any, h: any): any;
    growDown(w: any, h: any): any;
}
//# sourceMappingURL=growingpacker.d.ts.map