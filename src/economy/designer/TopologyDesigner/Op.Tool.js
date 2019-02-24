import Ux from "ux";
import U from 'underscore';

const initToolbar = (reference) => {
    const toolbar = Ux.fromHoc(reference, "toolbar");
    let $toolbars = [];
    if (U.isArray(toolbar)) {
        toolbar.forEach(item => {
            // 分割线
            if ("divider" === item) {
                const toolbar = {};
                toolbar.key = Ux.randomString(8);
                toolbar.divider = true;
                $toolbars.push(toolbar);
            } else {
                const toolbar = {};
                const itemArr = item.split(',');
                toolbar.key = itemArr[0];
                toolbar.text = itemArr[1];
                toolbar.command = itemArr[2];
                toolbar.className = itemArr[3];
                $toolbars.push(toolbar);
            }
        });
    }
    return $toolbars;
};
export default {
    initToolbar
};