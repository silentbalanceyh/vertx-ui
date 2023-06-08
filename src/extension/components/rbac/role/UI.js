import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';
import {ExListComplex} from "ei";
import {PageCard} from "web";

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
            return (
                <PageCard reference={this}>
                    <ExListComplex {...Ex.yoAmbient(this)}
                                   $executor={{
                                       fnAuthorize: (roleId, record = {}) => Ex.aclRoute(this, {
                                           key: roleId,
                                           view: "ROLE",
                                           data: record,
                                       })
                                   }}
                                   config={config} $form={form}/>
                </PageCard>
            )
        }, Ex.parserOfColor("PxRBACRole").page());
    }
}

export default Component