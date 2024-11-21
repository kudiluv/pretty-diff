import isEqual from 'lodash.isequal';
import { Change, Resolver } from '../types';

/**
 * Util for deep compare two objects
 */
export function SingleResolver<T>({
    name,
    compareBy,
    transformForView,
}: {
    name: string | ((value?: T) => Promise<string> | string);
    compareBy?: (value?: T) => Promise<unknown> | unknown;
    transformForView?: (value?: T) => Promise<unknown> | unknown;
}): Resolver<T> {
    return async (prev?: T, current?: T): Promise<Change | null> => {
        const prevValue = compareBy ? await compareBy(prev) : prev;
        const currentValue = compareBy ? await compareBy(current) : current;

        if (isEqual(prevValue, currentValue)) {
            return null;
        }

        return {
            name: typeof name === 'string' ? name : await name(current),
            old: prevValue,
            new: currentValue,
            oldForView: transformForView ? await transformForView(prev) : undefined,
            newForView: transformForView ? await transformForView(current) : undefined,
            subChanges: [],
        };
    };
}
