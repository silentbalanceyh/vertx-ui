import Cmn from './I.common';

export default (value, {props}) => {
    const path = value[0];
    const attrPath = path.split('.');
    return Cmn.findValue(props, attrPath);
}