import R from '../../rule';

export default {
    mock: true,
    processor: (response, request) =>
        R.group.create(request)
}
