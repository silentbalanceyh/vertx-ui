import React from 'react'
import renderJsx from './Web.Notify.jsx';

class Component extends React.PureComponent {

    render() {
        return renderJsx(this, {});
    }
}

export default Component
