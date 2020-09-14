import memoize from 'memoize-one';
import React from 'react';
import { connect } from 'react-redux';
import { Store } from 'redux';
import { IApplicationState } from 'redux-types';
import GraphSVG from './graph-svg';
import { hierarchy, interpolateCool } from 'd3';
import CustomHierarchyNode from 'types/CustomHierarchyNode';
import { assignRadius, colorHierarchy } from 'tools/hierarchy-preprocessing';

interface IGraphQueryWrapperProps {
    store: Store<IApplicationState>;
    entityResolutionThreshold: number;
    maxHierarchyDepth: number;
}

interface IGraphQueryWrapperState {
    rootNode?: CustomHierarchyNode;
}

class GraphQueryWrapper extends React.Component<
    IGraphQueryWrapperProps,
    IGraphQueryWrapperState
> {
    // Set the output activations when new entityResolutionThreshold is received as props
    private constructGraph = memoize(
        (entityResolutionThreshold: number, maxHierarchyDepth: number) => {
            fetch('http://diascld32.iccluster.epfl.ch:3001/graph', {
                body: JSON.stringify({
                    entity_resolution_threshold: entityResolutionThreshold,
                    max_hierarchy_depth: maxHierarchyDepth,
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            })
                .then(jsonResponse => {
                    return jsonResponse.json();
                })
                .then(json => {
                    const rootNode = hierarchy(json).sum(
                        d => d.count
                    ) as CustomHierarchyNode;

                    colorHierarchy(rootNode, interpolateCool);
                    assignRadius(rootNode);

                    console.log('Received hierarchical graph:', rootNode);

                    this.setState({
                        rootNode,
                    });
                });
        }
    );

    constructor(props: IGraphQueryWrapperProps) {
        super(props);

        this.state = {
            rootNode: undefined,
        };
    }

    public componentDidMount(): void {
        const { entityResolutionThreshold, maxHierarchyDepth } = this.props;

        this.constructGraph(entityResolutionThreshold, maxHierarchyDepth);
    }

    public componentDidUpdate() {
        const { entityResolutionThreshold, maxHierarchyDepth } = this.props;

        this.constructGraph(entityResolutionThreshold, maxHierarchyDepth);
    }

    public render() {
        return <GraphSVG rootNode={this.state.rootNode} />;
    }
}

const mapStateToProps = ({ hinParametersState }: IApplicationState) => ({
    entityResolutionThreshold: hinParametersState.entityResolutionThreshold,
    maxHierarchyDepth: hinParametersState.maxHierarchyDepth,
});

export default connect(mapStateToProps, null)(GraphQueryWrapper);
