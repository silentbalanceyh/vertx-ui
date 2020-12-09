import React from 'react';
import Op from './op';
import Ex from 'ex';
import Ux from "ux";
import './Cab.less';
import {G6Editor} from 'web';
import {Spin} from 'antd';

import ExFormLink from './form/UI';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicEditor")
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
            /*
             * 构造图形相关事件对象
             */
            const {
                $gEvent, $data = {},
                $submitting = false,
            } = this.state;
            /*
             * 构造分组信息
             */
            const inherit = Ex.yoAmbient(this);
            inherit.$gEvent = $gEvent;
            inherit.data = $data;

            const info = Ux.fromHoc(this, "info");
            return (
                <div className={"drawer-background"}>
                    <Spin spinning={$submitting} tip={info.loading}>
                        <G6Editor {...inherit}/>
                        {Ux.x6UiDialog(this, {
                            component: ExFormLink,
                            supplier: Ex.yoForm,
                        })}
                    </Spin>
                </div>
            );
        }, Ex.parserOfColor("ExGraphicEditor").component());
    }
}

export default Component;