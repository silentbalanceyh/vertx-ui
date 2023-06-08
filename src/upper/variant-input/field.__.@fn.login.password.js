import Ux from 'ux';

export default (reference, jsx) => {
    jsx.onPressEnter = (event) => {
        Ux.prevent(event);
        Ux.connectId("$opLogin");
    };
    return Ux.aiInput(reference, jsx);
}