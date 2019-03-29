import User from './UI.User';
import Search from './UI.Query';
import Cluster from './UI.State';
import Api from './UI.Api';
import Bars from './UI.ListItem';
import App from './UI.App';
import Code from './UI.Env';
import Form from './UI.Form';
import Dialog from './UI.Dialog';
import Submit from './UI.Submit';
import SubmitSub from './UI.Submit.Item';

export default {
    "user": User,
    "filter": Search,
    "setting": App,
    "cluster": Cluster,
    "api": Api,
    "bars": Bars,
    "code": Code,
    "form": Form,
    "block": Dialog,
    "tags": Submit,
    "tag": SubmitSub
};