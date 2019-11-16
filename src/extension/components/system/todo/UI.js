import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {ExTab} from "ei";
import Op from './Op';

import Pending from './UI.Pending';
import Done from './UI.Done';

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiTodo(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            /*
             * 读取数据
             */
            const inherit = Ex.yoAmbient(this);
            let tabs = Ux.fromHoc(this, "tabs");
            {
                if (tabs) {
                    tabs = Ux.clone(tabs);
                    const {$activeKey = "tabPending"} = this.state;
                    tabs.activeKey = $activeKey;
                }
            }
            /*
             * 是否开启 左树
             */
            const $module = Ux.fromHoc(this, "module");
            if ($module) {
                if (!$module.pending) $module.pending = {};
                if (!$module.done) $module.done = {};
                if ($module.selection) {
                    /*
                     * 包含了选择的专用配置
                     */
                    $module.pending.$selection = Ux.clone($module.selection);
                    $module.done.$selection = Ux.clone($module.selection);
                }
                return (
                    <ExTab {...inherit} config={tabs} rxTabClick={Op.rxTabClick(this)}>
                        <Pending {...inherit} {...$module.pending}/>
                        <Done {...inherit} {...$module.done}/>
                    </ExTab>
                );
            } else {
                console.error("读取Todo的动态模型失败！");
                return false;
            }
        }, Ex.parserOfColor("PxTodo").page())
    }
}

export default Component