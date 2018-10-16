import Ux from 'ux';
import {message} from 'antd';

const on2Before = (reference) => (file) => {
    // 如果通过的情况
    const {config = {}} = reference.props;
    const error = Ux.fromHoc(reference, "error");
    // 1.单文件限制上传
    let verified = true;
    if (config.single) {
        const {$counter = 0} = reference.state;
        if (0 < $counter) {
            message.error(error.single);
            verified = false;
        }
    }
    // 2.文件大小限制
    if (verified && config.limit) {
        const current = file.size / 1024;
        if (current > config.limit) {
            message.error(Ux.formatExpr(error.limit, {
                size: config.limit,
                current: current.toFixed(2)
            }));
            verified = false;
        }
    }
    return verified ? Promise.resolve(file) : Promise.reject();
};
export default {
    on2Before
}