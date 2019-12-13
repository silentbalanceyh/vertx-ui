import Ux from "ux";

export default {
    username: (reference, jsx) => {
        jsx.onPressEnter = (event) => {
            Ux.prevent(event);
            Ux.connectId("$opLogin");
        };
        return Ux.aiInput(reference, jsx);
    },
    password: (reference, jsx) => {
        jsx.onPressEnter = (event) => {
            Ux.prevent(event);
            Ux.connectId("$opLogin");
        };
        return Ux.aiInput(reference, jsx);
    }
};