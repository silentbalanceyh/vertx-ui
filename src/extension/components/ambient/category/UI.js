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
        Ex.yiStandard(this).then(Ux.pipe(this));
    }

    componentDidUpdate(props, state, snapshot) {
        const reference = this;
        Ex.yuRouter(reference, {props, state}, () =>
            Ex.yiStandard(reference).then(Ux.pipe(reference)));
    }

    render() {
        return Ex.ylDynamic(this, () => {
            const attrs = Ex.yoPolymorphism(this, {
                form: {
                    FormAdd,    // 添加表单
                    FormEdit,   // 更新表单
                    FormFilter  // 搜索表单
                }
            });
            return (
                <ExComplexList {...attrs}/>
            );
        }, Ex.parserOfColor("PxCategoryType").type())
    }
}

export default Component;