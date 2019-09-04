import React from 'react';
import Op from './Op';
import Ex from 'ex';

import renderJsx from './Web';

const LOG = {
    name: "ExSearch",
    color: "#00868B"
};

class Component extends React.PureComponent {
    state = {
        searchText: "",     // 输入的文本
        $search: undefined,     // 基础搜索配置
        $advanced: undefined,   // 高级搜索配置
        $visible: false,
        $ready: false,      // 没Ready
    };

    componentDidMount() {
        Op.yiSearch(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 拆组件
             */
            return renderJsx(this, null);
        }, LOG);
    }
}

export default Component;