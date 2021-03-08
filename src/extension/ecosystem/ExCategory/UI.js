import React from 'react';
import Op from './Op';
import Ex from 'ex';
import {Menu} from 'antd';
import './Cab.less';
import Ux from "ux";

/**
 * ## 「组件」`ExCategory`
 *
 * ```js
 * import { ExCategory } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-----------------|
 * |  Menu           |
 * |    |-- Menu     |
 * |    |-- Menu     |
 * |  Menu           |
 * |    |-- Menu     |
 * |  Menu           |
 * |    |-- Menu     |
 * |    |-- Menu     |
 * |                 |
 * |-----------------|
 * ```
 *
 * @memberOf module:web-component
 * @method ExCategory
 *
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    /*
     * 读取根路径上的 tabular
     */
    Ex.I.tabular({type: Ex.V.TYPE_CATEGORY})
        .then(response => {
            /*
             * 设置当前组件的基本状态
             */
            const state = {};
            if (Ux.isArray(response)) {
                state.$data = response
                    /* 基础排序 */
                    .sort((left, right) => left.sort - right.sort);
            }
            state.$ready = true;
            reference.setState(state);
        })
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 菜单专用
             */
            const menuData = Op.yoMenu(this);

            return (
                <Menu onSelect={Op.rxSelect(this)} className={'ex-category'}>
                    {menuData.map(menu => {
                        const {text, ...rest} = menu;
                        return (
                            <Menu.Item {...rest}>{text}</Menu.Item>
                        )
                    })}
                </Menu>
            );
        }, Ex.parserOfColor("ExButton").component())
    }
}

export default Component;