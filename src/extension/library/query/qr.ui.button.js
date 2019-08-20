import Ux from 'ux';
import renderJsx from './qr.web.button';

export default () => ({
    $button: (cell, reference) => {
        const ref = Ux.fix(cell, reference);
        const button = Ux.fromHoc(reference, "button");
        return renderJsx(ref, button ? button : {});
    }
})