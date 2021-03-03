import Ux from 'ux';

export default {
    mock: true,
    data: {},
    processor: (response, params = {}) => Ux.promise({
        ...params,
        ...response
    })
}