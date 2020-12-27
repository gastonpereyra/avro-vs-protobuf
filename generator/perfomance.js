'use strict';

const template = {
    name: 'Person n°',
    age: 0,
    isDev: true
};

const generator = {
    name: (value, index) => `${value} ${index}`,
    age: () => Math.ceil(Math.random() * 100),
    isDev: (value, index, size) => !!(Math.random() * size > size/2)
}

module.exports = (size = 1000) => Array(size).fill({}).map((item, index) => {

    return Object.entries(template).reduce((itemGenerated, [key, value]) => {

        if(generator[key])
            itemGenerated[key] = generator[key](value, index, size);

        return itemGenerated;

    }, { ...template });
});