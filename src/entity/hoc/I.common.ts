import * as Immutable from 'immutable';

const toMerge = (original: any = {}, metadata: any) => {
    if (metadata) {
        /*
             * 使用一级合并，不合并的节点如：
             * 1）_button
             * 2）_dialog
             * 3）_fatal
             * 4）_loading
             * 5）_logicals
             * 6）_placheholder
             */
        const $keys = Immutable.fromJS([
            "_button", "_dialog", "_fatal",
            "_loading", "_logicals", "_placeholder"
        ]);
        Object.keys(metadata)
            .filter(key => !$keys.contains(key))
            .filter(key => !!metadata[key])
            .forEach(key => {
                if (!original[key]) {
                    original[key] = {}
                }
                Object.assign(original[key], metadata[key]);
            });
    }
};
export default {
    toMerge
}