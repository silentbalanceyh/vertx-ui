import Ux from 'ux';
import Cv from "../O.fn.constant";
import U from "underscore";

const _typeMapping = (input) => {
    const mapping = {"1": "data", "2": "action", "4": "relation"};
    return mapping[input] ? mapping[input] : input;
}
const _convert = (input, converted = []) => {
    if (!U.isArray(input)) {
        return input;
    }
    input.forEach(item => {
        const data = {};
        data['id'] = item['id'];
        data['label'] = item['name'];
        data['data'] = {"type": _typeMapping(item['type'])};
        if (item.hasOwnProperty('children') && item['children'].length > 0) {
            data['children'] = [];
            _convert(item['children'], data['children']);
        }
        converted.push(data);
    })
}

export default () => {
    // API：读取租户信息
    const user = Ux.isLogged();
    const companyCode = user['companyCode'];
    const result = {};
    return Ux.ajaxGet("/DataAsset/account/account-object-count/:companyCode", {companyCode}, Cv.OPTIONS)
        // 整理数据模型概览数据
        .then(response => {
            const count = response.count;
            result['count'] = count['Account'];
            result['relations'] = count['Attribute'];
            result['actions'] = count['Behavior'];
            return Ux.promise(result);
        })
        // 继续读取图关系
        .then(response => {
            return Ux.ajaxGet("/DataAsset/account/object-relationship/:companyCode", {companyCode}, Cv.OPTIONS)
                // 整理关联数据
                .then(response => {
                    const normalized = [];
                    _convert(U.isArray(response) ? response : [response], normalized);
                    result['graph'] = normalized;
                    return Ux.promise(result);
                })
        });
}