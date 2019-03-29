import React from 'react';
import './UI.css';
import Toolbar from './UI.Toolbar';

class Component extends React.PureComponent {
    render() {
        return (
            <div id="editor">
                <Toolbar/>
            </div>
        );
    }
}

export default Component;