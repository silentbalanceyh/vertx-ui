import Ux from "ux";

export default (reference, state = {}) => {
    /*
     * Assist 专用数据
     */
    const assist = Ux.fromHoc(reference, "assist");
    /*
     * keys / promise
     */
    if (assist) {
        /*
         * 第一选择
         */
        return Ux.asyncAssist(assist, reference, state);
    } else {
        const {config = {}} = reference.props;
        if (config.assist) {
            /*
             * 第二选择
             */
            return Ux.asyncAssist(config.assist, reference, state);
        } else return Ux.promise(state);
    }
}