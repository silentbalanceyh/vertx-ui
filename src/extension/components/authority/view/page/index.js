import uiMenu from './UI.Menu';
import Container from './UI.Container';

import React from 'react';
import Ex from 'ex';

const UI = {
    "rule.menu.definition": uiMenu,
}
export default (key) => (reference, config) => {
    const Component = UI[key];
    if (Component) {
        const {$owner = {}} = reference.state;
        return (
            <Container config={config} $owner={$owner}>
                <Component {...Ex.yoAmbient(reference)} $owner={$owner}/>
            </Container>
        )
    } else return false;
}