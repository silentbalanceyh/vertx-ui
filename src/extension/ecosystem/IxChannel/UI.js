import React from 'react';

/**
 * ## 「组件」`IxChannel`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * @memberOf module:web-component
 * @method *IxChannel
 */
// =====================================================
// componentInit/componentUp
// =====================================================
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                （高级配置，本版本暂不支持深度扩展）
            </div>
        )
    }
}

export default Component