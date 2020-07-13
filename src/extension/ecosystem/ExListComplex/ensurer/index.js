import verifyNode from './E.node';
import verifyQuery from './E.query';

const verify = (reference, config = {}) => {
    let error = verifyNode(config);                 /* SPC-01 检查 */
    if (!error) error = verifyQuery(config);        /* SPC-02 检查 */
    return error;
};
export default {
    verify
}