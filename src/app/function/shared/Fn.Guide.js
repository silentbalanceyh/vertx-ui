import React from 'react';
import UI from "../../control/GuidePanel/UI";

const guide = (reference, ...files) => (jsx) => {
    return (
        <UI>
            {jsx}
        </UI>
    )
};
export default {
    guide
}