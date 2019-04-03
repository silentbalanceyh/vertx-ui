import React from 'react';
import './Cab.less';
import UD from '../Util';
import Rdr from './UI.Render';

class Component extends React.Component {

    componentDidMount() {
        UD.mountComponent(this,
            () => UD.initComponent(this, 'createDetailpanel'),
            this.detailpannelContainer);
    }

    render() {
        // 临时解决方案，由于样式问题导致的选择
        const {
            selected = {},
            config = {},
            components = {}
        } = this.props;
        const {type} = selected;
        const title = config[type];
        const Component = components[type];
        return (
            <div className="detailpannel" ref={el => {
                this.detailpannelContainer = el;
            }}>
                {Rdr.renderNode(type, {
                    title,
                    selected,
                }, Component)}
                {Rdr.renderEdge(type, {
                    title,
                    selected
                }, Component)}
                {Rdr.renderGroup(type, {
                    title,
                    selected
                }, Component)}
            </div>
        );
    }
}

export default Component;
