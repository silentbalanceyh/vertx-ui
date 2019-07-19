const path = require("path");
module.exports = {
    // 核心模块导入机制
    // Environment包：统一环境包
    environment: path.resolve(__dirname, "../src", "environment"),
    // Entity包：模型包
    entity: path.resolve(__dirname, "../src", "entity"),
    // Language：资源包
    lang: path.resolve(__dirname, "../src", "cab"),
    // ----------------------------组件包----------------------------
    // Control
    web: path.resolve(__dirname, "../src", "economy"),
    // ----------------------------组件包----------------------------
    // 新的Hotel组件包
    app: path.resolve(__dirname, "../src", "app"),
    // 新统一工具包
    ux: path.resolve(__dirname, "../src", "ux"),
    // Fix moment issu
    moment$: "moment/moment.js",
    // Zero Extension
    ex: path.resolve(__dirname, "../src", "extension/library"),
    ei: path.resolve(__dirname, "../src", "extension/ecosystem")
};
