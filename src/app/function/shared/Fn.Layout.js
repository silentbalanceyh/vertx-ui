import './Cab.less'
import React from "react";
import LayoutPanel from '../../control/LayoutPanel/UI'

const layout = (reference, jsx) => {
    return (
        <LayoutPanel reference={reference}>
            {jsx}
        </LayoutPanel>
    )
};

export default {
    layout,
}