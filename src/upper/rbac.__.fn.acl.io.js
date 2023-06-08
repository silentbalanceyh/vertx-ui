import Ux from "ux";
import HQV from './variant-secure';

const aclIn = (reference, $inited = {}, actionFn) => {
    const {config = {}} = reference.props;
    const {webData = {}} = config;
    const {
        initializer,
    } = webData;
    if (!initializer) {
        console.warn("[ACL] initializer 未配置", initializer)
        return new Set();
    }
    const executor = HQV[initializer];
    if (Ux.isFunction(executor)) {
        const params = {};
        params.webValue = $inited;
        params.webData = webData;
        params.webFn = actionFn;
        /*
         * {
         *     "webValue": "xxx",
         *     "webData": {},
         *     "webFn": {
         *     }
         * }
         * 由于 reference.props 中已经存在 data, config,
         * 为了区分，就使用 webValue, webData
         */
        return executor(reference, params);
    } else {
        console.warn("[ACL] initializer 不存在", initializer)
        return new Set();
    }
}

const aclOut = (reference, $valueOut, option = {}) => {
    const {config = {}, $bindValue} = reference.props;
    const {webData = {}} = config;
    const {
        requester
    } = webData;
    if (!requester) {
        console.warn("[ACL] requester 未配置", requester)
        return new Set();
    }
    const executor = HQV[requester];
    if (Ux.isFunction(executor)) {
        Ux.dgDebug({
            requester,
            out: $valueOut
        }, "执行 requester ", "#1C86EE");
        const params = {};
        const {$inited = {}} = reference.state;
        params.webValue = $inited;
        /*
         * $valueOut 情况处理
         */
        if (Ux.isSet($valueOut)) {
            params.webSelected = Array.from($valueOut);
        } else {
            params.webSelected = $valueOut;
        }
        params.webData = webData;
        params.webOption = option;
        /*
         * {
         *     "webValue": "xxx",
         *     "webData": {}
         * }
         * 由于 reference.props 中已经存在 data, config,
         * 为了区分，就使用 webValue, webData
         */
        const viewData = executor(reference, params);
        const {$initial = {}} = reference.props;
        const request = Ux.clone($initial);
        request.resource = {};
        if ($bindValue) {
            // Single Resource
            request.resource[$bindValue] = viewData;
        } else {
            // Multi Resource
            request.resource = viewData;
        }
        return request;
    } else {
        console.warn("[ACL] requester 不存在", requester)
        return new Set();
    }
}

const aclAction = (inherit = {}, config = {}, reference) => {
    const {
        webBind,
        webAction,
        webComponent, webChildren
    } = config;
    /*
     * Set inherit critical resources to input to HxXX components ( children )
     * 1 - webChildren existing
     *     resource = xxx,
     *     resource = yyy,
     * 2 - webChildren = undefined
     *     resource = xxx
     *
     * The attribute `webBind` only appear in parent component, it means that this workflow is only when
     * parent component usage to set
     * 1) Container:
     *    webBind does not contain `webComponent` attribute key.
     * 2) Component:
     *    webBind contain `webComponent` attribute key.
     */
    // $bindData linking
    let $bindData = reference.props.$bindData;
    if (!$bindData) {
        $bindData = reference.state ? reference.state.$bindData : {};
    }
    inherit.$bindData = $bindData;
    // console.log(webBind);
    if (webBind && !webChildren) {
        // Component
        /*
         * {
         *     $bindValue -> value
         * }
         */
        inherit.$bindValue = webBind[webComponent];
    }


    const $anchors = [];
    if (webAction) {
        // Build connect ids set, the variable name is "$anchors"
        Ux.ambArray(webAction)
            .filter(item => !!item.connectId)
            .forEach(item => $anchors.push(item.connectId));
    }
    if (0 < $anchors.length) inherit.$anchors = $anchors;
}
export default {
    aclIn,
    aclOut,
    aclAction,
}