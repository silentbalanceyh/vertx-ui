import React from 'react'
import Ux from 'ux';
import {Icon} from 'antd';
import {_zero} from "../../_internal";

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    render() {
        const message = Ux.fromPath(this, "info", "empty");
        return (
            <div className={"zero-debug-error"}>
                <ul>
                    {message.map((item, index) => (
                        <li key={`message${index}`}>
                            {0 === index ? <Icon type={"close-circle"} style={{
                                fontSize: 20,
                                color: "red",
                                marginRight: 15
                            }}/> : false}
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Component