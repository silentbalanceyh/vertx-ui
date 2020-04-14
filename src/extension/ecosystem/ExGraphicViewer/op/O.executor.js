import Ux from 'ux';
import {Dsl} from 'entity';

const onNodeDoubleClick = (gEvent) => (event = {}) => {
    const reference = gEvent.reference();
    const {$event = {}} = reference.props;
    const {item} = event;
    if (item) {
        const model = Ux.g6GetNode(item);
        const {executor = {}} = $event;
        if (!Ux.isEmpty(executor) && Ux.isFunction(executor.onNodeDoubleClick)) {
            /* 构造 DataEvent */
            const dataEvent = Dsl.getEvent()
                .start(model);
            /* 执行 dataEvent */
            executor.onNodeDoubleClick(dataEvent, gEvent);
        } else {
            Ux.dgDebug({
                executor,
                name: "onNodeDoubleClick"
            }, "执行器未找到合适的", "#EEAD0E");
        }
    }
}
export default {
    /* 双击完成后的操作 */
    onNodeDoubleClick,
}