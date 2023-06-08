/**
 * @name zone._Fn
 * @class _Fn
 */
// eslint-disable-next-line no-unused-vars
const _Fn = {
    /** */ onChange: () => ({}),
    /** */ onSelect: () => ({}),
    /** */ rxReduce: () => ({}),
    /** */ rxSource: () => ({}),
    /** */ rxSubmit: () => ({}),
    /** */ rxCancel: () => ({}),
    /** */ rxSelect: () => ({}),
    /** */ rxTree: () => ({}),
    /** */ rxChild: () => ({}),
    /** */ rxCheck: () => ({}),
    /** */ rxClean: () => ({}),
    /** */ rxDropOver: () => ({}),
    /** */ rxBack: () => ({}),
    /** */ rxJumpPage: () => ({}),
    /** */ rxNext: () => ({}),
    /** */ rxNextPage: () => ({}),
    /** */ rxPrev: () => ({}),
    /** */ rxPrevPage: () => ({}),
    /** */ rxFirst: () => ({}),
    /** */ rxLast: () => ({}),
    /** */ rxFirstPage: () => ({}),
    /** */ rxLastPage: () => ({}),
    /** */ rxAdd: () => ({}),
    /** */ rxEdit: () => ({}),
    /** */ rxDelete: () => ({}),
    /** */ rxRefresh: () => ({}),
    /** */ rxItemEdit: () => ({}),
    /** */ rxItemAdd: () => ({}),
    /** */ rxItemDelete: () => ({}),
    /** */ rxRowAdd: () => ({}),
    /** */ rxRowDel: () => ({}),
    /** */ rxRowFill: () => ({}),
    /** */ rxRowCompress: () => ({}),
    /** */ rxRowWrap: () => ({}),
    /** */ rxRowConfig: () => ({}),
    /** */ rxCellAdd: () => ({}),
    /** */ rxCellMerge: () => ({}),
    /** */ rxCellDel: () => ({}),
    /** */ rxCellSplit: () => ({}),
    /** */ rxCellFill: () => ({}),
    /** */ rxCellWrap: () => ({}),
    /** */ rxCellConfig: () => ({}),
    /** */ rxCellRefresh: () => ({}),
    /** */ rxReset: () => ({}),
    /** */ rxRows: () => ({}),
    /** */ rxRow: () => ({}),
    /** */ rxAssist: () => ({}),
    /** */ rxClose: () => ({}),
    /** */ rxOpen: () => ({}),
    /** */ rxView: () => ({}),
    /** */ rxBefore: () => ({}),
    /** */ rxAfter: () => ({}),
    /** */ rxSubmitting: () => ({}),
    /** */ rxPostDelete: () => ({}),
    /** */ rxPostSelected: () => ({}),
    /** */ rxPostOpen: () => ({}),
    /** */ rxPostClose: () => ({}),
    /** */ rxViewQ: () => ({}),
    /** */ rxViewV: () => ({}),
    /** */ rxViewH: () => ({}),
    /** */ rxMyViewQ: () => ({}),
    /** */ rxMyViewV: () => ({}),
    /** */ rxMyViewH: () => ({}),
    /** */ fnOut: () => ({}),
    /** */ fnPage: () => ({}),
    /** */ fnHome: () => ({}),
}
// eslint-disable-next-line import/no-anonymous-default-export
export default [
    // 之前和之后
    "rxBefore",
    "rxAfter",
    "rxSubmitting",

    /* 生命周期函数 */
    "rxPostDelete",
    "rxPostSelected",
    "rxPostOpen",
    "rxPostClose",

    /* 视图类函数 */
    "rxViewQ",
    "rxViewV",
    "rxViewH",
    "rxMyViewQ",
    "rxMyViewV",
    "rxMyViewH",

    "fnOut",
    "fnPage",
    "fnHome",
    /* 单元格系列 */
    "rxCellAdd",    // 添加单元格
    "rxCellMerge",  // 合并单元格
    "rxCellDel",    // 删除单元格
    "rxCellSplit",  // 拆分单元格
    "rxCellFill",   // 填充单元格
    "rxCellWrap",   // 交换单元格
    "rxCellConfig", // 单元格配置
    "rxCellRefresh",// 单元格刷新，写入到顶层的 raft

    "rxReset",      // 重设专用函数
    "rxRows",       // 窗口专用
    "rxRow",        // 窗口专用

    /* 辅助数据 */
    "rxAssist",     // 辅助数据双处理

    "rxClose",      // 关闭
    "rxOpen",
    "rxView",
    "onChange",      // 变更
    "onSelect",      // 选择

    /* Rx 系列 */
    "rxReduce",      // 组件文件重名检查函数
    "rxSource",      // 读取数据源
    "rxSubmit",      // 提交
    "rxCancel",      // 取消
    "rxSelect",      // 选择
    "rxTree",        // 树操作
    "rxChild",       // 绑定子组件专用方法
    "rxCheck",       // 选中专用
    "rxClean",       // 清除专用

    /* Drop 和 Drag */
    "rxDropOver",    // 拖拽时放在上方

    /* rx特殊模式 */
    /* 页码处理专用 */
    "rxBack",        // 返回
    "rxJumpPage",    // 跳页
    "rxNext",        // 下一步
    "rxNextPage",    // 下一页
    "rxPrev",        // 上一步
    "rxPrevPage",    // 上一页
    "rxFirst",       // 第一步
    "rxLast",        // 最后一步
    "rxFirstPage",   // 第一页
    "rxLastPage",    // 最后一页

    /* 增删改 */
    "rxAdd",         // 添加
    "rxEdit",        // 编辑
    "rxDelete",      // 删除
    "rxRefresh",     // 刷新
    "rxItemEdit",    // 子项编辑
    "rxItemAdd",     // 子项添加
    "rxItemDelete",  // 子项删除


    /* Designer 系列 */
    "rxRowAdd",     // 添加行
    "rxRowDel",     // 删除行
    "rxRowFill",    // 行扩展
    "rxRowCompress",// 行压缩
    "rxRowWrap",    // 交换行
    "rxRowConfig",  // 行配置，写入顶层的 raft
    // rxSubmit替换
    "rxFilter",
]