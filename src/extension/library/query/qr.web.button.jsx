import {Button} from "antd";
import Fn from '../functions';
import Op from '../op';
import React from 'react';

export default (reference, {
    search = "",
    clear = ""
}) => (
    <Button.Group className={"ux-group"}>
        <Button type={"primary"} icon={"search"} htmlType={"button"}
            // 双属性注入
                onClick={Fn.xtOp(reference, {
                    // 直接绑定合并方法
                    success: Fn.form(reference).filter
                }, true)}>{search}</Button>
        <Button icon={"reload"} htmlType={"button"}
                onClick={Op.$opReset(reference)}>{clear}</Button>
    </Button.Group>
)