import Ux from 'ux';
import ImgPhoto from './image/user.png';

const yiAccount = (reference) => {
    const state = {};
    const user = Ux.isLogged();
    const config = Ux.fromHoc(reference, "account");
    /* 解决无内容的Bug */
    if (!user.icon) user.icon = `image:${ImgPhoto}`;
    /* 显示专用bug */
    const empty = Ux.fromHoc(reference, "empty");
    if (!user.workNumber) user.workNumber = empty;
    if (!user.workTitle) user.workTitle = empty;
    if (!user.workLocation) user.workLocation = empty;
    const data = Ux.formatTpl(user, config);
    state.$data = Ux.clone(data);
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiAccount
}