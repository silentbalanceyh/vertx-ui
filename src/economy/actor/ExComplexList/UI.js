import React from 'react'
import Ex from '../Ex'
import Fn from '../Fx';

@Ex({
    // 1. 验证专用函数
    verify: Fn.verify("grid"),
    // 2. 初始化状态的专用函数（静态配置初始化）
    hoc: Fn.init("grid")
})
class Component extends React.PureComponent {
    componentDidMount() {
        // 动态配置初始化
    }

    render() {
        console.info(this.props, this.state);
        return (
            <div>2019-05-19</div>
        )
    }
}

export default Component