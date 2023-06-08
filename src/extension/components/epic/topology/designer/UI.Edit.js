import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './op';

import renderGraphic from './Web.Graphic';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGraphic(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <div className={"drawer-background"}>
                    {renderGraphic(this)}
                </div>
            );
        }, Ex.parserOfColor("FormEdit").form());
    }
}

export default Component;