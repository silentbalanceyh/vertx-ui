import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExForm} from 'ei';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$op = {}} = this.state;
            /*
             * $inited 计算流程
             * 1）添加
             * -- 是否存在 $addKey
             * -- 如果存在 $addKey（就是添加模式）则执行 initial 定义处理
             * 2）编辑
             * -- 不存在 $addKey 则不需要考虑模式，直接处理
             */
            return (
                <ExForm {...this.props} $height={"300px"}
                        $op={$op}/>
            );
        }, Ex.parserOfColor("OxForm").form())
    }
}

export default Component;