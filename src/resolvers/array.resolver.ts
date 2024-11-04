import sortBy from 'lodash.sortby';
import { ArrayChange, ArrayChangeItem, Resolver, ResolverArray } from '../types';
import { ResolverWrapper } from '../util';
import _uniqBy from 'lodash.uniqby';
import isEqual from 'lodash.isequal';

/**
 * Util for compare arrays
 */
export function ArrayResolver<T, S>(
    name: string,
    arrayPath: (value?: T) => S[],
    uniqBy: (value: S, index?: number) => unknown,
    itemName: (value: S | undefined, index: number) => string,
    resolvers: Resolver<{ item?: S; main?: T }>[] | ResolverArray<{ item?: S; main?: T }>[],
) {
    return async (prev?: T, current?: T): Promise<ArrayChange | null> => {
        const prevItems = arrayPath(prev);
        const currentItems = arrayPath(current);

        const sortedPrevItems = sortBy(prevItems, uniqBy);
        const sortedCurrentItems = sortBy(currentItems, uniqBy);

        const uniqIds = _uniqBy([...prevItems, ...currentItems], uniqBy).map((item) => uniqBy(item));

        if (isEqual(sortedPrevItems, sortedCurrentItems)) {
            return null;
        }

        const subChanges: ArrayChangeItem[] = [];
        for (let index = 0; index < uniqIds.length; index++) {
            const prevItem = prevItems.find((item) => uniqBy(item) === uniqIds[index]);
            const currentItem = currentItems.find((item) => uniqBy(item) === uniqIds[index]);

            const itemSubChanges = await ResolverWrapper(resolvers)(
                { item: prevItem, main: prev },
                { item: currentItem, main: current },
            );

            const isUpdatedArrayItem = prevItem !== undefined && currentItem !== undefined;
            if (isUpdatedArrayItem && itemSubChanges.length === 0) {
                continue;
            }

            subChanges.push({
                name: itemName(prevItem || currentItem, index),
                isArrayItem: true,
                isNewArrayItem: prevItem === undefined,
                isRemovedArrayItem: currentItem === undefined,
                isUpdatedArrayItem: prevItem !== undefined && currentItem !== undefined,
                subChanges: itemSubChanges,
            });
        }

        if (subChanges.length === 0) {
            return null;
        }

        return {
            name,
            isArray: true,
            subChanges,
        };
    };
}
