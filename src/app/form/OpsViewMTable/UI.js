import React from 'react';
import Ux from 'ux';
import {Fn} from 'app';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Fn.jsxCard(this,
            () => Fn.jsxForm(this),
            null,
            (text) => {
                const {$inited = {}} = this.props;
                const title = Ux.fromHoc(this, "title");
                const selected = title[$inited.type];
                if (selected) {
                    return text + selected;
                } else {
                    return text;
                }
            }
        )
    }
}

export default Component