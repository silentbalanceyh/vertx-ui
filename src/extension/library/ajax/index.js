import application from './application';
import oauth from './oauth';
import form from './form';
import employee from './employee';
import datum from './datum';
import ui from './ui';

export default {
    ...application,
    ...oauth,
    ...form,
    ...employee,
    ...datum,
    ...ui,
}