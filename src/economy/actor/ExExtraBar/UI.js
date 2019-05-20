import React from 'react';
import Op from './Op';

/*
 * 标准的
 * 1. 保存按钮
 * 2. 重置按钮
 * 3. 删除按钮
 */
class Component extends React.PureComponent {
    componentDidMount() {
        Op.init(this);
    }

    render() {
        return (
            <div>2019-05-20</div>
        );
    };
}

export default Component;