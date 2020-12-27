'use strict';

const AvroBufLib = require('./base');

const FILENAME = 'examples';

module.exports = class ExamplesAvroBufLib extends AvroBufLib {

	get filename() {
		return FILENAME;
	}

	get schema() {
		return {
			name: 'exampleFile',
			type: 'array',
			items: {
				name: 'items',
				type: 'record',
				fields: [
					{ name: 'name', type: 'string' },
					{ name: 'isDev', type: 'boolean' },
					{ name: 'age', type: 'int' }
				]
			}
		}
	}
};
