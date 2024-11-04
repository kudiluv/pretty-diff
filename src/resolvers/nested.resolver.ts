import { Change, Resolver, ResolverArray } from '../types';
import { ResolverWrapper } from '../util/resolver-wrapper.util';

/**
 * Util for add nested change response
 */
export function NestedResolver<T>(name: string, resolvers: (Resolver<T> | ResolverArray<T>)[]) {
    return async (prev?: T, current?: T): Promise<Change | null> => {
        const subChanges = await ResolverWrapper(resolvers)(prev, current);
        if (subChanges.length === 0) {
            return null;
        }

        return {
            name,
            subChanges: subChanges,
        };
    };
}
