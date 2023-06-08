import Ux from 'ux';
import __IO from './rbac.__.fn.acl.io';
import __ACTION from './rbac.o.rx.event';

const aclRoute = (reference, params = {}) => {
    /* 跳转到管理界面 */
    const {
        key,
        view,
        data,
    } = params;
    const normalized = {};
    if (key && view) {
        /* 全部改成内置参数 */
        normalized._key = key;
        normalized._view = view;
        normalized._data = data;
        const {$router} = reference.props;
        normalized.target = $router.path();   // 追加 target 参数
        Ux.toRoute(reference, "/rbac/authority", normalized);
    } else {
        console.error("调用错误，必须传入 key 和 view 参数！");
    }
}

const aclRegionInit = async (reference, actionFn = {}, initState = {}) => {
    const {
        $region = {},
        config = {},
        $bindData,
        $owner = {}
    } = reference.props;
    const combine = {};
    if ($bindData) {
        /*
         * If $regionV exist, the $bindData should be undefined, because in this situation the value should be
         * used in children components instead and it's not needed to read remote data ( Once Reading ).
         * The $inited format should be:
         * {
         *     "h": {},
         *     "q": {},
         *     "v": {},
         *     "virtual": null      // In children the virtual should be null instead of true
         * }
         */
        combine.$bindData = $bindData;
    } else {
        combine.$bindData = await Ux.ajaxPost("/api/authority/region-v/:key", {
            key: $owner.key,
            $body: $region.datum,
        });
    }
    const {
        webBind = {},
        webComponent,
    } = config;
    const dataKey = webBind[webComponent];
    const inputData = {
        props: reference.props,
        state: {
            ...reference.state ? reference.state : {},
            ...initState
        }
    }
    if (dataKey) {
        combine.$inited = combine.$bindData[dataKey];
        const $keySet = __IO.aclIn(inputData, combine.$inited, actionFn);
        const {
            keyFn2
        } = actionFn;
        if (Ux.isFunction(keyFn2)) {
            // 2nd Function
            const inputParam = Ux.clone(inputData);
            Object.assign(inputParam.state, combine);
            combine.$keySet = keyFn2(inputParam)($keySet);
        } else {
            combine.$keySet = $keySet;
        }
        combine.$keyDefault = $keySet;
    }
    return combine;
}

const aclRegion = (reference, region = {}) => {
    const inherit = {};
    const {$inited = {}} = reference.props;
    inherit.$owner = $inited.data ? $inited.data : {};
    inherit.$region = region;

    const $initial = {};
    $initial.ownerType = $inited.type;
    $initial.owner = $inited.key;
    inherit.$initial = $initial;

    const {
        config = {}, group,
        datum, data, children,
    } = region;
    // webBind / webAction
    __IO.aclAction(inherit, config, reference);

    /*
     * data structure
     * {
     *     ...data,
     *     __children: {},
     *     __dm: selected dm value
     * }
     */
    const $data = {};
    if (data) {
        Object.assign($data, data);
    }
    if (children) {
        $data.__children = children;
    }

    inherit.data = $data;
    inherit.config = {
        ...config,      // webBind is required for children updating
        group,
        datum,
    }
    // $loading processing
    const {$loading = false} = reference.state;
    inherit.$loading = $loading;
    inherit.rxFlag = __ACTION.P.rxFlagFn(reference);
    inherit.rxSubmit = __ACTION.P.rxSubmitFn(reference, region);
    return inherit;
}
export default {
    aclRoute,
    aclRegionInit,
    aclRegion,
}