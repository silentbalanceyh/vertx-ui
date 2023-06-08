import __ZN from './zero.uca.func.dependency';
import __ADD_ON from '../equip.fn.plugin.extension';

import {Button} from 'antd';
import React from 'react';

const __Zn = {
    ...__ZN,
    ...__ADD_ON,
}

const Cv = __Zn.Env;

const __jsxAction = (jsx = {}, fnRender) => {
    const {grouped = false} = jsx;
    if (grouped) {
        return (
            <Button.Group>
                {__Zn.isFunction(fnRender) ? fnRender() : false}
            </Button.Group>
        )
    } else {
        return (
            <span>
                {__Zn.isFunction(fnRender) ? fnRender({
                    style: {
                        marginRight: 8
                    }
                }) : false}
            </span>
        )
    }
};
const aiAction = (reference, jsx = {}) => __jsxAction(jsx, (config = {}) => {
    const {actions = [], loading = false} = jsx;
    /*
     * 表单启用过滤操作，和外层窗口中的操作保持一致
     * 1）添加类：ADD
     * -- 这种类型的表单调用 pluginKoAdd 函数执行过滤，内层调用 koAdd
     * 2）编辑类：EDIT
     * -- 这种类型的表单调用 pluginKoEdit 函数执行过滤，内层调用 koEdit
     * 此处两个Zero Framework中使用的特殊变量：
     * 1. $mode：用于标识表单模式
     * 2. $inited：表单初始化数据，等价于行操作的 record 变量
     */
    const {$mode, $inited = {}} = reference.props;
    let $actions = __Zn.clone(actions);
    if ($mode === Cv.FORM_MODE.ADD) {
        $actions = __Zn.pluginKoAdd(reference, $inited, $actions);
    } else if ($mode === Cv.FORM_MODE.EDIT) {
        $actions = __Zn.pluginKoEdit(reference, $inited, $actions);
    }
    return $actions.map(item => {
        item = __Zn.clone(item);
        const {text, ...rest} = item;
        rest.loading = loading;
        /*
         * 禁用处理
         */
        if (!rest.hasOwnProperty('disabled')) {
            const {disabled = false} = jsx;
            rest.disabled = disabled;
        }
        __Zn.remove(rest, "optionJsx");
        if (rest.icon) {
            rest.icon = __Zn.v4Icon(rest.icon);
        }
        return (
            <Button {...rest} style={config.style}>{text}</Button>
        );
    })
});
export default {
    aiAction,
}