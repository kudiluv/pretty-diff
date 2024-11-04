import { ArrayChange, Change, Resolver, ResolverArray } from '../types';
import { ResolverWrapper } from './resolver-wrapper.util';

/**
 * Util for change context your resolvers
 */
export function Context<T, S>(
    newContext: (value?: T) => Promise<S | undefined> | S | undefined,
    resolvers: Resolver<S>[] | ResolverArray<S>[],
) {
    return async (prev?: T, current?: T): Promise<(Change | ArrayChange)[]> => {
        const newPrev = await newContext(prev);
        const newCurrent = await newContext(current);

        return ResolverWrapper(resolvers)(newPrev, newCurrent);
    };
}
