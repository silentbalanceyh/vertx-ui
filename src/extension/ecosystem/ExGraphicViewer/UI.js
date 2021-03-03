import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from "./op";
import {G6Viewer} from "web";
import {Spin} from 'antd';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicViewer")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ux.g6PageInit(this, Op.yiGraphic);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.g6PageUp(this,
            {props: prevProps, state: prevState}, Op.yiGraphic);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $gEvent, $data = {},
                $submitting = false,
            } = this.state;
            const inherit = Ex.yoAmbient(this);
            inherit.$gEvent = $gEvent;
            inherit.data = $data;

            const info = Ux.fromHoc(this, "info");
            return (
                <div className={"drawer-background"}>
                    <Spin spinning={$submitting} tip={info.loading}>
                        <G6Viewer {...inherit}/>
                        {Ux.x6UiDialog(this, {
                            supplier: Ex.yoDynamic
                        })}
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("ExGraphicViewer").component())
    }
}

/*
 * 直接根据配置项数据构造拓扑图
 */
export default Component;