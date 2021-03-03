import Ux from 'ux';

export default {
    mock: true,
    processor: (response = {}, request = {}) => {
        return Promise.resolve({
            ...request,
            password: Ux.randomString(8),
        })
    },
    data: {}
}