import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';

const UCA_NAME = "ExHref";
const rxRoute = (reference, route = {}) => (event) => {
    Ux.prevent(event);
    const {$router, __state = {}} = reference.props;
    const {
        target = true,
        qr = false,
        param = [], uri,
    } = route;
    if (uri) {
        const parameters = {}
        param.forEach(each => {
            const eachV = Ux.toQuery(each);
            if (eachV) {
                parameters[each] = eachV;
            }
        })
        if (qr) {
            parameters.__state = JSON.stringify(__state);
        }
        if (target) {
            parameters.target = $router.path();
        }
        Ux.toRoute(reference, `/workflow/open`, parameters);
    } else {
        console.error("uri 参数丢失！")
    }
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {config = {}} = this.props;
        const {action, route} = config;
        if (action && route) {
            const {text, ...buttonAttrs} = action;
            buttonAttrs.icon = Ux.v4Icon(buttonAttrs.icon);
            return (
                <Button {...buttonAttrs}
                        className={"open-button"}
                        onClick={rxRoute(this, route)}>
                    {text}
                </Button>
            )
        } else {
            return (
                <div className={"ux_error"}>
                    `action` or `route` missing !!
                </div>
            )
        }
    }
}

export default Component