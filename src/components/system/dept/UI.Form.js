import React from "react";
import "./Cab.less";
import Ux from "ux";
import Types from "./Act.Types";
import {Button, Checkbox, Input} from "antd";
import Op from "./Op";

const {zero, Logger} = Ux;

const jsx = {
    name:(reference, jsx = {}) => (<Input {...jsx}/>),
    code:(reference, jsx = {}) => (<Input {...jsx}/>),
    active:(reference, jsx = {}) => (<Checkbox {...jsx}/>),
    $button: reference => {
        return (
            <div>
                <Button id="btnAdd" onClick={Op.fnAdd(reference)}/>
                <Button id="btnSave" onClick={Op.fnSave(reference)}/>
            </div>
        );
    }
};
const initForm = (reference = {}) => {
    const {$key} = reference.props;
    const data = {};
    if ($key) {
        Ux.formRead(reference, data);
        console.info("[Kid] Update Values: ", data);
    } else {
        data.active = true;
        console.info("[Kid] Init Values: ", data);
    }
    Ux.formClear(reference, data);
    return data;
};

@zero({
    connect: {
        s2p: state => Ux
            .dataIn(state)
            .rework({
                datum: ["record", "clear"]
            })
            .rinit(["clear"], true)
            .to(),
        d2p: {
            fnInit: Types.fnDepartment
        }
    },
    form: true,
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI.Form",
    logger: Logger.form
})
class Component extends React.PureComponent {

    componentDidMount() {
        Ux.cycleUpdateForm(this.props);
    }

    componentDidUpdate(prevProps) {
        Ux.cycleUpdateForm(this.props, prevProps);
    }

    render() {
        return Ux.uiFieldForm(this, jsx, 1, initForm(this));
    }
}

export default Component;
