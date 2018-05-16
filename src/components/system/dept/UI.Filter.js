import React from 'react'
import Ux from 'ux';
import {Button, Input} from 'antd';

const {zero, Logger} = Ux;

const jsx = {
    name:(reference, jsx = {}) => (<Input {...jsx}/>),
    code:(reference, jsx = {}) => (<Input {...jsx}/>),
    $button: (reference, jsx = {}) => {
        const op = Ux.fromHoc(reference, "button");
        return (
            <div>
                <Button type="primary" onClick={Ux.onSearch(reference)}>{op.search}</Button>
                <Button onClick={Ux.onResetFilter(reference)}>{op.reset}</Button>
            </div>
        )
    }
};

@zero({
    form: true,
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI.Filter",
    logger: Logger.form
})
class Component extends React.PureComponent {
    render = () => Ux.uiFieldForm(this, jsx, 3);
}

export default Component;
