'use strict';

const lllog = require('lllog')();

const fs = require('fs')
const { promisify } = require('util');
const fsWriteFile = promisify(fs.writeFile);
const fsStat = promisify(fs.stat);

const generateFile = async (Lib, dataset) => {

    const lib = new Lib();

    console.time(`${Lib.name} Time`);
    const dataEncoded = await lib.generateBuffer(dataset);
    console.timeEnd(`${Lib.name} Time`);

    return dataEncoded;
};

const createFile = async (Lib, ext, dataEncoded) => {

    const filePath = `encoded/${entity}Encoded.${ext}`;

    await fsWriteFile(filePath, dataEncoded);

    const stat = await fsStat(filePath);
    lllog.info(`${Lib.name} Size: ${stat.size/1024} KB`);
}

const createJSONFile = async (dataset) => {

    const filePath = `dataset/${entity}.json`;

    await fsWriteFile(filePath, JSON.stringify(dataset))

    const stat = await fsStat(filePath);
    lllog.info(`JSON Size: ${stat.size/1024} KB`);
}

const generate = async (entity = 'examples', size) => {

    lllog.info('Start Encoding file for', entity);

    try{

        const AvroLib = require(`./avro/${entity}`);
        const ProtobufLib = require(`./protobuf/${entity}`)

        const dataset = size ? require(`./generator/${entity}`)(Number(size)) : require(`./dataset/${entity}`);

        const [avroEncoded, protobufEncoded] = await Promise.all([
            generateFile(AvroLib, dataset),
            generateFile(ProtobufLib, { items: dataset })
        ]);

        await Promise.all([
            createFile(AvroLib, 'avro', avroEncoded),
            createFile(ProtobufLib, 'proto', protobufEncoded),
            createJSONFile(dataset)
        ]);

    } catch(error) {
        lllog.error('Could not Generate File', error.message);
    }

    lllog.info('Finish Encoding file');
};

const [,,entity, size] = process.argv;

generate(entity, size);
