import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {ExComplexList} from "ei";
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiCompany(this).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "grid");
            const form = {
                FormAdd,    // 添加表单
                FormEdit,   // 更新表单
                FormFilter  // 搜索表单
            };
            /*
             * 重新构造查询条件
             */
            const {$inited = {}} = this.props;
            const {$query = {}} = this.state;
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               $query={$query}
                               $record={$inited}    // 特殊变量，form 中需要穿透传递
                               config={config} $form={form}/>
            );
        }, Ex.parserOfColor("PxCompanyList").control());
    }
}

export default Component;