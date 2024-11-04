import { Context } from '../util/context.util';

describe('Context', () => {
    it('should change context for resolvers', async () => {
        const prev = {
            internalContext: {
                a: 1,
            },
        };

        const current = {
            internalContext: {
                a: 2,
            },
        };
        await Context<typeof prev, (typeof prev)['internalContext']>(
            (mainContext) => mainContext?.internalContext,
            [
                async (prevInternal, prevCurrent): Promise<null> => {
                    expect(prevInternal).toEqual(prev.internalContext);
                    expect(prevCurrent).toEqual(current.internalContext);
                    return null;
                },
            ],
        )(prev, current);
    });
});
