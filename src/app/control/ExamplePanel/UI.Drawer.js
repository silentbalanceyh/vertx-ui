import React from 'react'
import './Cab.less'
import Ux from 'ux'
import {Button, Drawer} from 'antd';
import {AttrSetter} from "web";

const renderDrawer = (ref) => {
    const {reference} = ref.props;
    const drawer = Ux.fromHoc(ref, "drawer");
    const {$drawer} = ref.state;
    return (
        <div>
            <Button id="$opSetting" className={"ux-hidden"} onClick={event => {
                event.preventDefault();
                ref.setState({$drawer: true})
            }}/>
            <Drawer {...drawer} onClose={() => {
                ref.setState({$drawer: false})
            }} visible={$drawer} height={500} className={"web-drawer-panel"}>
                <AttrSetter reference={reference}/>
            </Drawer>
        </div>
    )
};
export default {
    renderDrawer
}