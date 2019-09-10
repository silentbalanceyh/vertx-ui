import Cmn from './I.common';

export default (value, {props}) => {
    const path = value[0];
    return Cmn.findValue(props, path);
}