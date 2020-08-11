import uiMenu from './menu/UI';
import uiCategory from './category/UI';
import uiColumn from './column/UI';
import uiForm from './form/UI';
import uiOp from './op/UI';
import Container from './UI.Container';

import React from 'react';
import Ex from 'ex';
import Ux from 'ux';

const UI = {
    "rule.menu.definition": uiMenu,
    "rule.category.definition": uiCategory,
    "rule.list.column.definition": uiColumn,
    "rule.form.field.definition": uiForm,
    "rule.op.definition": uiOp,
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
                           rxTree={($supportKeys = [], addOn = {}) => {
                               const state = {};
                               state.$supportKeys = $supportKeys;
                               if (!Ux.isEmpty(addOn)) {
                                   Object.assign(state, addOn)
                               }
                               reference.setState(state);
                           }}/>
            </Container>
        )
    } else {
        console.error("找不到组件：key = ", key);
        return false;
    }
}