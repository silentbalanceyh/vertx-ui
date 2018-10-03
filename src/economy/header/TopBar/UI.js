import './Cab.less';
import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "status": ["submitting"]
            })
            .rinit(["submitting"])
            .to()
    },
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    render() {
        const {$key, $title = "", $buttons = {}, $submitting} = this.props;
        const buttons = $buttons[$key] ? $buttons[$key] : [];
        const groups = Ux.elementVertical(buttons, "group");
        const loading = $submitting._("loading");
        return (
            <div>
                {$title}
                {(0 === groups.length) ? (
                    buttons.map(button =>
                        <Button key={button.key} className="top-button"
                                type={button.type ? button.type : 'default'}
                                loading={loading}
                                disabled={button.disabled}
                                onClick={button.onClick ? button.onClick :
                                    () => Ux.E.fxWarning(true, 10017, "onClick")}>
                            {button.text}
                        </Button>
                    )
                ) : (groups.map(group => (
                        <Button.Group key={group} className="top-group">
                            {buttons.filter(item => group === item.group).map(button => (
                                <Button key={button.key}
                                        loading={loading}
                                        type={button.type ? button.type : 'default'}
                                        disabled={button.disabled}
                                        onClick={button.onClick ? button.onClick : () => Ux.E.fxWarning(true, 10017, "onClick")}>
                                    {button.text}
                                </Button>
                            ))}
                        </Button.Group>
                    ))
                )}
            </div>
        );
    }
}

export default Component;
