import actions from './Op.Event';
import Ex from "ex";
import Ux from 'ux';

import Dev from './Op.Io';
import PSet from './Op.PermSet';

import Rdr from '../Web.Render';

const yiPage = (reference) => Ex.yiStandard(reference).then(state => {
    /*
     * 读取权限组完整树，PERM_SET 信息
     * 读取所有的权限信息
     */
    const types = Ux.onDatum({state}, "zero.authority");
    return Ex.authGroups(state, types).then(processed => {
        /*
         * 窗口专用绑定相关信息
         */
        const maxHeight = Ux.toHeight(ADJUST);
        processed.$heightStyle = {style: {maxHeight}};
        {
            // 窗口绑定
            Ex.uiDialog(reference)
                .child(Rdr.renderChild(reference))
                .onMount(processed)
        }
        return Ux.promise(processed);
    }).then(processed => {
        const {$treeData} = processed;
        if ($treeData) {
            // 按 type key 分组后的结果
            processed.$treeGroup = Ux.elementGroup($treeData, 'type')
        }
        return Ux.promise(processed);
    }).then(processed => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        return Ux.ajaxPost("/api/permission/search", {
            criteria: {
                sigma,
            }
        }).then(permissions => {
            processed.$permissions = Ux.isArray(permissions.list) ? permissions.list : [];
            return Ux.promise(processed);
        })
    }).then(processed => {
        /*
         * Tab页专用配置
         */
        const tabs = {items: [], tabPosition: "left", type: "card", className: "web-authority-page"};
        types.forEach((item, index) => {
            const tabItem = {};
            tabItem.key = item.key;
            tabItem.tab = item.name;
            tabItem.render = Rdr.renderPage(reference);

            tabs.items.push(tabItem);
            if (0 === index) {
                tabs.defaultActiveKey = item.key;
            }
        })
        processed.$tabs = tabs;
        return Ux.promise(processed);
    }).then(processed => {
        const $op = {};
        Object.keys(actions).forEach(key => {
            const executor = actions[key];
            if (Ux.isFunction(executor)) {
                $op[key] = executor(reference);
            }
        })
        processed.$op = $op;
        return Ux.promise(processed);
    }).then(Ux.ready).then(Ux.pipe(reference));
});

const ADJUST = 186;

export default {
    ADJUST,
    yiPage,
    actions,
    ...Dev,
    ...PSet,
}