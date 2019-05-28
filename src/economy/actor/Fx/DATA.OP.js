export default {
    openAdd: {
        icon: "plus",
        type: "primary",
        key: "btnAdd"
    },
    openFilter: {
        icon: "remove",
        type: "default",
        key: "btnFilter",
        tooltip: true,
    },
    batchEdit: {
        icon: "edit",
        type: "default",
        key: "lnkBatchEdit",
        window: "window.batch.edit", // Window 专用
        component: "UiBatchEditor",  // 组件类型
        componentKey: "batch.editor",// 配置Key
    },
    batchDelete: {
        icon: "remove",
        type: "default",
        key: "lnkBatchDelete",
        confirm: "confirm.batch.delete"
    },
    extraColumn: {
        icon: "caret-down",
        type: "primary",
        key: "btnColumn",
        popover: "window.extra.column",  // Popover 专用
        component: "UiColumnEditor",
        componentKey: "extra.column"
    },
    extraExport: {
        icon: "export",
        key: "btnExport",
        window: "window.extra.export",  // Popover 专用
        component: "UiExportEditor",
        componentKey: "extra.export"
    },
    extraImport: {
        icon: "import",
        key: "btnImport",
        window: "window.extra.import", // Popover 专用
        component: "UiImportEditor",
        componentKey: "extra.import"
    }
};