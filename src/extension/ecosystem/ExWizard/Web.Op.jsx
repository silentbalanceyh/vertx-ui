import React from 'react';
import {Button} from 'antd';
import Op from './Op';

export default (reference) => {
    const {$op} = reference.state;
    if ($op) {
        return (
            <Button id={$op} onClick={Op.rxClick(reference)} className={"ux-hidden"}/>
        )
    } else return false;
}