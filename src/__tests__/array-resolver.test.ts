import { SingleResolver } from '../resolvers';
import { ArrayResolver } from '../resolvers/array.resolver';
import { ArrayChange } from '../types';

describe('ArrayResolver', () => {
    it('should return NULL for equal arrays', async () => {
        const prev = [1, 2, 3];
        const current = [1, 2, 3];
        const resolver = ArrayResolver<number[], number>(
            'test',
            (value) => value ?? [],
            (value) => value,
            (value) => value?.toString() ?? 'unknown',
            [SingleResolver('test', (value) => value)],
        );

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return changes for not equal arrays', async () => {
        const prev = [
            { id: 1, label: 'first', value: 'test1' },
            { id: 2, label: 'second', value: 'test2' },
            { id: 3, label: 'third', value: 'test3' },
        ];
        const current: typeof prev = [
            { id: 3, label: 'third', value: 'test3-changed' },
            { id: 2, label: 'second', value: 'test2-changed' },
            { id: 1, label: 'first', value: 'test1-changed' },
        ];

        const resolver = ArrayResolver<typeof prev, (typeof prev)[0]>(
            'array-changes',
            (value) => value ?? [],
            (value) => value.id,
            (value) => value?.label ?? 'unknown label',
            [SingleResolver('value', (context) => context?.item?.value)],
        );

        expect(await resolver(prev, current)).toEqual({
            name: 'array-changes',
            isArray: true,
            subChanges: [
                {
                    name: 'first',
                    subChanges: [
                        {
                            name: 'value',
                            old: 'test1',
                            new: 'test1-changed',
                            subChanges: [],
                        },
                    ],
                    isArrayItem: true,
                    isRemovedArrayItem: false,
                    isNewArrayItem: false,
                    isUpdatedArrayItem: true,
                },
                {
                    name: 'second',
                    subChanges: [
                        {
                            name: 'value',
                            old: 'test2',
                            new: 'test2-changed',
                            subChanges: [],
                        },
                    ],
                    isArrayItem: true,
                    isRemovedArrayItem: false,
                    isNewArrayItem: false,
                    isUpdatedArrayItem: true,
                },
                {
                    name: 'third',
                    subChanges: [
                        {
                            name: 'value',
                            old: 'test3',
                            new: 'test3-changed',
                            subChanges: [],
                        },
                    ],
                    isArrayItem: true,
                    isRemovedArrayItem: false,
                    isNewArrayItem: false,
                    isUpdatedArrayItem: true,
                },
            ],
        } as ArrayChange);
    });

    it('should return change for removed array item', async () => {
        const prev = [{ id: 1, label: 'first' }];
        const current: typeof prev = [];

        const resolver = ArrayResolver<typeof prev, (typeof prev)[0]>(
            'array-changes',
            (value) => value ?? [],
            (value) => value.id,
            (value) => value?.label ?? 'unknown label',
            [],
        );

        expect(await resolver(prev, current)).toEqual({
            name: 'array-changes',
            isArray: true,
            subChanges: [
                {
                    name: 'first',
                    subChanges: [],
                    isArrayItem: true,
                    isRemovedArrayItem: true,
                    isNewArrayItem: false,
                    isUpdatedArrayItem: false,
                },
            ],
        } as ArrayChange);
    });

    it('should return change for new array item', async () => {
        const current = [{ id: 1, label: 'first' }];
        const prev: typeof current = [];

        const resolver = ArrayResolver<typeof prev, (typeof prev)[0]>(
            'array-changes',
            (value) => value ?? [],
            (value) => value.id,
            (value) => value?.label ?? 'unknown label',
            [],
        );

        expect(await resolver(prev, current)).toEqual({
            name: 'array-changes',
            isArray: true,
            subChanges: [
                {
                    name: 'first',
                    subChanges: [],
                    isArrayItem: true,
                    isRemovedArrayItem: false,
                    isNewArrayItem: true,
                    isUpdatedArrayItem: false,
                },
            ],
        } as ArrayChange);
    });
});
