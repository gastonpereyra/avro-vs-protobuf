'use strict';

const ProtoBufLib = require('./base');

const FILENAME = 'perfomance';
const PACKAGE_NAME = 'perfomanceFile';
const MESSAGE_NAME = 'Perfomances';

module.exports = class Protobuf extends ProtoBufLib {

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
