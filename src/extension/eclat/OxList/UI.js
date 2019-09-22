import React from 'react';
import Ex from 'ex';

const LOG = {
    name: "OxList",
    color: "#A52A2A"
};

class Component extends React.PureComponent {
    state = {};

    render() {
        console.error(this.props);
        return Ex.yoRender(this, () => {

            return false;
        }, LOG);
    }
}

export default Component;