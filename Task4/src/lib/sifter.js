/**
 * sifter.js
 * Copyright (c) 2013–2020 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Sifter = factory();
    }
}(this, () => {
    /**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
    const Sifter = function (items, settings) {
        this.items = items;
        this.settings = settings || { diacritics: true };
    };

    /**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
    Sifter.prototype.tokenize = function (query, respect_word_boundaries) {
        query = trim(String(query || '').toLowerCase());
        if (!query || !query.length) return [];

        let i; let n; let regex; let
            letter;
        const tokens = [];
        const words = query.split(/ +/);

        for (i = 0, n = words.length; i < n; i++) {
            regex = escape_regex(words[i]);
            if (this.settings.diacritics) {
                for (letter in DIACRITICS) {
                    if (DIACRITICS.hasOwnProperty(letter)) {
                        regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
                    }
                }
            }
            if (respect_word_boundaries) regex = `\\b${regex}`;
            tokens.push({
                string: words[i],
                regex: new RegExp(regex, 'i'),
            });
        }

        return tokens;
    };

    /**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
    Sifter.prototype.iterator = function (object, callback) {
        let iterator;
        if (is_array(object)) {
            iterator = Array.prototype.forEach || function (callback) {
                for (let i = 0, n = this.length; i < n; i++) {
                    callback(this[i], i, this);
                }
            };
        } else {
            iterator = function (callback) {
                for (const key in this) {
                    if (this.hasOwnProperty(key)) {
                        callback(this[key], key, this);
                    }
                }
            };
        }

        iterator.apply(object, [callback]);
    };

    /**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
    Sifter.prototype.getScoreFunction = function (search, options) {
        let self; let fields; let tokens; let token_count; let
            nesting;

        self = this;
        search = self.prepareSearch(search, options);
        tokens = search.tokens;
        fields = search.options.fields;
        token_count = tokens.length;
        nesting = search.options.nesting;

        /**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
        const scoreValue = function (value, token) {
            let score; let
                pos;

            if (!value) return 0;
            value = String(value || '');
            pos = value.search(token.regex);
            if (pos === -1) return 0;
            score = token.string.length / value.length;
            if (pos === 0) score += 0.5;
            return score;
        };

        /**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
        const scoreObject = (function () {
            const field_count = fields.length;
            if (!field_count) {
                return function () { return 0; };
            }
            if (field_count === 1) {
                return function (token, data) {
                    return scoreValue(getattr(data, fields[0], nesting), token);
                };
            }
            return function (token, data) {
                for (var i = 0, sum = 0; i < field_count; i++) {
                    sum += scoreValue(getattr(data, fields[i], nesting), token);
                }
                return sum / field_count;
            };
        }());

        if (!token_count) {
            return function () { return 0; };
        }
        if (token_count === 1) {
            return function (data) {
                return scoreObject(tokens[0], data);
            };
        }

        if (search.options.conjunction === 'and') {
            return function (data) {
                let score;
                for (var i = 0, sum = 0; i < token_count; i++) {
                    score = scoreObject(tokens[i], data);
                    if (score <= 0) return 0;
                    sum += score;
                }
                return sum / token_count;
            };
        }
        return function (data) {
            for (var i = 0, sum = 0; i < token_count; i++) {
                sum += scoreObject(tokens[i], data);
            }
            return sum / token_count;
        };
    };

    /**
	 * Returns a function that can be used to compare two
	 * results, for sorting purposes. If no sorting should
	 * be performed, `null` will be returned.
	 *
	 * @param {string|object} search
	 * @param {object} options
	 * @return function(a,b)
	 */
    Sifter.prototype.getSortFunction = function (search, options) {
        let i; let n; let self; let field; let fields; let fields_count; let multiplier; let multipliers; let get_field; let implicit_score; let
            sort;

        self = this;
        search = self.prepareSearch(search, options);
        sort = (!search.query && options.sort_empty) || options.sort;

        /**
		 * Fetches the specified sort field value
		 * from a search result item.
		 *
		 * @param  {string} name
		 * @param  {object} result
		 * @return {mixed}
		 */
        get_field = function (name, result) {
            if (name === '$score') return result.score;
            return getattr(self.items[result.id], name, options.nesting);
        };

        // parse options
        fields = [];
        if (sort) {
            for (i = 0, n = sort.length; i < n; i++) {
                if (search.query || sort[i].field !== '$score') {
                    fields.push(sort[i]);
                }
            }
        }

        // the "$score" field is implied to be the primary
        // sort field, unless it's manually specified
        if (search.query) {
            implicit_score = true;
            for (i = 0, n = fields.length; i < n; i++) {
                if (fields[i].field === '$score') {
                    implicit_score = false;
                    break;
                }
            }
            if (implicit_score) {
                fields.unshift({ field: '$score', direction: 'desc' });
            }
        } else {
            for (i = 0, n = fields.length; i < n; i++) {
                if (fields[i].field === '$score') {
                    fields.splice(i, 1);
                    break;
                }
            }
        }

        multipliers = [];
        for (i = 0, n = fields.length; i < n; i++) {
            multipliers.push(fields[i].direction === 'desc' ? -1 : 1);
        }

        // build function
        fields_count = fields.length;
        if (!fields_count) {
            return null;
        } if (fields_count === 1) {
            field = fields[0].field;
            multiplier = multipliers[0];
            return function (a, b) {
                return multiplier * cmp(
                    get_field(field, a),
                    get_field(field, b),
                );
            };
        }
        return function (a, b) {
            let i; let result; let a_value; let b_value; let
                field;
            for (i = 0; i < fields_count; i++) {
                field = fields[i].field;
                result = multipliers[i] * cmp(
                    get_field(field, a),
                    get_field(field, b),
                );
                if (result) return result;
            }
            return 0;
        };
    };

    /**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
    Sifter.prototype.prepareSearch = function (query, options) {
        if (typeof query === 'object') return query;

        options = extend({}, options);

        const option_fields = options.fields;
        const option_sort = options.sort;
        const option_sort_empty = options.sort_empty;

        if (option_fields && !is_array(option_fields)) options.fields = [option_fields];
        if (option_sort && !is_array(option_sort)) options.sort = [option_sort];
        if (option_sort_empty && !is_array(option_sort_empty)) options.sort_empty = [option_sort_empty];

        return {
            options,
            query: String(query || '').toLowerCase(),
            tokens: this.tokenize(query, options.respect_word_boundaries),
            total: 0,
            items: [],
        };
    };

    /**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {array}
	 *   - score {function}
	 *   - filter {bool}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
    Sifter.prototype.search = function (query, options) {
        const self = this; let value; let score; let search; let
            calculateScore;
        let fn_sort;
        let fn_score;

        search = this.prepareSearch(query, options);
        options = search.options;
        query = search.query;

        // generate result scoring function
        fn_score = options.score || self.getScoreFunction(search);

        // perform search and sort
        if (query.length) {
            self.iterator(self.items, (item, id) => {
                score = fn_score(item);
                if (options.filter === false || score > 0) {
                    search.items.push({ score, id });
                }
            });
        } else {
            self.iterator(self.items, (item, id) => {
                search.items.push({ score: 1, id });
            });
        }

        fn_sort = self.getSortFunction(search, options);
        if (fn_sort) search.items.sort(fn_sort);

        // apply limits
        search.total = search.items.length;
        if (typeof options.limit === 'number') {
            search.items = search.items.slice(0, options.limit);
        }

        return search;
    };

    // utilities
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var cmp = function (a, b) {
        if (typeof a === 'number' && typeof b === 'number') {
            return a > b ? 1 : (a < b ? -1 : 0);
        }
        a = asciifold(String(a || ''));
        b = asciifold(String(b || ''));
        if (a > b) return 1;
        if (b > a) return -1;
        return 0;
    };

    var extend = function (a, b) {
        let i; let n; let k; let
            object;
        for (i = 1, n = arguments.length; i < n; i++) {
            object = arguments[i];
            if (!object) continue;
            for (k in object) {
                if (object.hasOwnProperty(k)) {
                    a[k] = object[k];
                }
            }
        }
        return a;
    };

    /**
	 * A property getter resolving dot-notation
	 * @param  {Object}  obj     The root object to fetch property on
	 * @param  {String}  name    The optionally dotted property name to fetch
	 * @param  {Boolean} nesting Handle nesting or not
	 * @return {Object}          The resolved property value
	 */
    var getattr = function (obj, name, nesting) {
	    if (!obj || !name) return;
	    if (!nesting) return obj[name];
	    const names = name.split('.');
	    while (names.length && (obj = obj[names.shift()]));
	    return obj;
    };

    var trim = function (str) {
        return (`${str}`).replace(/^\s+|\s+$|/g, '');
    };

    var escape_regex = function (str) {
        return (`${str}`).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    };

    var is_array = Array.isArray || (typeof $ !== 'undefined' && $.isArray) || function (object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    };

    var DIACRITICS = {
        a: '[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]',
        b: '[b␢βΒB฿𐌁ᛒ]',
        c: '[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]',
        d: '[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]',
        e: '[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]',
        f: '[fƑƒḞḟ]',
        g: '[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]',
        h: '[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]',
        i: '[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]',
        j: '[jȷĴĵɈɉʝɟʲ]',
        k: '[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]',
        l: '[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]',
        n: '[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]',
        o: '[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]',
        p: '[pṔṕṖṗⱣᵽƤƥᵱ]',
        q: '[qꝖꝗʠɊɋꝘꝙq̃]',
        r: '[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]',
        s: '[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]',
        t: '[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]',
        u: '[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]',
        v: '[vṼṽṾṿƲʋꝞꝟⱱʋ]',
        w: '[wẂẃẀẁŴŵẄẅẆẇẈẉ]',
        x: '[xẌẍẊẋχ]',
        y: '[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]',
        z: '[zŹźẐẑŽžŻżẒẓẔẕƵƶ]',
    };

    var asciifold = (function () {
        let i; let n; let k; let
            chunk;
        let foreignletters = '';
        const lookup = {};
        for (k in DIACRITICS) {
            if (DIACRITICS.hasOwnProperty(k)) {
                chunk = DIACRITICS[k].substring(2, DIACRITICS[k].length - 1);
                foreignletters += chunk;
                for (i = 0, n = chunk.length; i < n; i++) {
                    lookup[chunk.charAt(i)] = k;
                }
            }
        }
        const regexp = new RegExp(`[${foreignletters}]`, 'g');
        return function (str) {
            return str.replace(regexp, (foreignletter) => lookup[foreignletter]).toLowerCase();
        };
    }());

    // export
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    return Sifter;
}));
