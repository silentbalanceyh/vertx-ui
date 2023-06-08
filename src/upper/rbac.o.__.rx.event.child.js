import Ux from "ux";
import Fn from './rbac.__.fn.acl.io';

export default {
    rxCheckFn: (reference, configuration = {}) => {
        return (keys = []) => {
            // 子节点点击（Visit）
            const {$keyDefault, $keySet} = reference.state;
            /*
             * 由于区分了区域的，所以此处
             * $keyDefault / $keySet 和 source 一起执行重算
             * 某个区域下
             * -- $keyPDefault
             * -- $keyPSet
             */
            const {
                option = {},
                source = [],
            } = configuration;
            const keyAll = source.map(item => item.key);
            let $keyUpdate = [];
            Array.from($keyDefault).forEach(key => {
                // The key must exist in `source`.
                if (!keyAll.includes(key) && $keySet.has(key)) {
                    // Keep other keys ( based on $keySet )
                    $keyUpdate.push(key);
                }
            });
            // 带 option
            $keyUpdate = $keyUpdate.concat(keys);
            const $keySelected = new Set($keyUpdate);
            const paramOut = Fn.aclOut(reference, $keySelected, option);

            Ux.of(reference).in({
                $keySet: $keySelected
            }).handle(() => {
                const {resource = {}} = paramOut;
                /*
                 * owner,   ownerType,  resource = {}
                 *
                 * Each resource: {
                 *     position: "run"
                 *     rows: {},
                 *     visitant: {
                 *     }
                 * }
                 * remove:      当前区域
                 * removeAll:   全清
                 */
                Ux.fn(reference).rxChild(resource, Ux.isDiff($keySelected, $keyDefault));
            })
        }
    },
    rxSendFn: (reference) => (event) => {
        Ux.prevent(event);                                  // Button Action
        Ux.fn(reference).rxSubmit();                        // Submitting
        const {$keyChild} = reference.state;
        const request = Fn.aclOut(reference, $keyChild);
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
        }).then($bindData => {
            const state = {};
            state.$refreshC = Ux.randomString(16);                    // Refresh Child Page
            state.$keyChild = undefined;
            state.$bindData = $bindData;
            Ux.of(reference).in(state).handle(() => {

                Ux.fn(reference).rxSubmit(false);                        // Submitting
            })
            // reference.?etState(state);
            // Ux.fn(reference).rxSubmit(false);                        // Submitting
        });
    },
}