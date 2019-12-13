import fnPrepare from './O.fn.remove.prepare';
import Ex from 'ex';
import Ux from 'ux';

export default (reference, keys = [], key) => {
    const removedKeys = fnPrepare(reference, keys, key);
    if ("up" === key) {
        reference.setState({$loadingUp: true});
    } else {
        reference.setState({$loadingDown: true});
    }
    Ux.toLoading(() => Ex.I.relationDelete(removedKeys).then(data => {
        if (data) {
            const $keys = Ux.immutable(removedKeys);
            /*
             * 从 $data 的 up 和 down 中移除数据
             */
            let {$data = {}} = reference.state;
            $data = Ux.clone($data);
            if ("up" === key) {
                const array = Ux.isArray($data.up) ? $data.up : [];
                $data.up = array.filter(item => !$keys.contains(item.key));
            } else {
                const array = Ux.isArray($data.down) ? $data.down : [];
                $data.down = array.filter(item => !$keys.contains(item.key));
            }
            reference.setState({
                $data,
                $selectedUp: [], $loadingUp: false,
                $selectedDown: [], $loadingDown: false,
            })
        }
    }))
}
