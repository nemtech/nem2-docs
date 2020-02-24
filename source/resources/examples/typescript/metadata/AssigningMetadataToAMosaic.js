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
/* start block 01 */
// replace with network type
const networkType = nem2_sdk_1.NetworkType.TEST_NET;
// replace with company private key
const companyPrivateKey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const companyAccount = nem2_sdk_1.Account.createFromPrivateKey(companyPrivateKey, networkType);
// replace with mosaic id
const mosaicId = new nem2_sdk_1.NamespaceId('cc.shares');
const isin = 'US00000000';
const isinMetadataTransaction = nem2_sdk_1.MosaicMetadataTransaction.create(nem2_sdk_1.Deadline.create(), companyAccount.publicKey, nem2_sdk_1.KeyGenerator.generateUInt64Key('ISIN'), mosaicId, isin.length, isin, networkType);
/* end block 01 */
/* start block 02 */
const name = 'ComfyClothingCompany';
const nameMetadataTransaction = nem2_sdk_1.MosaicMetadataTransaction.create(nem2_sdk_1.Deadline.create(), companyAccount.publicKey, nem2_sdk_1.KeyGenerator.generateUInt64Key('NAME'), mosaicId, name.length, name, networkType);
/* end block 02 */
/* start block 03 */
const aggregateTransaction = nem2_sdk_1.AggregateTransaction.createComplete(nem2_sdk_1.Deadline.create(), [isinMetadataTransaction.toAggregate(companyAccount.publicAccount),
    nameMetadataTransaction.toAggregate(companyAccount.publicAccount)], networkType, [], nem2_sdk_1.UInt64.fromUint(2000000));
/* end block 03 */
/* start block 04 */
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = '45870419226A7E51D61D94AD728231EDC6C9B3086EF9255A8421A4F26870456A';
const signedTransaction = companyAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-3-01.us-west-2.nemtech.network:3000';
const repositoryFactory = new nem2_sdk_1.RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 04 */
