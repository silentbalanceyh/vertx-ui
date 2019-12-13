import React from 'react'
import {FormSegment} from "web";

const aiFormSegment = (reference, jsx = {}) =>
    (<FormSegment {...jsx} reference={reference}/>);
export default {
    aiFormSegment
}
