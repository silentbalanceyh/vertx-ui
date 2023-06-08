import React from 'react';
import Rdr from './Web.jsx';
import Ux from 'ux';
import __Zn from '../zero.aero.dependency';

const UCA_NAME = "ExButton"
/**
 * ## 「组件」`ExButton`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 核心
 *
 * 该按钮有两种形态
 *
 * 1. 按钮形态：`<Button/>`。
 * 2. 链接形态：`<Link/>`。
 *
 * @memberOf module:uca/extension
 * @method *ExButton
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const yoButton = (reference) => {
    const {config = {}, $category = "BUTTON"} = reference.props;
    /*
     * 拆开
     */
    const $config = Ux.clone(config);
    if (!$config.type) {
        $config.type = "default";
    }
    if (!$config.plugin) {
        $config.plugin = {};
    }
    const {component} = $config;
    $config.onClick = __Zn.configClick($config, reference);
    if (component) {
        $config.userDefined = true;
    } else {
        $config.component = $category;
    }
    return $config;
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: true
    };

    render() {
        return __Zn.yoRender(this, () => {
            /*
             * 处理核心配置
             *
             **/
            const config = yoButton(this);
            /*
             * onClick 专用检查
             */
            if (config.userDefined) {
                return Rdr.renderDefined(this, config);
            } else {
                if ("LINK" === config.component) {
                    return Rdr.renderLink(this, config);
                } else {
                    return Rdr.renderButton(this, config);
                }
            }
        }, __Zn.parserOfColor(UCA_NAME).action({off: true}));
    }
}

export default Component;