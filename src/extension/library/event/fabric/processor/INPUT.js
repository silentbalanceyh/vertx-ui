import Ux from 'ux';

export default {
    PROP: (params = []) => async (dataEvent) => {
        const ref = dataEvent.getRef();
        if (ref && ref.props) {
            const props = ref.props;
            const field = params[0];
            return Ux.valueFind(props, field.split('.'));
        } else {
            console.error("[ EvR ] 事件处理！", ref);
        }
    }
}