import Ex from 'ex';
import Ux from 'ux';

import {Dsl} from 'entity';
import {Of} from 'app';

const yiData = (reference, key, state = {}) => {
    return Dsl.of(reference).bind(Of.apiTagGet).ok(processed => {
        /*
         * 读取 $dropCategory, $dropAttribute, $dropAction
         * 省略，真实对接的时候初始化对接，这部分还有很多逻辑问题没解决
         */
        return Ux.promise({
            ...state,
            $ready: true,
            $inited: processed,
        });
    }).async({key});
}

const yiPage = (reference) => {
    const state = Ux.toHeightState(256)
    /*
     * 处理 Field
     */
    Ex.yiAssist(reference, state)
        .then(response => {
            const key = Ux.toQuery("key");
            if (key) {
                return yiData(reference, key, response);
            } else {
                const {$inited = {}} = reference.props;
                response.$inited = $inited;
                response.$ready = true;
                reference.setState(response);
            }
        })
}

export default {
    yiPage,
    actions: {
        $opSave: (reference) => (params) => {
            const action = Ux.toQuery("action");
            const api = "EDIT" === action ? Of.apiTagUpdate : Of.apiTagCreate;
            // 对接
            return Dsl.of(reference).bind(api).ok((values) => {
                const ref = Ux.onReference(reference, 1);
                Ux.sexDialog(ref, "EDIT" === action ? "updated" : "created",
                    () => Ux.toRoute(ref, "/persona/tag-system", {key: null}))
            }).ko(() => reference.setState({$submitting: false})).async(params);
        },
        $opBack: (reference) => (event) => {
            Ux.prevent(event);
            Ux.toRoute(reference, "/persona/tag-system", {key: null})
        }
    }
}