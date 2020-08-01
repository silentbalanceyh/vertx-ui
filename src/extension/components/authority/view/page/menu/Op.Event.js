import Ux from "ux";
import Sd from '../_shared';
import Ex from "ex";

export default {
    $opSave: (reference) => (event) => {
        Ux.prevent(event);
        /**
         * 统一调用 doSelected 函数
         */
        Sd.doRequest(reference, (selected) => {
            const {$keyDefault = []} = reference.state;
            /*
             * 计算 selected
             *
             * - 如果本节点被选中，则它的父节点必须被选中
             */
            $keyDefault.forEach(item => {
                if (Ux.Env.MENU_TYPE.NAV === item.type) {
                    selected.delete(item.key);
                } else {
                    selected.add(item.key);
                }
            });
            {
                const {config = {}} = reference.props;
                const {datum = []} = config;
                Array.from(selected).forEach(each => {
                    const keys = Ux.elementBranch(datum, each, "parentId");
                    if (1 < keys.length) {
                        // 添加父ID
                        keys.forEach(item => selected.add(item.key));
                    }
                })
            }
            return Ex.authRequest(reference, Array.from(selected));
        });
    }
}