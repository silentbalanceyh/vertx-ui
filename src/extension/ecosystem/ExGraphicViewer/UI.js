import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './op';
import renderEmpty from './Web.Empty';
import renderJsx from './Web.Graphic';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicViewer")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ux.g6ViewInit(this, Op.onInit)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = {}} = this.state;
            const {nodes = []} = $data;
            return 0 === nodes.length ?
                /* 无数据渲染 */
                renderEmpty(this) :
                /* 带数据渲染 */
                renderJsx(this, $data);
        }, Ex.parserOfColor("ExGraphicViewer").component())
    }
}

/*
 * 直接根据配置项数据构造拓扑图
 */
export default Component;