import React from 'react'
import Ux from "ux";
import {Fn} from 'app';

const {zero} = Ux;

@zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Drawer.View")
    .state({})
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const ref = Ux.onReference(this, 2);
        const connected = Fn.connectPage(ref, "UI.Demo");
        this.setState({
            additional: {
                title: connected.title
            },
            connected
        })
    }

    componentDidUpdate(prevProps) {
        // 抽屉拉出来的时候执行绘制
        const {$visible} = this.props;
        const {$finished = false} = this.state;
        if ($visible && !$finished) {
            const {connected = {}} = this.state;
            if (connected.items) {
                Ux.G.drawTree("gConnect", connected);
                this.setState({$finished: true});
            }
        }
    }

    render() {
        const {additional} = this.state;
        return Fn.drawer(this, "$connect", (
            <div id={"gConnect"}/>
        ), additional)
    }
}

export default Component