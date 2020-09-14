import React from 'react';
import { Store } from 'redux';
import { IApplicationState } from 'redux-types';
import './ProfilingTab.scss';

interface Props {
    store: Store<IApplicationState>;
}

const ProfilingTab = (props: Props) => {
    return (
        <div className="profiling-wrapper">
            <iframe
                title="jupyterlab"
                className="jupyter-iframe"
                src="http://diascld32.iccluster.epfl.ch:3002"
            />
        </div>
    );
};

export default ProfilingTab;
