import isEqual from 'lodash.isequal';
import { Change, Resolver } from '../types';

/**
 * Util for deep compare two objects
 */
export function SingleResolver<T>(name: string, compareBy: (value?: T) => Promise<unknown> | unknown): Resolver<T> {
    return async (prev?: T, current?: T): Promise<Change | null> => {
        const prevValue = await compareBy(prev);
        const currentValue = await compareBy(current);

        if (isEqual(prevValue, currentValue)) {
            return null;
        }

        return {
            name,
            old: prevValue,
            new: currentValue,
            subChanges: [],
        };
    };
}
