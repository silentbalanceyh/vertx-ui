import Ux from 'ux';
import __IO from './rbac.__.fn.acl.io';
import __ACTION from './rbac.o.rx.event';

const aclChild = (reference, child = {}, $selected = {}) => {
    // 父
    const pData = reference.props.data;
    const pConfig = reference.props.config;
    const {
        key,
        component,
    } = child;
    const {__children = {}} = pData;
    const dataChild = __children[key];
    if (dataChild) {
        const inherit = {};
        const {
            data = {},
            config = {},
            ...container
        } = dataChild;
        inherit.data = data[$selected.value];
        // Wrap by some addOn
        inherit.$container = container;

        const {
            $region = {}, $owner = {}, $initial,
        } = reference.props;
        inherit.$initial = $initial;
        if ($region.children) {
            inherit.$region = $region.children[key];
        }
        inherit.$owner = $owner;
        // webBind / webAction
        const configuration = Ux.clone(config);
        /*
         * Child configuration Rebuilding
         * 1. Parent webBind -> webBind
         * 2. Child component -> webComponent
         */
        configuration.webBind = pConfig.webBind;
        configuration.webComponent = component;
        inherit.config = configuration;

        inherit.$refreshKey = $selected.value;          // Trigger Refresh Process
        __IO.aclAction(inherit, configuration, reference);
        inherit.rxChild = __ACTION.P.rxChildFn(reference);
        const {$keyChild, $refreshC} = reference.state ? reference.state : {};
        if ($keyChild && $keyChild.hasOwnProperty(inherit.$bindValue)) {
            inherit.$prerequest = $keyChild[inherit.$bindValue];
        }
        if ($refreshC) {
            inherit.$forceUpdate = $refreshC;
        }
        return inherit;
    }
    // Else returned undefined
}
const aclChildUp = (reference, virtual = {}, callback) => {
    const executorFn = (initState = {}) => {
        const prevUp = virtual.props.$forceUpdate;
        const nowUp = reference.props.$forceUpdate;
        if (prevUp !== nowUp) {
            const {
                $keySet
            } = reference.state;
            const {
                $bindData
            } = reference.props;
            Object.assign(initState, {$keyDefault: $keySet, $bindData});
        }
        return Ux.promise(initState);
    }
    const prevKey = virtual.props.$refreshKey;
    const nowKey = reference.props.$refreshKey;
    if (prevKey !== nowKey) {
        return callback(reference, virtual).then(executorFn).then(Ux.pipe(reference));
    } else {
        return executorFn({}).then(Ux.pipe(reference));
    }
}
export default {
    aclChild,
    aclChildUp,
}