import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import renderJsx from './Web';

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
            const {$selected = false, $opened = false} = this.state;
            /*
             * 基本信息说明
             */
            const alert = Ux.fromHoc(this, "alert");
            /* 专用组件信息 */
            const listAttrs = Op.yoList(this);

            const span = $opened ? {left: 0, right: 24} : {left: 4, right: 20};
            return renderJsx(this, {
                siderAttrs,
                alert,
                selected: $selected,
                listAttrs,
                span
            })
        }, Ex.parserOfColor("PxCategory").page())
    }
}

export default Component