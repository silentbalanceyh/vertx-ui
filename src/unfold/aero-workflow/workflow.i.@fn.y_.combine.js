import _Y_ACL from './workflow.channel.__.@fn.y_.acl';
import _Y_QUEUE from './workflow.channel.__.@fn.y_.queue';
import _Y_FORM from './workflow.channel.__.@fn.y_.form';

export default (reference) => ({
    ..._Y_ACL(reference),
    ..._Y_QUEUE(reference),
    ..._Y_FORM(reference),
})