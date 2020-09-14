import React from 'react';
import { Store } from 'redux';
import { IApplicationState } from 'redux-types';
import './VPlotsTab.scss';

interface Props {
    store: Store<IApplicationState>;
}

const VPlotsTab = (props: Props) => {
    return (
        <div className="v-plots-wrapper">
            <iframe
                title="vplots"
                className="v-plots-iframe"
                src="http://diascld32.iccluster.epfl.ch:3003"
            />
        </div>
    );
};

export default VPlotsTab;
