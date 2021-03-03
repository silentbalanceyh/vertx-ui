import {Dsl} from 'entity';
import {Of} from 'app';
import table from './Op.Table';

const yiPage = (reference) => {
    const state = {};
    Dsl.of(reference).bind(Of.apiTagTree).ok(response => {
        state.$ready = true;
        /*
         * 读取分类信息
         */
        state.$treeArray = response;
        reference.setState(state);
    }).async({});
}
export default {
    yiPage,
    ...table,
}