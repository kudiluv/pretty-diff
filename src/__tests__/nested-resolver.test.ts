import { NestedResolver, SingleResolver } from '../resolvers';

describe('NestedResolver', () => {
    it('should return subChanges', async () => {
        const prev = 'prev';
        const current = 'current';

        const result = await NestedResolver<string>('test', [
            SingleResolver({ name: 'first-resolve' }),
            SingleResolver({ name: 'second-resolve' }),
        ])(prev, current);

        expect(result).toEqual({
            name: 'test',
            subChanges: [
                {
                    name: 'first-resolve',
                    old: prev,
                    new: current,
                    subChanges: [],
                },
                {
                    name: 'second-resolve',
                    old: prev,
                    new: current,
                    subChanges: [],
                },
            ],
        });
    });

    it('should return NULL for equal objects', async () => {
        const prev = { a: 1, b: 'test' };
        const current = { a: 1, b: 'test' };
        const result = await NestedResolver<typeof prev>('test', [
            SingleResolver({ name: 'first-resolve' }),
            SingleResolver({ name: 'second-resolve' }),
        ])(prev, current);

        expect(result).toBeNull();
    });
});
