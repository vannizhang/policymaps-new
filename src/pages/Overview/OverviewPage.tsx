import * as React from 'react';

import { PageLayout, OverviewPageContents } from '../../components'

export default class OverviewPage extends React.PureComponent {

    render(){
        return (
            <PageLayout>
                <OverviewPageContents />
            </PageLayout>
        )
    }
};
