import Ex from 'ex';
import TplPage from "../../control/TplPage/UI";
import React from 'react';

const tplPage = (reference, pages = {}) => {
    return Ex.ylCard(reference, () => {
        return (
            <TplPage pages={pages}/>
        )
    })
}
export default {
    tplPage
}