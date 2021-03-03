export default (reference) => {
    const {$app} = reference.props;
    if ($app.is()) {
        const options = $app._("options");
        if (options && options.hasOwnProperty('lifecycle')) {
            return options.lifecycle;
        } else {
            return false;
        }
    } else {
        return false;
    }
}