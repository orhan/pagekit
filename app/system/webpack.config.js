var assets = __dirname + "/../assets";

module.exports = [

    {
        entry: {
            "vue": "./app/vue"
        },
        output: {
            filename: "./app/bundle/[name].js"
        },
        resolve: {
            alias: {
                "md5$": assets + "/js-md5/js/md5.min.js",
                "vue-form$": assets + "/vue-form/src/index.js",
                "vue-intl$": assets + "/vue-intl/src/index.js",
                "vue-resource$": assets + "/vue-resource/src/index.js",
                "promise$": assets + "/vue-resource/src/lib/promise.js",
                "lscache$": assets + "/lscache/lscache.js"
            }
        },
        module: {
            loaders: [
                { test: /\.vue$/, loader: "vue" },
                { test: /\.json$/, loader: "json" },
                { test: /\.html$/, loader: "html" }
            ]
        }
    }

];
