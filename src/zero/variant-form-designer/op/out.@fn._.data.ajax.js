import __Zn from '../zero.uca.dependency';

export default (normalized = {}, params = {}) => {
    /*
     * ajax 部分
     */
    if (params.ajaxUri) {
        const ajax = {};
        ajax.uri = params.ajaxUri;
        if (params.ajaxMethod) {
            ajax.method = params.ajaxMethod;
        } else {
            ajax.method = "GET";    // 默认使用 GET 方法
        }
        if (params.hasOwnProperty('ajaxPageSize')) {
            // 参数处理
            const $params = {
                pager: {
                    page: 1,
                },
                sorter: []
            };
            if (params.ajaxPageSize) {
                $params.pager.size = params.ajaxPageSize;
            }
            if (__Zn.isArray(params.ajaxSort) && 0 < params.ajaxSort.length) {
                params.ajaxSort.forEach(sort => {
                    if (sort.field) {
                        let sortField = sort.field;
                        if (sort.isAsc) {
                            sortField += `,${sort.isAsc}`;
                        } else {
                            sortField += `,ASC`;
                        }
                        $params.sorter.push(sortField);
                    }
                })
            }
            if (params.ajaxMagic) {
                $params.criteria = params.ajaxMagic;
            } else {
                $params.criteria = {};
            }
            ajax.params = $params;
            normalized.optionJsx.config.ajax = ajax;
        } else {
            const $params = {};
            if (params.ajaxMagic) {
                $params.criteria = params.ajaxMagic;
            } else {
                $params.criteria = {};
            }
            ajax.magic = $params;
            normalized.optionJsx.config.ajax = ajax;
        }
    }
}