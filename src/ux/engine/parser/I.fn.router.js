export default (value, {props}) => {
    const attr = value[0];
    if (attr) {
        const {$router} = props;
        if ($router) {
            return $router._(attr);
        }
    }
}