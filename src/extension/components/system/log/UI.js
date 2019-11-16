import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';
import {ExComplexList} from "ei";
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("./Cab"))
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
        return Ex.ylCard(this, () => {
            /* 专用组件信息 */
            const form = {
                FormEdit,   // 更新表单
                FormFilter  // 搜索表单
            };
            const config = Ux.fromHoc(this, "grid");
            const {$query = {}} = this.state;
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               config={config} $form={form} $query={$query}/>
            )
        }, Ex.parserOfColor("PxLog").page())
    }
}

export default Component