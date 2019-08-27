import React from 'react';
import Ex from 'ex';

const LOG = {
    name: "OxLayout",
    color: "#CD4F39"
};

/*
 * Zero Extension： zero-ui 专用组件
 */
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiLayout(this);
    }

    render() {
        return Ex.yoRender(this, () => {

            return false;
        }, LOG);
    }
}

export default Component;