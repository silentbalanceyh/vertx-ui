import React from 'react';
import Ex from 'ex';
import Ux from 'ux';

import FormAdd from "./form/UI.Add";
import FormEdit from "./form/UI.Edit";
import FormFilter from "./form/UI.Filter";

import {ExComplexList} from "ei";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiStandard(this);
    }

    componentDidUpdate(props, state, snapshot) {
        Ex.yuRouter(this, {props, state}, () => {
            Ex.yiStandard(this);
        });
    }

    render() {
        return Ex.ylDynamic(this, () => {
            /*
             * 加载完成过后的渲染
             */
            const config = Ux.fromHoc(this, "grid");
            /* 专用组件信息 */
            const form = {
                FormAdd,    // 添加表单
                FormEdit,   // 更新表单
                FormFilter  // 搜索表单
            };
            /*
             * 外置传入查询条件
             */
            const {$query = {}} = this.state;
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               config={config}
                               $form={form}
                               $query={$query}/>
            );
        }, Ex.parserOfColor("PxEmployeeType").type());
    }
}

export default Component;