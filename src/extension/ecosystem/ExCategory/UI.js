import React from 'react';
import Op from './Op';
import Ex from 'ex';
import {Menu} from 'antd';

import Ux from "ux";

const UCA_NAME = "ExCategory";
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
 * @memberOf module:uca/extension
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
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        })
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
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
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;