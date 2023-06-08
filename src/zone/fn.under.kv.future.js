const kvQuery = (url) => {
    const obj = {};
    url.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            obj[$1] = $3;
        }
    );
    return obj;
}
export default {
    kvQuery,
}