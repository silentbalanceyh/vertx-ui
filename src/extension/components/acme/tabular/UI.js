import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import renderJsx from './Web';

const LOG = {
    name: "PxTabular",
    color: "#1874CD"
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const siderAttrs = Op.yoSider(this);
            /*
             * 是否已经选择
             */
            const {$selected = false} = this.state;
            /*
             * 基本信息说明
             */
            const alert = Ux.fromHoc(this, "alert");
            /* 专用组件信息 */
            const listAttrs = Op.yoList(this);

            return renderJsx(this, {
                siderAttrs,
                alert,
                selected: $selected,
                listAttrs,
            })
        }, LOG)
    }
}

export default Component