import Ux from 'ux';
import __C from './rbac.o.__.rx.event.child';
import __P from './rbac.o.__.rx.event.inherit';

import __ACL from "./rbac.__.fn.acl.execute";
import __IO from './rbac.__.fn.acl.io';

const Fn = {
    ...__ACL,
    ...__IO,
}
/*
 * 结构调整
 * Event: {
 *     P: {
 *         父类继承方法
 *     },
 *     C: {
 *         子类方法
 *     },
 *     Aop: {
 *
 *     }
 * }
 */
export default {
    rxCheckFn: (reference, treeData = []) => {
        // 执行专用
        return Ux.rxCheckedTree(reference, treeData, (selected) => {
            const {$keyDefault} = reference.state;
            // 调用上层的 rxFlag
            Ux.fn(reference).rxFlag(Ux.isDiff(selected, $keyDefault));
        })
    },
    rxSendFn: (reference) => (event) => {
        Ux.prevent(event);                                  // Button Action
        Ux.fn(reference).rxSubmit();                        // Submitting
        const {$keySet} = reference.state;
        const request = Fn.aclOut(reference, $keySet);
        const {$region} = reference.props;
        Ux.ajaxPost(`/api/authority/region/:value`, {
            value: $region.value,
            /*
             * owner:
             * ownerType:
             * resource: {
             *     rest1: ...,
             *     rest2: ...
             * }
             */
            $body: request,
        }).then(() => {

            Ux.of(reference).in({
                $keyDefault: $keySet                        // Update $keyDefault
            }).handle(() => {
                Ux.fn(reference).rxSubmit(false);
            })
        })
    },
    C: __C,
    P: __P,
}