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
const operators_1 = require("rxjs/operators");
/* start block 01 */
// replace with network type
const networkType = nem2_sdk_1.NetworkType.TEST_NET;
// replace with certificate private key
const certificatePrivateKey = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const certificateAccount = nem2_sdk_1.Account.createFromPrivateKey(certificatePrivateKey, networkType);
// replace with alice public key
const alicePublicKey = 'E59EF184A612D4C3C4D89B5950EB57262C69862B2F96E59C5043BF41765C482F';
const alicePublicAccount = nem2_sdk_1.PublicAccount.createFromPublicKey(alicePublicKey, networkType);
// replace with node endpoint
const nodeUrl = 'http://api-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp_1.RepositoryFactoryHttp(nodeUrl, networkType);
const transactionHttp = repositoryFactory.createTransactionRepository();
// replace with transaction hash
const transactionHash = '0000000000000000000000000000000000000000000000000000000000000000';
transactionHttp
    .getTransaction(transactionHash)
    .pipe(operators_1.map((x) => x))
    .subscribe((transaction) => {
    console.log('Raw message: ', transaction.message.payload);
    console.log('Message: ', certificateAccount.decryptMessage(transaction.message, alicePublicAccount, networkType).payload);
}, ((err) => console.log(err)));
/* end block 01 */
