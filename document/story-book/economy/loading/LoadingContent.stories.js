import React from 'react';

import {storiesOf} from '@storybook/react';
import {linkTo} from '@storybook/addon-links';
import {Welcome} from '@storybook/react/demo';
import {LoadingContent} from 'web';

storiesOf('Welcome', module).add('LoadingContent', () => <Welcome showApp={linkTo('LoadingContent')}/>);

storiesOf('LoadingContent', module)
    .add('with text', () => <div>Hello Button</div>);