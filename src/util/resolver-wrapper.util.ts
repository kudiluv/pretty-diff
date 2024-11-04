import { ArrayChange, Change, Resolver, ResolverArray } from '../types';

/**
 * Util for compare object by many resolvers
 */
export function ResolverWrapper<T>(resolvers: (Resolver<T> | ResolverArray<T>)[]) {
    return async (prev?: T, current?: T): Promise<(Change | ArrayChange)[]> => {
        const changes = await Promise.all(resolvers.map((resolver) => resolver(prev, current)));
        const flattedChanges = changes.flat(1);

        return flattedChanges.filter((change) => change !== null) as (Change | ArrayChange)[];
    };
}
