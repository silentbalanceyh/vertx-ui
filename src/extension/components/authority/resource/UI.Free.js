import React from 'react';
import Ux from 'ux';
import {LoadingAlert} from 'web';
import Op from './op/Op';
import Ex from "ex";
import {ExListComplex} from "ei";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Free.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiFreeList(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const alert = Ux.fromHoc(this, "alert");
            /*
             * Grid
             */
            const listAttrs = Op.yoFreeList(this);
            return (
                <div>
                    <LoadingAlert $alert={alert}/>
                    <ExListComplex {...listAttrs}/>
                </div>
            )
        }, Ex.parserOfColor("PxPermissionFree").control());
    }
}

export default Component