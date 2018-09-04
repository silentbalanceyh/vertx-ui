import React from 'react'
import Ux from 'ux'
import {PageCard} from 'web';
import ViewMarkdown from './UI.Markdown';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {
            children,
            config = [],
            $markdown = [],
            attributes = {},
        } = this.props;
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .mount("type", "card")
                    .to(
                        <div className={"demo-window"}>
                            {children}
                        </div>,
                        "Hello",
                        <ViewMarkdown key={"tabMarkdown"} $markdown={$markdown}/>
                    )}
            </PageCard>
        )
    }
}

export default Component