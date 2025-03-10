/* eslint-disable */
/**
 * This file was automatically generated by cartesapp.template_generator.
 * DO NOT MODIFY IT BY HAND. Instead, run the generator,
 */
import { ethers, Signer, ContractReceipt } from "ethers";

import { 
    advanceInput, inspect, 
    AdvanceOutput, InspectOptions, AdvanceInputOptions, GraphqlOptions,
    EtherDepositOptions, ERC20DepositOptions, ERC721DepositOptions,
    Report as CartesiReport, Notice as CartesiNotice, Voucher as CartesiVoucher, 
    advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit,
    queryNotice, queryReport, queryVoucher
} from "cartesi-client";


import Ajv from "ajv"
import addFormats from "ajv-formats"

import { 
    genericAdvanceInput, genericInspect, IOType, Models,
    IOData, Output, Event, ContractCall, InspectReport, 
    MutationOptions, QueryOptions, 
    CONVENTIONAL_TYPES, decodeToConventionalTypes
} from "../cartesapp/utils"

import * as ifaces from "./ifaces";


/**
 * Configs
 */

const ajv = new Ajv();
addFormats(ajv);
ajv.addFormat("biginteger", (data) => {
    const dataTovalidate = data.startsWith('-') ? data.substring(1) : data;
    return ethers.utils.isHexString(dataTovalidate) && dataTovalidate.length % 2 == 0;
});
const MAX_SPLITTABLE_OUTPUT_SIZE = 4194247;

/*
 * Mutations/Advances
 */


/*
 * Queries/Inspects
 */

export async function indexerQuery(
    inputData: ifaces.IndexerPayload,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'indexer/indexer_query';
    const data: IndexerPayload = new IndexerPayload(inputData);
    const output: InspectReport = await genericInspect<ifaces.IndexerPayload>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}




/**
 * Models Decoders/Exporters
 */

export function decodeToModel(data: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport, modelName: string): any {
    if (modelName == undefined)
        throw new Error("undefined model");
    if (CONVENTIONAL_TYPES.includes(modelName))
        return decodeToConventionalTypes(data.payload,modelName);
    const decoder = models[modelName].decoder;
    if (decoder == undefined)
        throw new Error("undefined decoder");
    return decoder(data);
}

export function exportToModel(data: any, modelName: string): string {
    const exporter = models[modelName].exporter;
    if (exporter == undefined)
        throw new Error("undefined exporter");
    return exporter(data);
}

export class IndexerPayload extends IOData<ifaces.IndexerPayload> { constructor(data: ifaces.IndexerPayload, validate: boolean = true) { super(models['IndexerPayload'],data,validate); } }
export function exportToIndexerPayload(data: ifaces.IndexerPayload): string {
    const dataToExport: IndexerPayload = new IndexerPayload(data);
    return dataToExport.export();
}

export class IndexerOutput extends Output<ifaces.IndexerOutput> { constructor(output: CartesiReport | InspectReport) { super(models['IndexerOutput'],output); } }
export function decodeToIndexerOutput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport): IndexerOutput {
    return new IndexerOutput(output as CartesiReport);
}


/**
 * Model
 */

export const models: Models = {
    'IndexerPayload': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['tags', 'output_type', 'msg_sender', 'timestamp_gte', 'timestamp_lte', 'module', 'input_index'],
        exporter: exportToIndexerPayload,
        validator: ajv.compile<ifaces.IndexerPayload>(JSON.parse('{"title": "IndexerPayload", "type": "object", "properties": {"tags": {"type": "array", "items": {"type": "string"}}, "output_type": {"type": "string"}, "msg_sender": {"type": "string"}, "timestamp_gte": {"type": "integer"}, "timestamp_lte": {"type": "integer"}, "module": {"type": "string"}, "input_index": {"type": "integer"}}}'))
    },
    'IndexerOutput': {
        ioType:IOType.report,
        abiTypes:[],
        params:['data'],
        decoder: decodeToIndexerOutput,
        validator: ajv.compile<ifaces.IndexerOutput>(JSON.parse('{"title": "IndexerOutput", "type": "object", "properties": {"data": {"type": "array", "items": {"$ref": "#/definitions/OutputIndex"}}}, "required": ["data"], "definitions": {"OutputIndex": {"title": "OutputIndex", "type": "object", "properties": {"output_type": {"type": "string"}, "module": {"type": "string"}, "class_name": {"type": "string"}, "input_index": {"type": "integer"}, "output_index": {"type": "integer"}}, "required": ["output_type", "module", "class_name", "input_index", "output_index"]}}}'))
    },
    };