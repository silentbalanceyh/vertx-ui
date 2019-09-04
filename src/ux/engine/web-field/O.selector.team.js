import {TeamSelector} from "web";
import React from "react";
import R from '../expression';

const aiTeamSelector = (reference, jsx = {}) => {
    R.Ant.onMockData(jsx, reference);
    return (<TeamSelector {...jsx} reference={reference}/>);
};

export default {
    aiTeamSelector,
}