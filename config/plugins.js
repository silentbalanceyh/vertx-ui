const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const pluginHtml = (env) => {
    if (process.env.Z_4) {
        const isWebpack4 = Boolean(process.env.Z_4);
        if (isWebpack4) {
            return new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw);
        } else {
            return new InterpolateHtmlPlugin(env.raw);
        }
    } else {
        return new InterpolateHtmlPlugin(env.raw);
    }
};
const pluginNonSource = [
    path.resolve(path.join(__dirname, "../.awcache")),
    path.resolve(path.join(__dirname, "../.storybook")),
    path.resolve(path.join(__dirname, "../.cache")),
    path.resolve(path.join(__dirname, "../.zero")),
    path.resolve(path.join(__dirname, "../build")),
    path.resolve(path.join(__dirname, "../config")),
    path.resolve(path.join(__dirname, "../document")),
    path.resolve(path.join(__dirname, "../node_modules")),
    path.resolve(path.join(__dirname, "../public")),
    path.resolve(path.join(__dirname, "../scripts")),
    path.resolve(path.join(__dirname, "../shell")),
    path.resolve(path.join(__dirname, "../stories")),
    path.resolve(path.join(__dirname, "../storybook-static")),
    path.resolve(path.join(__dirname, "../test")),
];
module.exports = {
    pluginHtml,
    pluginNonSource
};