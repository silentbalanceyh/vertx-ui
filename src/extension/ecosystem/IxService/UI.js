import React from 'react';

/**
 * ## 「组件」`IxService`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * @memberOf module:uca/extension
 * @method *IxService
 */
const UCA_NAME = "IxService";
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