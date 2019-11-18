import React from 'react';
import Ux from 'ux';
import renderJsx from './Web.jsx';
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';
import Ex from "ex";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiStandard(this);
    }

    render() {
        return Ex.yoRender(this, () => {

            const config = Ux.fromHoc(this, "grid");
            /* 专用组件信息 */
            const form = {
                FormAdd,    // 添加表单
                FormEdit,   // 更新表单
                FormFilter  // 搜索表单
            };
            return renderJsx(this, {
                config,
                form
            })
        }, Ex.parserOfColor("PxRBACGroup").page());
    }
}

export default Component