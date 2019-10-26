import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {ExTab} from "ei";

import Todo from './UI.Todo';
import Done from './UI.Done';

const LOG = {
    name: "PxTodo",
    color: "#36648B"
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiStandard(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            /*
             * 读取数据
             */
            const inherit = Ex.yoAmbient(this);
            const tabs = Ux.fromHoc(this, "tabs");
            /*
             * 是否开启 左树
             */
            const $module = Ux.fromHoc(this, "module");
            if (!$module.pending) $module.pending = {};
            if (!$module.done) $module.done = {};
            /*
             * $options 可直接传下去
             */
            return (
                <ExTab {...inherit} config={tabs}>
                    <Todo {...inherit} {...$module.pending}/>
                    <Done {...inherit} {...$module.done}/>
                </ExTab>
            );
        }, LOG)
    }
}

export default Component