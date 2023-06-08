import __Zn from './zero.module.dependency';

const configAnchor = (reference, op, callback) => {
    const $button = [];
    const rxClick = (key) => (event) => {
        __Zn.prevent(event);
        let state = {$visible: true};
        if (__Zn.isFunction(callback[key])) {
            /*
             * 特殊 callback 回调
             */
            const promise = callback[key]();
            promise.then((callbackState = {}) => {
                Object.assign(callbackState, state);

                __Zn.of(reference).in(callbackState).done();
                // reference.?etState(callbackState);
            });
        } else {
            __Zn.of(reference).in(state).done();
            // reference.?etState(state);
        }
    };
    if (op) {
        if (__Zn.isArray(op)) {
            /*
             * 数组模式
             */
            op.forEach(key => {
                const button = {};
                button.key = key;
                button.id = key;
                button.className = "ux_hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        } else if (__Zn.isObject(op)) {
            /*
             * 对象格式
             */
            __Zn.itObject(op, (key, id) => {
                const button = {};
                button.key = key;
                button.id = id;
                button.className = "ux_hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        }
    }
    return $button;
};

const configIcon = (config = {}) => {
    const {item = {}} = config;
    const {
        icon,
        iconSize = 16,
        color
    } = item;
    if (icon) {
        const iconData = {};
        iconData.type = icon;
        iconData.style = {fontSize: iconSize};
        if (color) {
            iconData.style.color = color;
        }
        return iconData;
    } else return {};
}
export default {
    configIcon,
    configAnchor,
}