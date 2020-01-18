import Eng from "../engine";
import Abs from "../abyss";

const cabModal = (reference, key) => {
    const modal = Eng.fromHoc(reference, "modal");
    const seek = {};
    if (Abs.isObject(modal)) {
        const title = Eng.fromHoc(reference, "dialog");
        Object.keys(modal).forEach(type => {
            /*
             * 检查
             */
            const config = modal[type];
            if (Abs.isObject(config)) {
                if (config.hasOwnProperty(key)) {
                    seek.type = type;
                    seek.content = config[key];
                    if (title) {
                        /*
                         * 标题信息
                         */
                        seek.title = title[type];
                    }
                }
            }
        });
    }
    return seek;
};
export default {
    cabModal
}