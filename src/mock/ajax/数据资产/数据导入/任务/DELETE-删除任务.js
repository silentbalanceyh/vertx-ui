import Ux from "ux";

export default {
    mock: true,
    data: {},
    processor: (response, request) => {
        return Ux.promise(request);
    }
}