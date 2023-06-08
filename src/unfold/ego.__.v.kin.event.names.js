import Ux from 'ux';
import __Zn from './zero.module.dependency';

const fnDelete = (id, record, metadata = {}) => {
    const {reference} = metadata;
    // $loading = true
    Ux.of(reference).spinning().future(() => {
        // rxDelete 记录
        const rxDelete = __Zn.rxDelete(reference);
        rxDelete(id, () => {
            // 删除之后执行加载
            Ux.of(reference).loading().done();
        })
    })
}

const fnEdit = (id, record, metadata = {}) => {
    const {reference} = metadata;
    // $loading = true
    Ux.of(reference).spinning().future(() => {
        // rxView -> 读取记录
        const rxView = __Zn.rxView(reference);
        return rxView(id, record);
    }).then(queried => {
        // rxOpen -> 打开 Tab 页
        const rxOpen = __Zn.rxTabOpen(reference);
        rxOpen(id, queried, record);
        // $loading = false
        Ux.of(reference).spun().done();
    })
}

export default {
    fnDelete,
    fnEdit,
}