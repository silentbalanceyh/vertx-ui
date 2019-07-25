import React from 'react';

class Component extends React.PureComponent {
    render() {
        const {config = []} = this.props;
        return (
            <div>
                {config.map(button => {

                    return false;
                })}
            </div>
        );
    }
}

export default Component;