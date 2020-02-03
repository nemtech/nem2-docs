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
// replace with network type
const networkType = nem2_sdk_1.NetworkType.TEST_NET;
// replace with private key
const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
const account = nem2_sdk_1.Account.createFromPrivateKey(privateKey, networkType);
// replace with duration (in blocks)
const duration = nem2_sdk_1.UInt64.fromUint(0);
// replace with custom mosaic flags
const isSupplyMutable = true;
const isTransferable = true;
const isRestrictable = true;
// replace with custom divisibility
const divisibility = 0;
const nonce = nem2_sdk_1.MosaicNonce.createRandom();
const mosaicDefinitionTransaction = nem2_sdk_1.MosaicDefinitionTransaction.create(nem2_sdk_1.Deadline.create(), nonce, nem2_sdk_1.MosaicId.createFromNonce(nonce, account.publicAccount), nem2_sdk_1.MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable), divisibility, duration, networkType);
/* end block 01 */
/* start block 02 */
const mosaicSupplyChangeTransaction = nem2_sdk_1.MosaicSupplyChangeTransaction.create(nem2_sdk_1.Deadline.create(), mosaicDefinitionTransaction.mosaicId, nem2_sdk_1.MosaicSupplyChangeAction.Increase, nem2_sdk_1.UInt64.fromUint(1000000), networkType);
/* end block 02 */
/* start block 03 */
const aggregateTransaction = nem2_sdk_1.AggregateTransaction.createComplete(nem2_sdk_1.Deadline.create(), [
    mosaicDefinitionTransaction.toAggregate(account.publicAccount),
    mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)
], networkType, [], nem2_sdk_1.UInt64.fromUint(2000000));
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = '45870419226A7E51D61D94AD728231EDC6C9B3086EF9255A8421A4F26870456A';
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-3-01.us-west-2.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp_1.RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
