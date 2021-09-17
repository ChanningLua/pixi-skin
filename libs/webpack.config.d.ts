declare const _exports: {
    entry: string;
    output: {
        path: string;
        filename: string;
    };
    resolve: {
        extensions: string[];
    };
    module: {
        rules: ({
            test: RegExp;
            exclude: RegExp;
            loader: string;
        } | {
            test: RegExp;
            loader: string;
        } | {
            test: RegExp;
            loader: string;
            options: {
                limit: number;
            };
        })[];
    };
    plugins: any[];
    devServer: {
        port: number;
        historyApiFallback: boolean;
    };
};
export = _exports;
//# sourceMappingURL=webpack.config.d.ts.map