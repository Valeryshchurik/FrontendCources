const take = (initialArray, n) => {
    console.log('Here Custom Take Goes!');

    const newArray = [];
    for (let i = 0; i < n; i++) {
        newArray[i] = initialArray[i];
    }
    return newArray;
};

const skip = (initialArray, n) => {
    console.log('Here Custom Skip Goes!');

    const newArray = [];
    for (let i = n, j = 0; i < initialArray.length; i++, j++) {
        newArray[j] = initialArray[i];
    }

    return newArray;
};

const map = (initialArray, callback) => {
    console.log('Here Custom Map Goes!');

    const newArray = [];
    for (let i = 0; i < initialArray.length; i++) {
        newArray[i] = callback(initialArray[i], i, initialArray);
    }

    return newArray;
};

const reduce = (initialArray, callback, starter) => {
    console.log('Here Custom Reduce Goes!');

    accumulator = starter
    for (let i = 0; i < this.length; i++) {
        accumulator = callback(accumulator, initialArray[i]);
    }

    return accumulator;
};

const filter = (initialArray, callback) => {
    console.log('Here Custom Filter Goes!');

    const newArray = [];

    for (let i = 0; i < initialArray.length; i++) {
        if (callback(initialArray[i])) {
            newArray.push(initialArray[i]);
        }
    }

    return newArray;
};

const foreach = (initialArray, callback) => {
    console.log('Here Custom Foreach Goes!');

    for (let i = 0; i < initialArray.length; i++) {
        if (initialArray.hasOwnProperty(i)) {
            callback(initialArray[i], i, initialArray);
        }
    }
};

function createMethod(method) {
    return function () {
        const firstArgument = this._isChainable ? this._currentValue : arguments[0];
        const secondArgument = this._isChainable ? arguments[0] : arguments[1];
        const thirdArgument = this._isChainable ? arguments[1] : arguments[2];
        const result = method.call(
            this,
            firstArgument,
            secondArgument,
            thirdArgument
        );
        if (this._isChainable && result) {
            this._currentValue = result;
        }
        return this._isChainable ? this : result;
    };
}

class ArrayLib {
    constructor(currentValue) {
        this._isChainable = false;
        this._currentValue = currentValue;
    }
    value() {
        return this._currentValue;
    }
    take(...args) {
        return createMethod(take).call(this, ...args);
    }
    map(...args) {
        return createMethod(map).call(this, ...args);
    }
    skip(...args) {
        return createMethod(skip).call(this, ...args);
    }
    reduce(...args) {
        return createMethod(reduce).call(this, ...args);
    }
    filter(...args) {
        return createMethod(filter).call(this, ...args);
    }
    foreach(...args) {
        return createMethod(foreach).call(this, ...args);
    }
    chain(obj) {
        const wrappedObj = new ArrayLib(obj);
        wrappedObj._isChainable = true;
        return wrappedObj;
    }
}

module.exports = ArrayLib;
