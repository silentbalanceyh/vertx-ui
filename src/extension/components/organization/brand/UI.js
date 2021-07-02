import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import renderJsx from './Web.jsx';
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
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
        }, Ex.parserOfColor("PxBrand").page());
    }
}

export default Component