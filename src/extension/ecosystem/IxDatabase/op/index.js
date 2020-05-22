import category from './O.fn.category';
import driverClassName from './Jsx.driver.class.name';

export default {
    onChange: (reference) => ({
        category: category(reference)
    }),
    renders: {
        driverClassName
    }
}