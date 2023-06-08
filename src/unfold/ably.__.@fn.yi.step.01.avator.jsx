import Ux from 'ux';
import React from 'react';
import __IMG from './aero-image';
import __Zn from './zero.module.dependency';
import {ExActionAvator} from './aero-extenion';

export default async (reference, menuData = [], config = {}) => {
    // Promise for Build avator
    const user = Ux.isLogged();
    // Logged
    const photo = user.logo ? user.logo : __IMG.AVATOR_DEFAULT;
    const inherit = __Zn.yoAmbient(reference);
    // data process for ExLogged;
    inherit.data = __Zn.a4MenuWeb(menuData, Ux.Env.MENU_TYPE.TOP);
    const size = "small";
    inherit.config = {
        ...config,
        size,
    };
    let title = `${user.username}`;
    if (user.alias) {
        title = `${title} / ${user.alias}`
    }
    return {
        src: photo,
        size,
        title,
        render: (props, dom) => {
            return (
                <ExActionAvator {...inherit} content={dom}/>
            )
        }
    }
}