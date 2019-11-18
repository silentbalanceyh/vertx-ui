import Ux from 'ux';

export default (reference, state = {}) => {
    /*
     * Assist 专用数据
     */
    const assist = Ux.fromHoc(reference, "assist");
    /*
     * keys / promise
     */
    if (assist) {
        return Ux.asyncAssist(assist, reference, state);
    } else return Ux.promise(state);
}