import React from 'react';

class Component extends React.PureComponent {
    render() {
        console.info(this.props);
        return (
            <div>
                Database Editor
            </div>
        )
    }
}

export default Component