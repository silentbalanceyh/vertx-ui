const _DEBUG = Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG);
const debug = (reference = {}, Name) => {
    if (_DEBUG) {
        const message = `%c [Zero] [Rx-Economy] Component Monitor: name = ${Name}`;
        console.groupCollapsed(message, 'color:#0099FF;font-weight:900;');
        console.log(`%c [Zero] Props -> `, 'color:#660099;font-weight:900;', reference.props);
        console.log(`%c [Zero] State -> `, 'color:#666666;font-weight:900;', reference.state);
        console.groupEnd();
    }
};
export default {
    debug
};