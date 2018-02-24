const path = require("path");
module.exports = {
    // 核心模块导入机制
    // Environment包：统一环境包
    environment: path.resolve(__dirname, "../src", "environment"),
    // Entity包：模型包
    entity: path.resolve(__dirname, "../src", "entity"),
    // Hooker包：钩子函数包
    hooker: path.resolve(__dirname, "../src", "hooker"),
    // Language：资源包
    lang: path.resolve(__dirname, "../src", "cab"),
    // ----------------------------组件包----------------------------
    // Conjunction包
    conjunction: path.resolve(__dirname, "../src", "conjunction"),
    // Coaction包
    coaction: path.resolve(__dirname, "../src", "coaction"),
    // Combination
    combination: path.resolve(__dirname, "../src", "combination"),
    // Control
    control: path.resolve(__dirname, "../src", "control"),
    // vie-joy
    "vie-joy": path.resolve(__dirname, "../src", "vie-joy"),
    // ----------------------------组件包----------------------------
    // Bind，新工具包
    anima: path.resolve(__dirname, "../src", "anima"),

    // ----------------------------组件包----------------------------
    // 新的Hotel组件包
    hotel: path.resolve(__dirname, "../src", "hotel"),
    // 新统一工具包
    ux: path.resolve(__dirname, "../src", "ux"),
    // Annotation
    anno: path.resolve(__dirname, "../src", "anno"),
    // Fix moment issu
    moment$: "moment/moment.js"
};
