import React from 'react';
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {config = {}, children} = this.props;
        return (
            <div className={"web-rectangle"}>
                <fieldset>
                    <legend>{config.title}</legend>
                    {children}
                </fieldset>
            </div>
        );
    }
}

export default Component;