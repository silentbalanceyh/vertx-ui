import Cmn from './I.common';

export default (expression, {props}) => Cmn.fnPredicate("ROUTE", expression, () => {
    const {$router} = props;
    if ($router) {
        return $router._(expression);
    }
});