import Ut from '../../unity';

export default (expression) => {
    const user = Ut.isLogged();
    if (expression) {
        return user[expression];
    } else {
        return null;
    }
}