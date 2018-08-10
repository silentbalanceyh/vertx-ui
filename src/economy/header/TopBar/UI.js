import './Cab.less'
import React from 'react'
import {Button} from 'antd'
import Ux from 'ux';

class Component extends React.PureComponent {
    render() {
        const {$key, $title = "", $buttons = {}} = this.props;
        const buttons = $buttons[$key] ? $buttons[$key] : [];
        const groups = Ux.elementVertical(buttons, "group");
        return (
            <div>
                {$title}
                {(0 === groups.length) ? (
                    buttons.map(button =>
                        <Button key={button.key} className="top-button"
                                type={button.type ? button.type : 'default'}
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
        )
    }
}

export default Component
