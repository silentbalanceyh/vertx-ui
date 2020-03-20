import Ux from 'ux';
import Ex from 'ex';
import yiGraphic from './O.fn.graphic';
import yiInitialize from './O.fn.initialize';
import Cv from "./O.constant";

export default (reference) => {
    const state = {};

    /* 关系窗口 */
    const window = Ux.fromHoc(reference, "window");
    state.$dialog = Ux.configDialog(reference, window);

    /* 图处配置信息 */
    state.$graphic = yiGraphic(reference);
    /* 原始数据信息 */
    const {data = {}} = reference.props;

    /*
     *  先规范化原始数据
     *  原始数据是 category
     **/
    let {config = {}} = reference.props;
    Object.assign(config, {
        model: {
            shape: Cv.NODE_SHAPE,
            size: Cv.SIZE,
        },
        image: {
            width: Cv.SIZE_IMG,
            height: Cv.SIZE_IMG,
        }
    });
    state.$config = config;
    state.$items = Ex.g6ElementItems(data, config);
    yiInitialize(state, reference).then(state => {
        state.$ready = true;
        reference.setState(state);
    })
}