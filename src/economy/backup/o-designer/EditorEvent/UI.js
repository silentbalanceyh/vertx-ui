import React from 'react';
import './Cab.less';
import {
    CanvasMenu,
    ContextMenu,
    EdgeMenu,
    GroupMenu,
    MultiMenu,
    NodeMenu
} from "gg-editor";
import Rdr from './UI.Render';

class Component extends React.PureComponent {
    render() {
        const {$config = {}} = this.props;
        const {node = [], edge = [], group = [], multi = [], canvas = []} = $config;
        return (
            <ContextMenu className={"context-menu"}>
                {Rdr.renderMenu(node, NodeMenu)}
                {Rdr.renderMenu(edge, EdgeMenu)}
                {Rdr.renderMenu(group, GroupMenu)}
                {Rdr.renderMenu(multi, MultiMenu)}
                {Rdr.renderMenu(canvas, CanvasMenu)}
            </ContextMenu>
        );
    }
}

export default Component;