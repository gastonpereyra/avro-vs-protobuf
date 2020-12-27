'use strict';

const protobuf = require('protobufjs');
const logger = require('lllog')();

module.exports = class ProtoBufLib {

	get fileDefinitionPath() {
		return `${__dirname}/definitions/${this.filename}.proto`;
	}

	/**
	 * Generate ProtoBuf Buffer from Data, previously transform Data into Proto Messages
	 * @async
	 * @param {*} data Any data to validate
	 * @returns {Buffer} Data encoded in ProtoBuf Messages Buffer
	 */
	async generateBuffer(data) {

		try {

			await this.load(this.fileDefinitionPath, this.packageName, this.messageName);

			if(!this.isValidMessage(data))
				return;

			return this.encodeMessage(data);

		} catch(error) {
			logger.error('Cannot Generate Proto Buffer', error.message);
		}
	}

	async decodeBuffer(buffer) {

		try {
			await this.load(this.fileDefinitionPath, this.packageName, this.messageName);

			return this.messageType.decode(buffer);

		} catch(error) {
			logger.error('Cannot Read Proto Buffer', error.message);
		}
	}

	/**
	 * Load File and Setup Main Message Class
	 * @param {string} filePath File Path from root/
	 * @param {string} packageName Proto package Name
	 * @param {string} messageName Proto Main Message Class name
	 */
	async load(filePath, packageName, messageName) {

		await this.setRoot(filePath);
		this.setMessageType(packageName, messageName);
	}

	/**
     * Load a .proto file for Message Class Definitions
     * @async
     * @param {string} filePath File Path from root/
	 * @throws {Error} When File does not exist or Is not a valid Proto file
     */
	async setRoot(filePath) {

		if(!filePath)
			throw new Error('Invalid File Path');

		this.root = await protobuf.load(filePath);
	}

	/**
	 * Set the Main Message Class
	 * @param {string} packageName Proto package Name
	 * @param {string} messageName Proto Main Message Class name
	 * @throws {Error} When Class or Package not exist, or no Proto File is load
	 */
	setMessageType(packageName, messageName) {

		if(!this.root)
			throw new Error('No Proto File is loaded');

		if(!packageName)
			throw new Error('Invalid Package name');

		if(!messageName)
			throw new Error('Invalid Message name');

		// lookupType: Search for the Class in the package and returns an Instance of Message Class
		this.messageType = this.root.lookupType(`${packageName}.${messageName}`);
	}

	/**
	 * Validate if the data can be parse to Message Class
	 * @param {*} data Any data to validate
	 * @throws {Error} When No Message Class is setted
	 */
	isValidMessage(data) {
		this.validateMessageType();

		// verify -> OK: null || Error: string
		return !this.messageType.verify(data);
	}

	/**
	 * Encode the data to a ProtoData Buffer
	 * @param {*} data Any data to validate
	 * @returns {Buffer} Data serialized Buffer
	 * @throws {Error} When No Message Class is setted or if Data is non-valid definition
	 */
	encodeMessage(data) {

		if(!data)
			throw new Error('No Data to Encode');

		this.validateMessageType();

		// Parse and Encode Data
		return this.messageType.encode(data).finish();
	}

	validateMessageType() {

		if(!this.messageType)
			throw new Error('No Message Type is loaded');
	}
};
