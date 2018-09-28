### 1.说明

`DynamicDialog`主要对Modal实现了浅层封装，主要目的是和属性连接器进行连接，这里需要
说明的是DynamicDialog对应的优先级问题。

1. 如果它接收到`$dialog`属性，则解析该属性；
    * 如果`$dialog`属性为String类型，则触发`aiExprWindow`解析器；
    * 如果`$dialog`属性为Object类型，直接使用；
2. `$visible`属性优先于`$dialog`中的`visible`属性；
3. `$dialog`中的`onOk`和`onCancel`优先于传入的`rxOk`和`rxCancel`；

### 2.代码

```js
    import React from 'react'
    import {DynamicDialog, PageCard} from "web";
    import Ux from 'ux'
    import {Button, Col, Row} from 'antd';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require("./Cab"))
        .cab("UI.Demo")
        .state({})
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            const configuration = Ux.fromHoc(this, "configuration");
            const fnOk = (item) => (event) => {
                event.preventDefault();
                const state = {};
                state[item.state] = true;
                this.setState(state);
            };
            const fnCancel = (item) => (event) => {
                event.preventDefault();
                const state = {};
                state[item.state] = false;
                this.setState(state);
            };
            return (
                <PageCard reference={this}>
                    <Row>
                        {configuration.map(item => (
                            <Col key={Ux.randomUUID()} span={item.span}>
                                <Button onClick={fnOk(item)}>{item.button}</Button>
                                <DynamicDialog $dialog={item.window}
                                               rxCancel={fnCancel(item)}
                                               rxOk={fnCancel(item)}
                                               $visible={this.state[item.state]}>
                                    {item.button}
                                </DynamicDialog>
                            </Col>
                        ))}
                    </Row>
                </PageCard>
            )
        }
    }

    export default Component
```