### 1.说明

`LoadingContent`使用了Ant Design中的Spin组件，但不同的是，它以实用性为主，避免掉
多余或不需要用的部分，这一点Ant Design中的Spin组件的缺陷在于：官方的例子大部分都是介绍
了Spin组件的各种不同的用途，主要在使用过程中没有居中，一旦居中时还需要外层容器。所以
Zero在项目中仅针对实用部分进行了抽取：8/2法则。

不仅如此，在处理Loading效果时，目前的版本仅仅提供不带子组件的`LoadingContent`，
后续版本会逐渐提供类似`LoadingContainer`的核心组件用于盛放子组件。

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux'
    import {LoadingContent, PageCard} from "web";
    import {Col, Row} from 'antd';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require("./Cab"))
        .cab("UI.Demo")
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            const loading = Ux.fromHoc(this, "_configuration");
            return (
                <PageCard reference={this}>
                    <Row>
                        {loading.map(item => {
                            const {span, attrs = {}} = item;
                            return (
                                <Col key={Ux.randomUUID()} span={span}>
                                    <LoadingContent {...attrs}/>
                                </Col>
                            )
                        })}
                    </Row>
                </PageCard>
            )
        }
    }

    export default Component;
```