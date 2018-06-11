import './Cab.less'
import React from 'react'
import { Button } from 'antd'
import Ux from 'ux';

class Component extends React.PureComponent {
    render() {
        const {$key, $title = "", $buttons = {}} = this.props;
        const buttons = $buttons[$key] ? $buttons[$key] : [];
        const groups = Ux.elementVertical(buttons, "group");
        return (
            <div>
                { $title }
                { (0 === groups.length) ? (
                    buttons.map(button =>
                        <Button key={ button.key } className="top-button"
                                type={ button.type ? button.type : 'default' }
                                onClick={ button.onClick ? button.onClick : () => {
                                    console.warn("[TopBar] Not implemented" + button.key);
                                } }>
                            { button.text }
                        </Button>
                    )
                ) : (groups.map(group => (
                        <Button.Group key={ group } className="top-group">
                            { buttons.filter(item => group === item.group).map(button => (
                                <Button key={ button.key }
                                        type={ button.type ? button.type : 'default' }
                                        onClick={ button.onClick ? button.onClick : () => {
                                            console.warn("[TopBar] Grouped Not implemented + " + button.key);
                                        } }>
                                    { button.text }
                                </Button>
                            )) }
                        </Button.Group>
                    ))
                ) }
            </div>
        )
    }
}

export default Component
