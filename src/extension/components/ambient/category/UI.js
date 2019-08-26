import React from 'react';
import Ex from 'ex';

const LOG = {
    name: "PxCategory",
    color: "#36648B"
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ex.yiCategory(this);
    }

    render() {
        /*
         * 第二次渲染时处理变化
         */
        return Ex.ylCard(this, () => {
            return false;
        }, {
            ...LOG,
        })
    }
}

export default Component;