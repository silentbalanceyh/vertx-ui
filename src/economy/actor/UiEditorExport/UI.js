import React from 'react'

class Component extends React.PureComponent {
    state = {
        $selected: [],
    };

    render() {
        console.info(this.props);
        return (
            <div>2019-05-24</div>
        )
    }
}

export default Component