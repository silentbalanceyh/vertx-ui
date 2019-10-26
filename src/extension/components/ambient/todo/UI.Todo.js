import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';

import FormFilter from './form/UI.Filter';
import FormEdit from './form/UI.View';
import renderJsx from './Web';

const LOG = {
    name: "PxTodo",
    color: "#36648B"
};

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Todo")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const grid = Ux.fromHoc(this, "grid");
            const form = {
                FormFilter,
                FormEdit,
            };
            /*
             * category data
             */
            const category = Ux.onDatum(this, "data.pending");
            return renderJsx(this, {grid, form, category});
        }, LOG)
    }
}

export default Component;