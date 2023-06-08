import __Zn from './zero.module.dependency';
import Ux from "ux";
/*
 * $qrView 代表视图变量，该视图变量会聚焦到视图管理过程中
 * 1）当访问远程接口返回了 __qr 时，视图变量会被初始化
 * 2）视图变量初始化时，同时会初始化 $condition / $keyword 执行绑定和锁定
 * 3）修改查询条件的输入为 $qrView
 *    视图管理中个人视图的输入为 response.criteria
 * 4）视图变量会在一定程度上限制
 *    - 搜索框限制：只要有一个条件绑定到视图中，那么搜索框就会被锁定
 *    - 列过滤限制：对应列条件绑定到视图中，那么列过滤会被锁定
 *    - 高级搜索限制：高级搜索表单中存在的属性会被锁定
 * 旧版本使用了 $qrData，引起了很多不必要的问题，所以此处执行重新计算，整体计算流程如下：
 *
 * __qr --> $qr --> $condition / $qrView / $keyword
 */
const __qrView = (state, response = {}, reference) => {
    // 初始化 $qr 处理
    if (response.__qr) {
        const $qrIn = Ux.irSwitcher(reference)
            // "" -> connector
            .client(response.__qr, false);

        // $qrView
        // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQME
        state.$qrView = Ux.clone($qrIn);


        // $condition 处理
        const {
            $condition = {},
            $terms = {},
            $qr = {},
        } = reference.state;
        /*
         * 此处 $qrIn 和 $qr 有区别，$qrIn 是从 response 中读取的 __qr 中转换过来
         * 而 $qr 每次刷新会变化，$qrIn 则是固定值，只会受到视图变更的影响
         * 如果此处不合并会导致列表中 $qr 没有变化，则所有的值都会有问题
         */
        let vQr = Ux.clone($qrIn);
        Object.assign(vQr, $qr);
        vQr = Ux.valueValid(vQr);
        state.$qr = vQr;
        {

            const condition = {};
            const metadata = Ux.irSwitcher(reference).metadata($qrIn, $terms);
            Object.keys(metadata).forEach(field => {
                const value = metadata[field].value;
                if (value) {
                    if (Ux.isArray(value)) {
                        condition[field] = value;
                    } else {
                        condition[field] = [value];
                    }
                }
            })
            state.$condition = Object.assign($condition, condition);
            /* 锁定专用 */
            // #QR_LOCK
            state.$qrVLock = Object.keys(metadata);
        }
    } else {
        /* 锁定专用 */
        // #QR_LOCK
        state.$qrVLock = [];
    }
}
/**
 * ## 「标准」`Ex.kinDoSearch`
 *
 * @method kinDoSearch
 * @memberOf module:kin/unfold
 * @param reference
 * @param state
 * @return {*}
 */
export default (reference, state = {}) => {
    const {$loading = false, $query = {}} = reference.state;
    if ($loading) {
        /*
         * 从上层抽取 rxSearch
         * 1）如果属性中已经传入了 rxSearch，则直接执行外层 rxSearch
         * 2）如果属性中没有传入 rxSearch，则构造List所需的 rxSearch
         */
        const rxSearch = __Zn.rxSearch(reference);
        return rxSearch($query).then(response => {
            /*
             * 原 ExTable 中的 onData 方法
             * 内部如果出现了 rxHoriz 方法，则针对每一行调用 rxHoriz 方法
             */
            const data = Ux.valueArray(response);
            const {rxHoriz} = reference.props;
            if (Ux.isFunction(rxHoriz)) {
                const processed = [];
                data.forEach(each => {
                    const eachRow = rxHoriz(each, reference);
                    processed.push(!!eachRow ? eachRow : each);
                });
                response.list = processed;
            } else {
                response.list = data;
            }
            state.$loading = false;     // 加载完成
            state.$spinning = false;    // 双通道处理
            /*
             * __qr --> $condition
             *      --> $qrData
             *      --> $qr
             */
            __qrView(state, response, reference);
            Ux.dglApi(reference, response);
            return __Zn.yiColumn(reference, state, response);
        });
    } else {
        return Ux.promise(state);
    }
}