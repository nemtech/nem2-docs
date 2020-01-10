"use strict";
/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const nem2_sdk_1 = require("nem2-sdk");
const RepositoryFactoryHttp_1 = require("nem2-sdk/dist/src/infrastructure/RepositoryFactoryHttp");
/* start block 01 */
// replace with key
const key = nem2_sdk_1.KeyGenerator.generateUInt64Key('CERT');
/* end block 01 */
/* start block 02 */
// replace with network type
const networkType = nem2_sdk_1.NetworkType.TEST_NET;
// replace with public key
const alicePublicKey = 'E59EF184A612D4C3C4D89B5950EB57262C69862B2F96E59C5043BF41765C482F';
const alicePublicAccount = nem2_sdk_1.PublicAccount.createFromPublicKey(alicePublicKey, networkType);
// replace with value
const value = '123456';
const accountMetadataTransaction = nem2_sdk_1.AccountMetadataTransaction.create(nem2_sdk_1.Deadline.create(), alicePublicAccount.publicKey, key, value.length, value, networkType);
/* end block 02 */
/* start block 03 */
// replace with bob private key
const bobPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const bobAccount = nem2_sdk_1.Account.createFromPrivateKey(bobPrivateKey, networkType);
const aggregateTransaction = nem2_sdk_1.AggregateTransaction.createBonded(nem2_sdk_1.Deadline.create(), [accountMetadataTransaction.toAggregate(bobAccount.publicAccount)], networkType, [], nem2_sdk_1.UInt64.fromUint(2000000));
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const signedTransaction = bobAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 03 */
/* start block 04 */
// replace with nem.xem id
const networkCurrencyMosaicId = new nem2_sdk_1.MosaicId('75AF035421401EF0');
// replace with network currency divisibility
const networkCurrencyDivisibility = 6;
const hashLockTransaction = nem2_sdk_1.HashLockTransaction.create(nem2_sdk_1.Deadline.create(), new nem2_sdk_1.Mosaic(networkCurrencyMosaicId, nem2_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility))), nem2_sdk_1.UInt64.fromUint(480), signedTransaction, networkType, nem2_sdk_1.UInt64.fromUint(2000000));
const signedHashLockTransaction = bobAccount.sign(hashLockTransaction, networkGenerationHash);
/* end block 04 */
/* start block 05 */
// replace with node endpoint
const nodeUrl = 'http://api-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp_1.RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new nem2_sdk_1.TransactionService(transactionHttp, receiptHttp);
listener.open().then(() => {
    transactionService.announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener);
    listener.close();
});
/* end block 05 */
