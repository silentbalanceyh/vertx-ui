import Ux from 'ux';

export default {
    /* /app/name/:name */
    app: () => Ux.ajaxFetch("/app/name/:name", {name: Ux['Env']['APP']}),
    /* /app/menus */

}