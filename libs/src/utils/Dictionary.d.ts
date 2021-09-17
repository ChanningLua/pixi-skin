export declare class Dictionary<K, V> {
    private _keyDict;
    private _valueDict;
    get size(): number;
    get keys(): K[];
    get values(): V[];
    set(key: K, value: V): void;
    get(key: K): V;
    delete(key: K): void;
    forEach(callback: (key: K, value: V) => void): void;
}
//# sourceMappingURL=Dictionary.d.ts.map