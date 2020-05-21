import Ux from 'ux';
import Ex from 'ex';

const _modelInit = (state = {}, identifier) => {
    /*
     * 状态中读取模型
     */
    const {$stored = {}} = state;
    if (Ux.isArray($stored[identifier]) && 0 < $stored[identifier].length) {
        /*
         * 直接返回存储好的
         */
        return Ux.promise($stored[identifier]);
    } else {
        /*
         * 否则远程读取
         */
        return Ex.I.attributes(identifier).then((remote) => {
            /*
             * 存储
             */
            $stored[identifier] = remote;
            state.$stored = $stored;
            return Ux.promise($stored);
        });
    }
}
export default {
    onStore: (reference) => ({
        init: (identifier) => _modelInit(reference.state, identifier)
    })
}