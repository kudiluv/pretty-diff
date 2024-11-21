import { SingleResolver } from '../resolvers/single.resolver';
import { Change } from '../types';
import { ResolverWrapper } from '../util/resolver-wrapper.util';

describe('WrapperResolver', () => {
    it('should return empty array for equal objects', async () => {
        const prev = { test1: 'prev', test2: 'prev' };
        const current = { test1: 'prev', test2: 'prev' };
        const resolver = ResolverWrapper<typeof prev>([
            SingleResolver({ name: 'test1', compareBy: (value) => value?.test1 }),
            SingleResolver({ name: 'test2', compareBy: (value) => value?.test2 }),
        ]);

        expect(await resolver(prev, current)).toEqual([]);
    });
    it('should return array with Change for not equal objects', async () => {
        const prev = { test1: 'prev', test2: 'prev2' };
        const current = { test1: 'prev', test2: 'prev' };
        const resolver = ResolverWrapper<typeof prev>([
            SingleResolver({ name: 'test1', compareBy: (value) => value?.test1 }),
            SingleResolver({ name: 'test2', compareBy: (value) => value?.test2 }),
        ]);

        expect(await resolver(prev, current)).toEqual([
            { name: 'test2', old: 'prev2', new: 'prev', subChanges: [] },
        ] as Change[]);
    });
});
