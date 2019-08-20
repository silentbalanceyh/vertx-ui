import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import renderJsx from './Web';
import FormAdd from "./form/UI.Add";
import FormEdit from "./form/UI.Edit";
import FormFilter from "./form/UI.Filter";

const LOG = {
    name: "PxTabular",
    color: "#36648B"
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiTabular(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 加载完成过后的渲染
             */
            const config = Ux.fromHoc(this, "grid");
            const {$query = {}} = Ex.state(this);
            /* 专用组件信息 */
            const form = {
                FormAdd,    // 添加表单
                FormEdit,   // 更新表单
                FormFilter  // 搜索表单
            };
            return renderJsx(this, {
                config,
                form,
                $query,
            });
        }, LOG);
    }
}

export default Component;