import { Change } from './changes.type';

export type Resolver<T> = (prev?: T, current?: T) => Promise<Change | null>;
export type ResolverArray<T> = (prev?: T, current?: T) => Promise<Change[] | null>;
