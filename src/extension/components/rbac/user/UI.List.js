import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExComplexList} from "ei";
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';


const LOG = {
    name: "PxUserList",
    color: "#1874CD",
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.List")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "grid");
            const form = {
                FormAdd,
                FormEdit,
                FormFilter,
            };
            return (
                <ExComplexList {...Ex.yoAmbient(this)}
                               config={config} $form={form}/>
            )
        }, LOG);
    }
}

export default Component;