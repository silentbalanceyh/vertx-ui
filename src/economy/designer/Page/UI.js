import React from 'react';
import './Cab.less';
import UD from '../Util';

class Component extends React.Component {

    componentDidMount() {
        UD.mountComponent(this,
            () => UD.initComponent(this, 'createPage'),
            this.pageContainer);
    }

    render() {

        return (
            <div className={"page"} ref={el => {
                this.pageContainer = el;
            }}/>
        );
    }
}

export default Component;