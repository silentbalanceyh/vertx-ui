import React from 'react';
import Ux from "ux";
import Op from './Op';
import Ex from "ex";
import Sd from '../_shared';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Menu")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <div className={"page-menu"}>
                    {Sd.renderButtons(this)}
                    {Sd.renderGrid(this)}
                </div>
            );
        }, Ex.parserOfColor("Rule-Menu").define())
    }
}

export default Component