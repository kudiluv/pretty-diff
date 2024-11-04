import { SingleResolver } from '../resolvers/single.resolver';
import { Change } from '../types';

describe('SingleResolver', () => {
    it('should return NULL for equal string values', async () => {
        const prev = 'prev';
        const current = 'prev';
        const resolver = SingleResolver<string>('test-string', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal string values', async () => {
        const prev = 'prev';
        const current = 'current';
        const resolver = SingleResolver<string>('test-string', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-string',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal boolean values', async () => {
        const prev = true;
        const current = true;
        const resolver = SingleResolver<boolean>('test-boolean', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal string values', async () => {
        const prev = false;
        const current = true;
        const resolver = SingleResolver<boolean>('test-boolean', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-boolean',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal number values', async () => {
        const prev = 1;
        const current = 1;
        const resolver = SingleResolver<number>('test-number', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal number values', async () => {
        const prev = 1;
        const current = 2;
        const resolver = SingleResolver<number>('test-number', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-number',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal Date values', async () => {
        const prev = new Date('2020-01-01');
        const current = new Date('2020-01-01');
        const resolver = SingleResolver<Date>('test-date', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal Date values', async () => {
        const prev = new Date('2020-01-01');
        const current = new Date('2020-01-02');
        const resolver = SingleResolver<Date>('test-date', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-date',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal objects', async () => {
        const prev = { a: 1, b: 'test', c: new Date('2020-01-01') };
        const current = { a: 1, b: 'test', c: new Date('2020-01-01') };
        const resolver = SingleResolver<typeof prev>('test-object', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal objects', async () => {
        const prev = { a: 1, b: 'test', c: new Date('2020-01-01') };
        const current = { a: 1, b: 'test', c: new Date('2020-01-02') };
        const resolver = SingleResolver<typeof prev>('test-object', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-object',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal deep objects', async () => {
        const prev = { a: 1, b: { c: 'test' } };
        const current = { a: 1, b: { c: 'test' } };
        const resolver = SingleResolver<typeof prev>('test-deep-object', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal deep objects', async () => {
        const prev = { a: 1, b: { c: 'test' } };
        const current = { a: 1, b: { c: 'test2' } };
        const resolver = SingleResolver<typeof prev>('test-deep-object', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-deep-object',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
    it('should return NULL for equal arrays', async () => {
        const prev = [1, 'test', new Date('2020-01-01')];
        const current = [1, 'test', new Date('2020-01-01')];
        const resolver = SingleResolver<typeof prev>('test-array', (value) => value);

        expect(await resolver(prev, current)).toBeNull();
    });
    it('should return Change for not equal arrays', async () => {
        const prev = [1, 'test', new Date('2020-01-01')];
        const current = [1, 'test', new Date('2020-01-02')];
        const resolver = SingleResolver<typeof prev>('test-array', (value) => value);

        expect(await resolver(prev, current)).toEqual({
            name: 'test-array',
            old: prev,
            new: current,
            subChanges: [],
        } as Change);
    });
});
