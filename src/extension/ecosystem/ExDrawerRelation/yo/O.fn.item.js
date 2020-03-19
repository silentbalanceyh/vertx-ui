import Ux from 'ux';
import Cv from './O.constant';

export default (reference) => {
    const {$items = []} = reference.props;
    const normalized = [];
    $items.forEach(item => {
        const each = {item: {}};
        each.item.key = item.key;
        each.item.className = `item item-${item.level}`;
        each.item.model = {
            shape: Cv.SHAPE,
            size: Cv.SIZE,
            data: Ux.clone(item.data)
        };
        each.text = item.text;
        each.img = {
            src: item.image,
            width: Cv.SIZE_IMG,
            height: Cv.SIZE_IMG,
            draggable: true
        };
        const {data, ...rest} = item;
        each.data = Ux.clone(data);
        each.meta = rest;
        normalized.push(each);
    });
    return normalized;
}