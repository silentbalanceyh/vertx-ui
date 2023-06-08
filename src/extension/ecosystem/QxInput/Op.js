import Ux from 'ux';

const dataQr = (reference, {keyword, match}) => {
    const {$keyword = []} = reference.state;   // 关键字
    const fields = [];
    if (match) {
        $keyword.forEach(field => fields.push(field))
    } else {
        $keyword.forEach(field => fields.push(`${field},c`))
    }
    if (keyword) {
        // 条件
        const condition = Ux.qrInput(fields, keyword);
        return {
            condition,
            keyword,
            match,
        }
    } else {
        // __DELETE__
        const condition = Ux.qrInput(fields, Ux.Env.CV_DELETE);
        return {
            condition,
            match,
        }
    }
}
const rxChange = (reference, refresh) => (event) => {
    Ux.prevent(event);
    const keyword = Ux.ambEvent(event);
    const {value = {}} = reference.props;
    const query = dataQr(reference, {
        keyword,
        match: value.match,
    });
    Ux.fn(reference).rxQr(query, refresh);
}
const rxMatch = (reference) => (event) => {
    const checked = Ux.ambEvent(event, {prevent: false, checked: true});
    const {value = {}} = reference.props;
    const query = dataQr(reference, {
        keyword: value.keyword,
        match: checked,
    })
    Ux.fn(reference).rxQr(query, false);
}
/*
 * value 格式：
 * {
 *     "input": "xxx",
 *     "match": true | false
 * }
 */
export default {
    rxChange,
    rxMatch,
}