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
// replace with company address
const companyRawAddress = 'TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB';
const companyAddress = nem2_sdk_1.Address.createFromRawAddress(companyRawAddress);
/* end block 01 */
/* start block 02 */
// replace with network type
const networkType = nem2_sdk_1.NetworkType.TEST_NET;
const transaction = nem2_sdk_1.AccountRestrictionTransaction
    .createAddressRestrictionModificationTransaction(nem2_sdk_1.Deadline.create(), nem2_sdk_1.AccountRestrictionFlags.AllowIncomingAddress, [companyAddress], [], networkType, nem2_sdk_1.UInt64.fromUint(2000000));
/* end block 02 */
/* start block 03 */
// replace with product private key
const productPrivateKey = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const productAccount = nem2_sdk_1.Account.createFromPrivateKey(productPrivateKey, networkType);
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const signedTransaction = productAccount.sign(transaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp_1.RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
