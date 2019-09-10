import abs from './abyss';
import ajax from './ajax';
import constant from './constant';
import develop from './develop';
import element from './element';
import engine from './engine';
import entity from './entity';
import unity from './unity';
import graphic from './graphic';
import xweb from './xweb';

import E from './error';
import reportUx from './Ux.Report';
/*
 * 内部Debug专用
 */

const exported = {
    ...abs,
    ...ajax,
    ...develop,
    ...element,
    ...engine,
    ...entity,
    /*
     * 对象部分
     */
    ...unity,
    ...graphic,
    ...xweb,
    Env: {
        ...constant,
    },
    E,
};
console.groupCollapsed("Report Debug");
console.info(abs);
console.info(ajax);
console.info(develop);
console.info(element);
console.info(engine);
console.info(entity);
console.info(unity);
console.info(graphic);
console.info(E);
console.warn(exported);
console.groupEnd();
reportUx();
export default exported;

