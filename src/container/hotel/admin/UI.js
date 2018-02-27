import React from 'react'

class Component extends React.PureComponent{

    render(){
        const { component: Component } = this.props;
        return (
            <div>
                Login
                <Component {...this.props}/>
            </div>
        )
    }
}

export default Component;
