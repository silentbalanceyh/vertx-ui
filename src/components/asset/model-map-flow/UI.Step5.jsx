import {OpsModelStep} from "app";
import React from "react";
import UIPage from "./page4/UI";
import Ex from 'ex';

export default {
    page: (reference) => {
        const {
            $step,
            $data = {},
        } = reference.state;
        return (
            <div>
                <OpsModelStep $step={$step}/>
                <UIPage {...Ex.yoAmbient(reference)} data={$data}/>
            </div>
        )
    },
    op: (reference) => false
}