export default {
    add: {
        icon: "plus",
        type: "primary",
        key: "btnAdd"
    },
    batchEdit: {
        icon: "edit",
        type: "default",
        key: "lnkBatchEdit",
        window: "window.batch.edit" // Window 专用
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
        popover: "window.extra.column"  // Popover 专用
    },
    extraExport: {
        icon: "export",
        key: "btnExport",
        window: "window.extra.export" // Popover 专用
    },
    extraImport: {
        icon: "import",
        key: "btnImport",
        window: "window.extra.import" // Popover 专用
    }
};