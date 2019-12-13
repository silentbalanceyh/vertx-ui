import Ut from '../../unity';
import Abs from '../../abyss';

export default (expression) => {
    const user = Ut.isLogged();
    if (expression) {
        if (0 < expression.indexOf('.')) {
            const path = expression.split('.');
            const $user = Abs.immutable(user);
            return $user.getIn(path);
        } else {
            return user[expression];
        }
    } else {
        return null;
    }
}