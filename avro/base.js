'use strict';

const Avro = require('avro-js');
const logger = require('lllog')();

module.exports = class AvroLib {

	/**
	 * Generate Avro Buffer from Data, previously transform Data into Avro Messages
	 * @async
	 * @param {*} data Any data to validate
	 * @returns {Buffer} Data encoded in Avro Messages Buffer
	 */
	async generateBuffer(data) {

		try {

			this.load();

			if(!this.isValidMessage(data))
				return;

			return this.encodeMessage(data);

		} catch(error) {
			logger.error('Cannot Generate Avro Buffer', error.message);
		}
	}

	async decodeBuffer(buffer) {

		try {
			await this.load();

			return this.type.fromBuffer(buffer);

		} catch(error) {
			logger.error('Cannot Read Avro Buffer', error.message);
		}
	}

	/**
	 * Load File and Setup Main Message Class
	 */
	load() {
		this.type = Avro.parse(this.schema);
	}

	/**
	 * Validate if the data can be parse to Message Class
	 * @param {*} data Any data to validate
	 * @throws {Error} When No Message Class is setted
	 */
	isValidMessage(data) {

		this.validateMessageType();

		return this.type.isValid(data);
	}

	/**
	 * Encode the data to a AvroData Buffer
	 * @param {*} data Any data to validate
	 * @returns {Buffer} Data serialized Buffer
	 * @throws {Error} When No Message Class is setted or if Data is non-valid definition
	 */
	encodeMessage(data) {

		if(!data)
			throw new Error('No Data to Encode');

		this.validateMessageType();

		// Parse and Encode Data
		return this.type.toBuffer(data);
	}

	validateMessageType() {

		if(!this.type)
			throw new Error('No Schema Type is loaded');
	}
};
