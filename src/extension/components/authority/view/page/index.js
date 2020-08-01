import uiMenu from './menu/UI';
import uiCategory from './category/UI';
import uiColumn from './column/UI';
import uiForm from './form/UI';
import Container from './UI.Container';

import React from 'react';
import Ex from 'ex';

const UI = {
    "rule.menu.definition": uiMenu,
    "rule.category.definition": uiCategory,
    "rule.list.column.definition": uiColumn,
    "rule.form.field.definition": uiForm,
}
export default (key) => (reference, config) => {
    const Component = UI[key];
    if (Component) {
        const {$owner = {}, $supportKeys} = reference.state;
        return (
            <Container config={config} $owner={$owner}>
                <Component {...Ex.yoAmbient(reference)}
                           $owner={$owner}
                           $supportKeys={$supportKeys}
                           rxTree={($supportKeys => reference.setState({$supportKeys}))}/>
            </Container>
        )
    } else {
        console.error("找不到组件：key = ", key);
        return false;
    }
}