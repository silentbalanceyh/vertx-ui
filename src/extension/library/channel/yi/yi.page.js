import yiDatum from './yi.datum';
import Ux from 'ux';

export default (reference) => {
    reference.setState({$ready: false});
    const input = Ux.clone(reference.state);
    return Ux.promise(input)
    /* 辅助数据处理 */.then(state => yiDatum(reference, state))
        .then(state => {
            state.$ready = true;
            reference.setState(state);
        })
}