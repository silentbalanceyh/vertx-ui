import Fn from './idyl.zero.dependency';
import yoDynamic from './channel.@fn.yo.dynamic';
import __ACTION from './channel.event.fn.yo.action';
import Ux from 'ux';
import __V from './pedestal.v.constant.option';

const {
    yoAction,
    yoExtension
} = __ACTION

const __yoBatchEditor = (batch, reference) => {
    const {config = []} = batch;
    const buttonRef = config.filter(item => "op.batch.edit" === item.category)[0];
    if (buttonRef) {
        /*
         * 抽取列信息
         */
        const {$columns = [], $columnsMy = []} = reference.state;

        /*
         * 抽取配置信息，直接从引用入手，需要修改引用
         */
        const {component = {}} = buttonRef;
        const editorRef = component.config;

        /*
         * 计算最新的配置
         * ExBatchEditor 中的配置必须存在于 columns 中
         * 1）检查是否全部存在于 columns
         * 2）如果不存在于 columns 中，则想办法移除
         * 直接加入 rxViewQ 方法，让内置可以直接过滤
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    }
    return batch;
}
const yoListSearch = (reference) => {
    const attrs = yoDynamic(reference);
    /*
     * 提取选项
     */
    const {
        options = {},
        $columns = [],
        $qrVLock = []
    } = reference.state;
    const config = {};
    attrs.$options = options;
    Object.keys(options)
        .filter(optKey => optKey.startsWith('search'))
        .forEach(optKey => config[optKey] = options[optKey]);
    config.field = $columns;        // 连接配置
    attrs.config = config;
    /*
     * 表单组件下放
     */
    const {$form = {}} = reference.props;
    attrs.$form = $form;
    attrs.rxSubmitting = Ux.rxSubmitting(reference);

    const {
        $condition = {},
        $terms, $qr,
        /*
         * $queryDefault -> 外层传入的默认查询条件
         * $queryView    -> 带上视图之后的查询条件（每次查询的起点）
         * $query        -> 运行专用
         */
        $queryView = {}
    } = reference.state;
    attrs.$condition = $condition;
    attrs.$terms = $terms;

    attrs.$qr = $qr;
    attrs.$query = $queryView;
    // #QR_LOCK
    attrs.$qrVLock = $qrVLock;      // 锁定配置

    attrs.rxViewQ = Fn.irViewQ(reference);
    attrs.rxMyViewQ = Fn.rxMyViewQ(reference);
    /* 特殊提交，直接走 Ux */
    attrs.rxFilter = Ux.irSubmit(reference);

    return attrs;
}

const yoListOpen = (reference) => {
    const attrs = yoAction(reference, "op.open", __V.Order);
    /*
     * 清空按钮专用，设置
     * disabled / enabled状态
     */
    attrs.config = attrs.config.filter(item => "op.open.filter" !== item.category)
    // let isFiltered = attrs.config.filter(item => "op.open.filter" === item.category);
    // if (0 < isFiltered.length) {
    //     const ref = isFiltered[0];
    //     if (ref) {
    //         const {$condition = {}} = reference.state;
    //         if (0 === Object.keys($condition).length) {
    //             /*
    //              * $condition 无值
    //              * 初始态
    //              */
    //             ref.disabled = true;
    //         } else {
    //             /*
    //              * $condition 中每一个键的搜索长度都为 0
    //              * 中间态
    //              */
    //             const counter = Object.keys($condition).map(key => $condition[key])
    //                 .filter(value => 0 < value.length);
    //             /*
    //              * 状态需要切换
    //              */
    //             ref.disabled = 0 === counter.length;
    //         }
    //     }
    // }
    attrs.config = yoExtension(reference, "op.open", attrs.config);
    return attrs;
}

const yoListBatch = (reference) => {
    let batch = yoAction(reference, 'op.batch', __V.Order);
    /*
     * batch是数组，则处理 disabled 状态
     */
    const {$selected = [], $submitting = false} = reference.state;
    batch.$category = "LINK";
    /*
     * ExBatchEditor 列专用处理
     */
    batch = __yoBatchEditor(batch, reference);
    /*
     * ExBatchEditor 中需要的外层函数
     */
    batch.rxBatchEdit = Fn.rxBatchEdit(reference);

    batch.rxSubmitting = Ux.rxSubmitting(reference);
    batch.rxClose = Fn.rxClose(reference);
    /*
     * 选中项
     */
    batch.$selected = Ux.clone($selected);
    batch.$submitting = $submitting;
    /*
     * 挂载 extension 部分
     */
    // const extension = yoExtension(reference, "op.batch", batch.config);
    // batch.config = [].concat(batch.config).concat(extension);
    batch.config = yoExtension(reference, "op.batch", batch.config);
    /*
     * Disabled-001：初始化
     */
    if (batch.config) {
        batch.config.map(each => each.disabled = 0 === $selected.length);
    }
    return Ux.sorterObject(batch);
}

const yoListExtra = (reference) => {
    const editorRef = yoAction(reference, "op.extra", __V.Order);
    /*
     * $columns：全列
     * $columnsMy：我选择的列
     */
    const {
        $columns = [], $columnsMy = [],
    } = reference.state;
    /*
     * 核心配置信息传入
     */
    editorRef.config.forEach((config = {}) => {
        /*
         * 抽取组件配置信息
         */
        const {component = {}} = config;
        const editorRef = component.config;
        /*
         * 每个组件都需要（特殊处理）
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    });
    editorRef.config = Ux.pluginKoBatch(reference, editorRef.config);
    if (editorRef.$myView) {
        /*
         * position 处理
         */
        const viewRef = editorRef.$myView;
        if (!viewRef.position) {
            const {$options = {}} = editorRef;
            const position = $options[__V.Opt.AJAX_POSITION];
            if (position) {
                const pValue = Ux.parsePosition(position, reference);
                if (pValue) {
                    viewRef.position = pValue;
                }
            }
            if (!viewRef.position) {
                viewRef.position = "DEFAULT"
            }
        }
    }
    /*
     * rxMyViewV
     * rxExport
     * 直接的 Ajax方法处理
     */
    editorRef.rxExport = Fn.rxExport(reference);
    editorRef.rxImport = Fn.rxImport(reference);

    // Popover专用
    editorRef.rxPop = (spinning = true) => {
        if (spinning) {
            Ux.of(reference).spinning().done();
        } else {
            Ux.of(reference).spun().done();
        }
    }

    editorRef.rxSubmitting = Ux.rxSubmitting(reference);
    editorRef.rxClose = Fn.rxClose(reference);
    /*
     * 不带 Ajax 的专用回调函数，用于 rxMyViewV 的回调
     * 主要是参数需要计算，所以这里只能使用双阶段来处理列保存
     * 1）调用 rxMyViewV 方法
     * 2）执行 rxViewV 的回调（目前支持Table，后期可以考虑支持其他）
     */
    editorRef.rxViewV = Fn.irViewV(reference);
    editorRef.rxMyViewQ = Fn.rxMyViewQ(reference);
    editorRef.rxMyViewV = Fn.rxMyViewV(reference);


    const {
        $qr,
        $queryView = {}
    } = reference.state;

    editorRef.$qr = $qr;
    editorRef.$query = $queryView;
    /*
     * 计算最新配置
     * ExEditorColumn
     */
    return Ux.sorterObject(editorRef);
}

const yoListGrid = (reference, config = {}) => {
    const {options = {}} = reference.state;
    const gridName = options[__V.Opt.SEARCH_GRID];
    if (gridName) {
        return Ux.Env.GRID[gridName];
    } else {
        const {extra = {}} = config;
        if (0 === extra.config.length) {
            return Ux.Env.GRID.LIST_NE;
        } else {
            return Ux.Env.GRID.LIST_E;
        }
    }
}
export default {
    yoListBatch,
    yoListOpen,
    yoListGrid,
    yoListSearch,
    yoListExtra
}