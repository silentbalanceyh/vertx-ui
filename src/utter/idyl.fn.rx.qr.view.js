import __CM from './idyl.__.fn._.common'
import __V from './pedestal.v.constant.option';
import Ux from 'ux';

const __viewUri = (uri, {
    view = {}, options = {}
}, reference) => {
    let viewName = view.name;
    let position = options[__V.Opt.AJAX_POSITION];
    if (position) {
        /*
         * 加密后处理
         */
        const positionValue = Ux.parsePosition(position, reference);
        return Ux.toUrl(uri, "view", encodeURIComponent(`[${viewName},${positionValue}]`));
    } else {
        if ("DEFAULT" !== viewName) {
            // view = [view];
            return Ux.toUrl(uri, "view", encodeURIComponent(`[${viewName},DEFAULT]`))
        } else {
            // view = DEFAULT
            return uri;
        }
    }
}
const rxColumn = (reference, config = {}) => __CM.switcher(reference, 'rxColumn',
    (params) => {
        const {options = {}, columns = []} = config;
        if (options[__V.Opt.DYNAMIC_COLUMN]) {
            /*
             * 动态配置
             */
            const uri = options[__V.Opt.AJAX_COLUMN_FULL];
            // MODULE
            if (options[__V.Opt.AJAX_MODULE]) {
                params.module = options[__V.Opt.IDENTIFIER];
            }
            return Ux.ajaxGet(uri, params);
        } else {
            /*
             * 静态配置
             */
            return Ux.promise(columns);
        }
    });

const rxColumnMy = (reference, config = {}) => __CM.switcher(reference, 'rxColumnMy',
    (params) => {
        const {options = {}} = config;
        if (options[__V.Opt.AJAX_COLUMN_MY]) {
            /*
             * 动态配置
             */
            let uri = options[__V.Opt.AJAX_COLUMN_MY];
            // module 参数
            if (options[__V.Opt.AJAX_MODULE]) {
                params.module = options[__V.Opt.IDENTIFIER];
            }
            // view 参数
            // 「Vis」视图修改
            const {$myView} = reference.state;
            uri = __viewUri(uri, {
                view: $myView,
                options
            }, reference);
            return Ux.ajaxGet(uri, params);
        }
    });

const rxSearch = (reference) => __CM.switcher(reference, 'rxSearch',
    (params) => {
        /*
         * 必须配置 ajax.search.uri
         */
        const {options = {}, $myView} = reference.state;
        let uri = options[__V.Opt.AJAX_SEARCH_URI];
        const module = options[__V.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options.identifier)
        }
        // view 参数
        // 「Vis」视图修改
        uri = __viewUri(uri, {
            view: $myView,
            options
        }, reference);
        return Ux.ajaxPost(uri, params);
    });

const rxMyViewV = (reference) => __CM.switcher(reference, 'rxMyViewV',
    (projection = []) => {
        const {options = {}, $myView, $qr = {}} = reference.state;
        /* 当前组件中的状态定义 */
        let uri = options[__V.Opt.AJAX_COLUMN_SAVE];
        // view 参数
        // 「Vis」视图修改
        uri = __viewUri(uri, {
            view: $myView,
            options
        }, reference);
        const criteria = Ux.irSwitcher(reference)
            // connector -> ""
            .server($qr, false);
        //
        // let criteria = Ux.clone($qr);
        // if ($qr.?onnector) {
        //     criteria[""] = "AND" === $qr.?onnector;
        //     delete criteria.?onnector;
        // }
        // if (1 === Object.keys(criteria).length) {
        //     criteria = {};
        // }
        return Ux.ajaxPut(uri, {
            // 此处只更新projection，新版多加一层 viewData
            // 防止和查询引擎参数格式冲突，后端自动检测会失败
            viewData: {
                projection,
                criteria
            }
        }).then(data => Ux.promise(data['projection']));
    }
);
const rxMyViewQ = (reference) => __CM.switcher(reference, 'rxMyViewV',
    (criteria = {}) => {
        const {options = {}, $myView} = reference.state;
        /* 当前组件中的状态定义 */
        let uri = options[__V.Opt.AJAX_COLUMN_SAVE];
        // view 参数
        // 「Vis」视图修改
        uri = __viewUri(uri, {
            view: $myView,
            options
        }, reference);
        return Ux.ajaxPut(uri, {
            // 此处只更新criteria，新版多加一层 viewData
            // 防止和查询引擎参数格式冲突，后端自动检测会失败
            viewData: {
                criteria
            }
        }).then(data => Ux.promise(data.criteria));
        /*
         .then(data => {
            // Fix: $m?Qr
            console.log(data.criteria);
            const $m?Qr = data.criteria;
            return Ux.of(reference).in({$m?Qr})
                .future(() => Ux.promise($m?Qr))
            // reference.?etState({$m?Qr});
            // return Ux.promise($m?Qr);
        });
         */
    }
);
export default {
    rxSearch,
    rxColumn,
    rxColumnMy,
    /*
     * H, Q, V
     * H: 水平 -> rows
     * Q：查询条件 -> criteria
     * V：垂直 -> projection
     * 所以视图函数
     * rxMyViewH ->
     * rxMyViewQ ->
     * rxMyViewV ->
     * rxMyView
     */
    rxMyViewV,
    rxMyViewQ,
}