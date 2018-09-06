import React from 'react'
import '../Cab.less'
import Ux from "ux";
import {Drawer} from "antd";
import {AttrSetter} from "web";

const {zero} = Ux;

@zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Setting")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {reference, $drawer = false} = this.props;
        const ref = Ux.onReference(reference, 1);
        const drawer = Ux.fromHoc(this, "drawer");
        return (
            <Drawer {...drawer} onClose={() => {
                reference.setState({$drawer: false})
            }} visible={$drawer} height={500} className={"web-drawer-panel"}>
                <AttrSetter reference={ref}/>
            </Drawer>
        )
    }
}

export default Component;