### 1.说明

最后针对Redux绑定的Types和Action（Epic）进行说明一下，该函数最终会反应在rxSearch函数中。

#### 1.1.Types定义

```js
import Ux from "ux";

export default {
    fnDeptList: Ux.createAction("/RX/MODULE/DEPT/SEARCH"),
    // ....
}
```

* Zero框架中，创建Action建议使用`Ux.createAction`方式创建，会生成和环境绑定的前缀：
    * 方便开发人员调试，日志前缀会和其他的不同；
    * 不同的应用前缀不同，那么不会出现同一个浏览器访问不同Zero应用的冲突；
* 命名规则统一使用`/RX/`前缀，全大写。

#### 1.2.Epic定义

```js
import Ux from "ux";
import Types from "./Types";
import Mock from './mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/list/search", params, Mock.fnDeptList),
        Ux.rxGrid
    )
    // ......
};
```

这里不解释`Ux.rxEdict`和`Ux.ajaxPost`以及`Ux.rxGrid`的作用，详细内容可参考本教程的基础部分

#### 1.3. Mock数据

```json
{
    "mock": true,
    "data": {
        "list": [
            {
                "key": "a026300e-2879-4ba4-9407-337e1c4430d7",
                "code": "QOOXVZ",
                "name": "内论土部",
                "description": "达叫技马积果市亲儿与管日克红车任。业团叫话主养证天期是织统才。制便设局题民业象再达交科加但次。周直斯相离何还看非易儿且放各在日。",
                "manager": "袁敏",
                "active": false,
                "enterprise_id": "49640202-f767-4e46-b892-34b511d9f50f",
                "created_by": "system",
                "created_date": "2018-08-01T04:07:44.669Z",
                "last_modified_by": "system",
                "last_modified_date": "2018-08-01T04:07:44.669Z"
            }
        ],
        "count":22
    }
}
```