const path = require("path");
module.exports = {
    // Environment包：统一环境包
    environment: path.resolve(__dirname, "../src", "environment"),
    // Entity包：模型包
    entity: path.resolve(__dirname, "../src", "entity"),
    // Language：资源包
    lang: path.resolve(__dirname, "../src", "cab"),
    // Control
    web: path.resolve(__dirname, "../src", "economy"),
    // 新的Hotel组件包
    app: path.resolve(__dirname, "../src", "app"),
    // 新统一工具包
    ux: path.resolve(__dirname, "../src", "ux"),
    // Fix moment issu
    moment$: "moment/moment.js",
    // Zero Extension
    ex: path.resolve(__dirname, "../src", "extension/library"),     // Ex 库
    ei: path.resolve(__dirname, "../src", "extension/ecosystem"),   // Ex 专用组件
    oi: path.resolve(__dirname, "../src", "extension/eclat"),       // Ox 专用组件
    plugin: path.resolve(__dirname, "../src", "plugin"),            // 插件

    // Mock 专用
    mock: path.resolve(__dirname, "../src", "mock"),                // Mock 专用数据
};
