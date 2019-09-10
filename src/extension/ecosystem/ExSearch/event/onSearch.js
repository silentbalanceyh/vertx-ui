import Ex from 'ex';
import Ux from 'ux';
import U from 'underscore';

export default (reference) => (searchText) => {
    const {config = {}} = reference.props;
    const cond = config[Ex.Opt.SEARCH_COND];
    if (U.isArray(cond)) {

        /*
         * 构造新的查询条件
         */
        let $filters = {};
        if (searchText) {
            $filters = Ux.qrInput(cond, searchText);
        }
        /*
         * 基础搜索
         */
        Ex.rx(reference).filter($filters);
    }
};