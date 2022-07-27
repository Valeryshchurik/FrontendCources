const assert = require('assert');
const Sifter = require('../lib/sifter.js');

describe('Sifter', () => {
    describe('#tokenize()', () => {
        let sifter; let
            tokens;

        it('should return an empty array when given an empty string', () => {
            const sifter = new Sifter([]);
            const tokens = sifter.tokenize('');
            assert.equal(tokens.length, 0);
        });

        it('should return an array', () => {
            const sifter = new Sifter([]);
            const tokens = sifter.tokenize('hello world');
            assert.equal(Array.isArray(tokens), true);
        });

        it('should split string by spaces', () => {
            const sifter = new Sifter([]);
            const tokens = sifter.tokenize('hello world');
            assert.equal(tokens.length, 2);
        });

        describe('returned tokens', () => {
            before(() => {
                sifter = new Sifter([]);
                tokens = sifter.tokenize('hello world');
            });
            describe('"string" property', () => {
                it('should exist', () => {
                    assert.notEqual(typeof tokens[0].string, 'undefined');
                });
                it('should be a string', () => {
                    assert.equal(typeof tokens[0].string, 'string');
                });
                it('should be valid', () => {
                    assert.equal(tokens[0].string, 'hello');
                    assert.equal(tokens[1].string, 'world');
                });
            });
            describe('"regex" property', () => {
                it('should exist', () => {
                    assert.notEqual(typeof tokens[0].regex, 'undefined');
                });
                it('should be a RegExp object', () => {
                    assert.equal(tokens[0].regex instanceof RegExp, true);
                });
                it('should ignore case', () => {
                    assert.equal(tokens[0].regex.test('HelLO'), true);
                    assert.equal(tokens[1].regex.test('wORLD'), true);
                });
                it('should not be too greedy', () => {
                    assert.equal(tokens[0].regex.test('afawfaf'), false);
                });
                it('should match international characters', () => {
                    assert.equal(tokens[0].regex.test('hęłlö'), true);
                    assert.equal(tokens[1].regex.test('wÕrlð'), true);
                });
            });
        });
    });

    describe('#getScoreFunction()', () => {
        it('should acknowledge AND "conjunction" option', () => {
            let score; let search; const
                sifter = new Sifter([]);

            score = sifter.getScoreFunction('one two', { fields: ['a', 'b'], conjunction: 'and' });
            assert.equal(score({ a: 'one' }) > 0, false);
            assert.equal(score({ a: 'one', b: 'two' }) > 0, true);
            assert.equal(score({ a: 'one', b: 'one' }) > 0, false);
            assert.equal(score({ a: 'one', b: 'three' }) > 0, false);
            assert.equal(score({ a: 'three', b: 'three' }) > 0, false);
        });

        it('should acknowledge OR "conjunction" option', () => {
            let score; let search; const
                sifter = new Sifter([]);

            score = sifter.getScoreFunction('one two', { fields: ['a', 'b'], conjunction: 'or' });
            assert.equal(score({ a: 'one' }) > 0, true);
            assert.equal(score({ a: 'one', b: 'two' }) > 0, true);
            assert.equal(score({ a: 'one', b: 'one' }) > 0, true);
            assert.equal(score({ a: 'one', b: 'three' }) > 0, true);
            assert.equal(score({ a: 'three', b: 'three' }) > 0, false);
        });

        describe('with query and options', () => {
            it('should return a function that returns a number', () => {
                let score; let search; const
                    sifter = new Sifter([]);

                score = sifter.getScoreFunction('test', { fields: ['a', 'b'] });
                assert.equal(typeof score({ a: 'test' }), 'number');
                assert.equal(score({ a: 'test' }) > 0, true);
                assert.equal(typeof score({}), 'number');
            });
        });

        describe('with pre-prepared search', () => {
            it('should return a function that returns a number', () => {
                let score; let search; const
                    sifter = new Sifter([]);

                search = sifter.prepareSearch('test', { fields: ['a', 'b'] });
                score = sifter.getScoreFunction(search);
                assert.equal(typeof score({ a: 'test' }), 'number');
                assert.equal(score({ a: 'test' }) > 0, true);
                assert.equal(typeof score({}), 'number');
            });
        });
    });

    describe('#prepareSearch()', () => {
        it('should normalize options', () => {
            const sifter = new Sifter([{ field: 'a' }, {}]);
            const search = sifter.prepareSearch('a', {
                fields: { field: 'a' },
                sort: { field: 'a' },
                sort_empty: { field: 'a' },
            });
            assert.equal(Array.isArray(search.options.fields), true);
            assert.equal(Array.isArray(search.options.sort), true);
            assert.equal(Array.isArray(search.options.sort_empty), true);
        });

        describe('returned object', () => {
            const sifter = new Sifter([{ field: 'a' }, {}]);
            const search = sifter.prepareSearch('hello world');

            it('should contain "total" (int)', () => {
                assert.equal(search.total, 0);
            });
            it('should contain "tokens" (array)', () => {
                assert.equal(Array.isArray(search.tokens), true);
                assert.equal(search.tokens.length, 2);
            });
            it('should contain "items" (array)', () => {
                assert.equal(Array.isArray(search.items), true);
                assert.equal(search.items.length, 0);
            });
            it('should contain "options" (array)', () => {
                assert.equal(search.options !== null, true);
                assert.equal(typeof search.options, 'object');
                assert.equal(Array.isArray(search.options), false);
            });
        });
    });

    describe('#search()', () => {
        it('should not throw if an element does not contain search field', () => {
            assert.doesNotThrow(() => {
                const sifter = new Sifter([{ field: 'a' }, {}]);
                const result = sifter.search('hello', { fields: ['field'] });
            });
        });

        it('should allow "fields" option to be a string', () => {
            const sifter = new Sifter([{ field: 'a' }, {}]);
            const result = sifter.search('a', { fields: 'field' });
            assert.equal(result.items[0].id, 0);
        });

        it('should allow to search nested fields', () => {
            const sifter = new Sifter([
                { fields: { nested: 'aaa' } },
                { fields: { nested: 'add' } },
                { fields: { nested: 'abb' } },
            ]);
            const result = sifter.search('aaa', {
                fields: 'fields.nested',
                nesting: true,
            });

            assert.equal(result.items.length, 1);
            assert.equal(result.items[0].id, 0);
        });

        it('should allow word boundaries to be respected', () => {
            const sifter = new Sifter([
                { name: 'John Smith' },
                { name: 'Jane Doe' },
            ]);
            var result = sifter.search('mith', { fields: 'name' });
            assert.equal(result.items.length, 1);

            var result = sifter.search('mith', { fields: 'name', respect_word_boundaries: true });
            assert.equal(result.items.length, 0);

            var result = sifter.search('Smi', { fields: 'name', respect_word_boundaries: true });
            assert.equal(result.items.length, 1);

            var result = sifter.search('John Sm', { fields: 'name', respect_word_boundaries: true });
            assert.equal(result.items.length, 1);

            var result = sifter.search('ohn Smith', { fields: 'name', respect_word_boundaries: true, conjunction: 'and' });
            assert.equal(result.items.length, 0);
        });

        describe('sorting', () => {
            it('should respect "sort_empty" option when query absent', () => {
                const sifter = new Sifter([
                    { field: 'aaa' },
                    { field: 'add' },
                    { field: 'abb' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: { field: 'field', direction: 'asc' },
                    sort_empty: { field: 'field', direction: 'desc' },
                });
                assert.equal(result.items[0].id, 1);
                assert.equal(result.items[1].id, 2);
                assert.equal(result.items[2].id, 0);
            });
            it('should work with one field (as object)', () => {
                const sifter = new Sifter([
                    { field: 'aaa' },
                    { field: 'add' },
                    { field: 'abb' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: { field: 'field' },
                });
                assert.equal(result.items[0].id, 0);
                assert.equal(result.items[1].id, 2);
                assert.equal(result.items[2].id, 1);
            });
            it('should work with one field (as array)', () => {
                const sifter = new Sifter([
                    { field: 'aaa' },
                    { field: 'add' },
                    { field: 'abb' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: [{ field: 'field' }],
                });
                assert.equal(result.items[0].id, 0);
                assert.equal(result.items[1].id, 2);
                assert.equal(result.items[2].id, 1);
            });
            it('should work with multiple fields and respect priority', () => {
                const sifter = new Sifter([
                    { a: 'bbb', b: 'bbb' },
                    { a: 'bbb', b: 'ccc' },
                    { a: 'bbb', b: 'aaa' },
                    { a: 'aaa' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: [
                        { field: 'a' },
                        { field: 'b' },
                    ],
                });
                assert.equal(result.items[0].id, 3);
                assert.equal(result.items[1].id, 2);
                assert.equal(result.items[2].id, 0);
                assert.equal(result.items[3].id, 1);
            });
            it('should respect numeric fields', () => {
                const sifter = new Sifter([
                    { field: 1.0 },
                    { field: 12.9 },
                    { field: 9.1 },
                    { field: -9.0 },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: [{ field: 'field' }],
                });
                assert.equal(result.items[0].id, 3);
                assert.equal(result.items[1].id, 0);
                assert.equal(result.items[2].id, 2);
                assert.equal(result.items[3].id, 1);
            });
            it('should respect sort direction', () => {
                const sifter = new Sifter([
                    { a: 'bbb', b: 'rrr' },
                    { a: 'bbb', b: 'aaa' },
                    { a: 'aaa', b: 'rrr' },
                    { a: 'aaa', b: 'aaa' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: [
                        { field: 'b', direction: 'desc' },
                        { field: 'a', direction: 'asc' },
                    ],
                });
                assert.equal(result.items[0].id, 2);
                assert.equal(result.items[1].id, 0);
                assert.equal(result.items[2].id, 3);
                assert.equal(result.items[3].id, 1);
            });
            it('should add implicit "$score" field when query present', () => {
                const sifter = new Sifter([
                    { field: 'yoo' },
                    { field: 'book' },
                ]);
                const result = sifter.search('oo', {
                    fields: 'field',
                    sort: [{ field: 'field' }],
                });
                assert.equal(result.items[0].id, 0);
                assert.equal(result.items[1].id, 1);
            });
            it('should not add implicit "$score" field if explicitly given', () => {
                const sifter = new Sifter([
                    { field: 'boooo' },
                    { field: 'yoo' },
                    { field: 'aaa' },
                ]);
                const result = sifter.search('oo', {
                    filter: false,
                    fields: 'field',
                    sort: [{ field: 'field' }, { field: '$score' }],
                });
                assert.equal(result.items[0].id, 2);
                assert.equal(result.items[1].id, 0);
                assert.equal(result.items[2].id, 1);
            });
            it('should be locale-aware', () => {
                const sifter = new Sifter([
                    { field: 'Zoom Test' },
                    { field: 'Água Test' },
                ]);
                const result = sifter.search('', {
                    fields: 'field',
                    sort: [{ field: 'field', direction: 'asc' }],
                });
                assert.equal(result.items[0].id, 1);
                assert.equal(result.items[1].id, 0);
            });
            it('should work with nested fields', () => {
                const sifter = new Sifter([
                    { fields: { nested: 'aaa' } },
                    { fields: { nested: 'add' } },
                    { fields: { nested: 'abb' } },
                ]);
                const result = sifter.search('', {
                    fields: [],
                    sort: { field: 'fields.nested' },
                    nesting: true,
                });
                assert.equal(result.items[0].id, 0);
                assert.equal(result.items[1].id, 2);
                assert.equal(result.items[2].id, 1);
            });
        });

        describe('returned results', () => {
            let sifter; let options; let result; let result_empty; let
                result_all;

            before(() => {
                sifter = new Sifter([
                    { title: 'Matterhorn', location: 'Switzerland', continent: 'Europe' },
                    { title: 'Eiger', location: 'Switzerland', continent: 'Europe' },
                    { title: 'Everest', location: 'Nepal', continent: 'Asia' },
                    { title: 'Gannett', location: 'Wyoming', continent: 'North America' },
                    { title: 'Denali', location: 'Alaska', continent: 'North America' },
                ]);

                options = { limit: 1, fields: ['title', 'location', 'continent'] };
                result = sifter.search('switzerland europe', options);
                result_empty = sifter.search('awawfawfawf', options);
                result_all = sifter.search('', {
                    fields: ['title', 'location', 'continent'],
                    sort: [{ field: 'title' }],
                });
            });

            it('should not vary when using an array vs a hash as a data source', () => {
                const sifter_hash = new Sifter({
                    a: { title: 'Matterhorn', location: 'Switzerland', continent: 'Europe' },
                    b: { title: 'Eiger', location: 'Switzerland', continent: 'Europe' },
                    c: { title: 'Everest', location: 'Nepal', continent: 'Asia' },
                    d: { title: 'Gannett', location: 'Wyoming', continent: 'North America' },
                    e: { title: 'Denali', location: 'Alaska', continent: 'North America' },
                });
                const result_hash = sifter.search('switzerland europe', options);
                assert.deepEqual(result_hash, result);
            });

            describe('"items" array', () => {
                it('should be an array', () => {
                    assert.equal(Array.isArray(result.items), true);
                    assert.equal(Array.isArray(result_empty.items), true);
                    assert.equal(Array.isArray(result_all.items), true);
                });
                it('should include entire set if no query provided', () => {
                    assert.equal(result_all.items.length, 5);
                });
                it('should not have a length that exceeds "limit" option', () => {
                    assert.equal(result.items.length > options.limit, false);
                });
                it('should not contain any items with a score not equal to 1 (without query)', () => {
                    for (let i = 0, n = result_all.items.length; i < n; i++) {
                        assert.equal(result_all.items[i].score, 1);
                    }
                });
                it('should not contain any items with a score of zero (with query)', () => {
                    for (let i = 0, n = result.items.length; i < n; i++) {
                        assert.notEqual(result.items[i].score, 0);
                    }
                });
                it('should be empty when no results match', () => {
                    assert.equal(result_empty.items.length, 0);
                });

                describe('elements', () => {
                    it('should be objects', () => {
                        assert.equal(typeof result.items[0], 'object');
                        assert.equal(Array.isArray(result.items[0]), false);
                    });
                    describe('"score" property', () => {
                        it('should exist', () => {
                            assert.notEqual(typeof result.items[0].score, 'undefined');
                            assert.notEqual(typeof result_all.items[0].score, 'undefined');
                        });
                        it('should be a number', () => {
                            assert.equal(typeof result.items[0].score, 'number');
                            assert.equal(typeof result_all.items[0].score, 'number');
                        });
                    });
                    describe('"id" property', () => {
                        it('should exist', () => {
                            assert.notEqual(typeof result.items[0].id, 'undefined');
                            assert.notEqual(typeof result_all.items[0].id, 'undefined');
                        });
                    });
                });
            });

            describe('"options"', () => {
                it('should not be a reference to original options', () => {
                    assert.equal(result.options === options, false);
                });
                it('should match original search options', () => {
                    assert.deepEqual(result.options, options);
                });
            });

            describe('"tokens"', () => {
                it('should be an array', () => {
                    assert.equal(Array.isArray(result.tokens), true);
                });
                describe('elements', () => {
                    it('should be a object', () => {
                        assert.equal(typeof result.tokens[0], 'object');
                        assert.equal(Array.isArray(result.tokens[0]), false);
                    });
                    describe('"string" property', () => {
                        it('should exist', () => {
                            assert.notEqual(typeof result.tokens[0].string, 'undefined');
                        });
                        it('should be a string', () => {
                            assert.equal(typeof result.tokens[0].string, 'string');
                        });
                        it('should be valid', () => {
                            assert.equal(result.tokens[0].string, 'switzerland');
                            assert.equal(result.tokens[1].string, 'europe');
                        });
                    });
                    describe('"regex" property', () => {
                        it('should exist', () => {
                            assert.notEqual(typeof result.tokens[0].regex, 'undefined');
                        });
                        it('should be a RegExp object', () => {
                            assert.equal(result.tokens[0].regex instanceof RegExp, true);
                        });
                    });
                });
            });

            describe('"query"', () => {
                it('should match original query', () => {
                    assert.equal(result.query, 'switzerland europe');
                });
            });

            describe('"total"', () => {
                it('should be an integer', () => {
                    assert.equal(typeof result.total, 'number');
                    assert.equal(Math.floor(result.total), Math.ceil(result.total));
                });
                it('should be valid', () => {
                    assert.equal(result.total, 2);
                    assert.equal(result_empty.total, 0);
                });
            });
        });
    });
});
