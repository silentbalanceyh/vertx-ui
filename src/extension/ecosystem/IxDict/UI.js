import React from 'react';

/**
 * ## 「组件」`IxDict`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * @memberOf module:uca/extension
 * @method *IxDict
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "IxDict";
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component