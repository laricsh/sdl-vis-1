import { cloneDeep } from 'lodash';
import { useContext, useState } from 'react';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { IRestResponse, RestClient } from 'typed-rest-client/RestClient';
import useAsynchronousEffect from '../../../types/useAsynchronousEffect';
import SimilaritySearchContext from './Context';
import { Node, WeightedEdge } from './Projection/ProjectionSVG';
import { ProjectionAlgorithm } from './ProjectionParameters';
import { defaultProjectionParameters } from './Provider';
import {
    permuteSearchParameterWeight,
    SearchParameterName,
    SearchParameters,
    VaryingSearchParameters,
} from './SearchParameters';

export type SimilaritySearchStates = {
    [attribute in SearchParameterName]: VaryingSimilarityGraphs
} & {
    current: SimilarityGraph;
};

export interface SimilarityGraph {
    adjMat: WeightedEdge[],
    points: Node[]
}

interface VaryingResponses {
    decreased?: Promise<IRestResponse<[SimilarityGraph]>>,
    increased?: Promise<IRestResponse<[SimilarityGraph]>>
}

export interface VaryingSimilarityGraphs {
    decreased?: SimilarityGraph,
    increased?: SimilarityGraph
}

const endpoint = '/simsearch';
const host = 'http://diascld32.iccluster.epfl.ch:3001';
const userAgent = 'frontend';
const client = new RestClient(userAgent, host);

const useSimilaritySearch = () => {
    const [similaritySearchStates, setSimilaritySearchStates] = useState<SimilaritySearchStates>();
    const { projectionParameters, searchParameters, setIsLoading } = useContext(SimilaritySearchContext);

    useAsynchronousEffect(async () => {
        if (!projectionParameters || !searchParameters) return;

        setIsLoading(true);

        const requestParameters: {
            attributes: SearchParameters | VaryingSearchParameters,
            projection: {
                type: ProjectionAlgorithm,
                k?: number,
                epsilon?: number,
                maxIter?: number
            }
        } = {
            attributes: searchParameters,
            projection: {
                type: projectionParameters.algorithm,
            },
        };

        if (projectionParameters.algorithm === ProjectionAlgorithm.MDS) {
            requestParameters.projection.epsilon = projectionParameters.epsilon === undefined ?
                defaultProjectionParameters.epsilon : projectionParameters.epsilon;
            requestParameters.projection.maxIter = projectionParameters.maximumIterations === undefined ?
                defaultProjectionParameters.maximumIterations : projectionParameters.maximumIterations;
        }

        const newSimilaritySearchStates = {} as unknown as SimilaritySearchStates;
        const responses: (Promise<IRestResponse<[SimilarityGraph]>> | Promise<undefined>)[] = [];
        const permutedParameters: (SearchParameterName | undefined)[] = [];

        Array.from(permuteSearchParameterWeight(searchParameters)).forEach(([permutedParameter, searchParametersPermutation]) => {
            if (permutedParameter === undefined) {
                requestParameters.attributes = searchParametersPermutation;

                responses.push(client.create<[SimilarityGraph]>(endpoint, requestParameters));
                permutedParameters.push(permutedParameter);
            } else {
                const requests: VaryingResponses = {
                    decreased: undefined,
                    increased: undefined,
                };
                const varyingSearchParameters = searchParametersPermutation as VaryingSearchParameters;

                newSimilaritySearchStates[permutedParameter] = {
                    decreased: undefined,
                    increased: undefined,
                };

                if (varyingSearchParameters.decreased) {
                    const decreasedRequestParameters = cloneDeep(requestParameters);

                    decreasedRequestParameters.attributes = varyingSearchParameters.decreased;
                    requests.decreased = client.create<[SimilarityGraph]>(endpoint, decreasedRequestParameters);
                }

                if (varyingSearchParameters.increased) {
                    const increasedRequestParameters = cloneDeep(requestParameters);

                    increasedRequestParameters.attributes = varyingSearchParameters.increased;
                    requests.increased = client.create<[SimilarityGraph]>(endpoint, increasedRequestParameters);
                }

                const immediatelyResolvedPromise: Promise<undefined> = new Promise(resolve => resolve(undefined));

                responses.push(requests.decreased ? requests.decreased : immediatelyResolvedPromise);
                permutedParameters.push(permutedParameter);
                responses.push(requests.increased ? requests.increased : immediatelyResolvedPromise);
                permutedParameters.push(permutedParameter);
            }
        });

        /*
         * I abuse the circumstance that `Promise.all` preserves the order of the iterable `responses`. With that, I
         * know that the first response (i.e., `index === 0`) corresponds to the original parameters, while all
         * subsequent pairs of two responses belong to the parameter listed in `permutedParameters` with the same index.
         * For each pair, the request with decreased parameters appears before the one with increased parameters.
         */
        (await Promise.all(responses)).forEach((response, index) => {
            if (response && response.statusCode === HttpCodes.OK && response.result) {
                if (index === 0) {
                    newSimilaritySearchStates.current = response.result[0];
                } else if (index % 2 === 1) {
                    newSimilaritySearchStates[permutedParameters[index]!].decreased = response.result[0];
                } else {
                    newSimilaritySearchStates[permutedParameters[index]!].increased = response.result[0];
                }
            }
        });

        setSimilaritySearchStates(newSimilaritySearchStates);
        setIsLoading(false);
    }, [projectionParameters, searchParameters]);

    return similaritySearchStates;
};

export default useSimilaritySearch;
