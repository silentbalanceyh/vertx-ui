export default {
    $$: {
        // 专用的组件模式切换，Symbol变量
        DataSource: {
            /**
             * 组件遵循React流程，直接传入$category到组件内部
             * 不执行任何rx开头的相关方法，数据来源于父组件
             */
            Property: Symbol.for("Property"),
            /**
             * 组件遵循Redux流程，执行以rx开头的相关方法，数据来源于
             * 自身调用rx函数来获取，如rxSearch，rxTree等
             */
            Reactive: Symbol.for("Reactive"),
            /**
             * 来源于静态Json文件
             */
            Json: Symbol.for("Json"),
        },
    },
    // 专用的添加/编辑模式设置，主要用于区分添加和更新
    Mode: {
        CREATE: "CREATE",
        UPDATE: "UPDATE"
    },
};