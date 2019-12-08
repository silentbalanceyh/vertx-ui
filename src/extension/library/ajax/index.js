import application from './application';
import oauth from './oauth';
import form from './form';
import employee from './employee';
import datum from './datum';
import ui from './ui';
import todo from './todo';
import job from './job';
import relation from './relation';

export default {
    ...application,
    ...oauth,
    ...form,
    ...employee,
    ...datum,
    ...ui,
    ...todo,
    ...job,
    ...relation
}