import React from 'react';
import {Command} from 'gg-editor';
import Ux from "ux";

const renderCommand = (item) => {
    if (item) {
        Ux.dgDebug(item, "「右键」原生命令");
        return (
            <Command key={item.key} name={item.command}>
                <div className={"item"}>
                    <i className={`iconfont ${item.className}`}/>
                    <span>{item.text}</span>
                </div>
            </Command>
        );
    } else return false;
};

const renderMenu = (menus = [], Component) => (
    <Component>
        {menus.map(menu => renderCommand(menu))}
    </Component>
);

export default {
    renderMenu
};
