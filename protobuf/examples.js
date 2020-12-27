'use strict';

const ProtoBufLib = require('./base');

const FILENAME = 'examples';
const PACKAGE_NAME = 'exampleFile';
const MESSAGE_NAME = 'Examples';

module.exports = class ExamplesProtoBufLib extends ProtoBufLib {

	get filename() {
		return FILENAME;
	}

	get packageName() {
		return PACKAGE_NAME;
	}

	get messageName() {
		return MESSAGE_NAME;
	}
};
