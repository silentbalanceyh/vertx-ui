import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExListComplex} from "ei";
import FormAdd from './form/UI.Add';
import FormEdit from './form/UI.Edit';
import FormFilter from './form/UI.Filter';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.List")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiCompany(this).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "grid");
            const form = {
                FormAdd,
                FormEdit,
                FormFilter,
            };
            return (
                <ExListComplex {...Ex.yoAmbient(this)}
                               config={config} $form={form}/>
            )
        }, Ex.parserOfColor("PxEmployeeList").control());
    }
}

export default Component;