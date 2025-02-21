/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface _Master_ {
  BalancePayload: BalancePayload;
  WithdrawErc721Payload: WithdrawErc721Payload;
  TransferErc721Payload: TransferErc721Payload;
  TransferErc20Payload: TransferErc20Payload;
  WalletOutput: WalletOutput;
  WithdrawErc20Payload: WithdrawErc20Payload;
  withdrawErc721: WithdrawErc721;
  Erc721Event: Erc721Event;
  WithdrawEtherPayload: WithdrawEtherPayload;
  TransferEtherPayload: TransferEtherPayload;
  withdrawErc20: WithdrawErc20;
  Erc20Event: Erc20Event;
  withdrawEther: WithdrawEther;
  EtherEvent: EtherEvent;
}
export interface BalancePayload {
  address: string;
}
export interface WithdrawErc721Payload {
  token: string;
  id: number;
  execLayerData: string;
}
export interface TransferErc721Payload {
  token: string;
  receiver: string;
  id: number;
  execLayerData: string;
}
export interface TransferErc20Payload {
  token: string;
  receiver: string;
  amount: number;
  execLayerData: string;
}
export interface WalletOutput {
  ether?: number;
  erc20?: {
    [k: string]: number;
  };
  erc721?: {
    [k: string]: number[];
  };
  erc1155?: {
    /**
     * @minItems 2
     * @maxItems 2
     */
    [k: string]: [number[], number[]];
  };
}
export interface WithdrawErc20Payload {
  token: string;
  amount: number;
  execLayerData: string;
}
export interface WithdrawErc721 {
  sender: string;
  receiver: string;
  id: number;
}
export interface Erc721Event {
  user: string;
  address: string;
  mod_id: number;
  ids: number[];
}
export interface WithdrawEtherPayload {
  amount: number;
  execLayerData: string;
}
export interface TransferEtherPayload {
  receiver: string;
  amount: number;
  execLayerData: string;
}
export interface WithdrawErc20 {
  user: string;
  amount: number;
}
export interface Erc20Event {
  user: string;
  address: string;
  mod_amount: number;
  balance: number;
}
export interface WithdrawEther {
  user: string;
  amount: number;
}
export interface EtherEvent {
  user: string;
  mod_amount: number;
  balance: number;
}
