import React from 'react';
import {Dropdown, Icon, Menu, Slider} from 'antd';
import './Cab.less';
import UD from '../Util';

class Component extends React.Component {

    componentDidMount() {
        UD.mountComponent(this,
            () => UD.initComponent(this, 'createMinimap'),
            this.minimapContainer);
    }

    sliderTipFormatter(num) {
        const {minZoom, maxZoom} = this.props;
        const zoom = Math.ceil(num * (maxZoom - minZoom) + minZoom * 100);
        return zoom + '%';
    }

    sliderChange(num) {
        const {minZoom, maxZoom, changeZoom} = this.props;
        changeZoom(num / 100 * (maxZoom - minZoom) + minZoom);
    }

    dropdownChange(ev) {
        const item = ev.item;
        const zoom = item.props.zoom;
        const {changeZoom} = this.props;
        changeZoom(Number(zoom));
    }

    render() {
        const {curZoom, minZoom, maxZoom} = this.props;
        const menu = (
            <Menu onClick={this.dropdownChange.bind(this)}>
                <Menu.Item zoom="0.5">50%</Menu.Item>
                <Menu.Item zoom="1">100%</Menu.Item>
                <Menu.Item zoom="1.5">150%</Menu.Item>
                <Menu.Item zoom="2">200%</Menu.Item>
            </Menu>
        );
        return (
            <div id="navigator">
                <div className="panel-title">导航器</div>
                <div id="minimap" ref={el => {
                    this.minimapContainer = el;
                }}/>
                <div id="zoom-slider">
                    <Slider value={(curZoom - minZoom) / (maxZoom - minZoom) * 100}
                            className="slider"
                            tipFormatter={this.sliderTipFormatter.bind(this)}
                            onChange={this.sliderChange.bind(this)}
                    />
                    <Dropdown overlay={menu}>
                        <a className="zoom-dropdown-btn" href="#">
                            {Math.ceil(curZoom * 100)} %<Icon type="down"/>
                        </a>
                    </Dropdown>
                </div>
            </div>
        );
    }
}

export default Component;
