import React from 'react';
import './Cab.less';
import UD from '../Util';

class Component extends React.PureComponent {

    componentDidMount() {
        UD.mountComponent(this,
            () => UD.initComponent(this, 'createItempanel'),
            this.itempanelContainer);
    }

    render() {
        return (
            <div className="itempannel" ref={el => {
                this.itempanelContainer = el;
            }}>
                {this.props.content}
            </div>
        );
    }
}

export default Component;