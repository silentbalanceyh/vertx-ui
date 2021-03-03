import React from 'react';
import Ux from 'ux';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const title = Ux.fromHoc(this, "title")
        return (
            <div>
                <dl>
                    <dt>{title.banner}</dt>
                    <dd>
                        <ul>
                            {title.description.map(each => <li key={Ux.randomUUID()}>{each}</li>)}
                        </ul>
                    </dd>
                </dl>
            </div>
        );
    }
}

export default Component