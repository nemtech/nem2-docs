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
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
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
const aggregateTransaction = nem2_sdk_1.AggregateTransaction.createBonded(nem2_sdk_1.Deadline.create(), [accountMetadataTransaction.toAggregate(bobAccount.publicAccount)], networkType);
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = '6C0350A10724FC325A1F06CEFC4CA14464BC472F566842D22418AEE0F8746B4C';
const signedTransaction = bobAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 03 */
/* start block 04 */
const hashLockTransaction = nem2_sdk_1.HashLockTransaction.create(nem2_sdk_1.Deadline.create(), nem2_sdk_1.NetworkCurrencyMosaic.createRelative(10), nem2_sdk_1.UInt64.fromUint(480), signedTransaction, networkType);
const signedHashLockTransaction = bobAccount.sign(hashLockTransaction, networkGenerationHash);
/* end block 04 */
/* start block 05 */
// replace with node endpoint
const nodeUrl = 'http://api-01.us-east-1.nemtech.network:3000';
const transactionHttp = new nem2_sdk_1.TransactionHttp(nodeUrl);
const listener = new nem2_sdk_1.Listener(nodeUrl);
const announceHashLockTransaction = (signedHashLockTransaction) => {
    return transactionHttp.announce(signedHashLockTransaction);
};
const announceAggregateTransaction = (listener, signedHashLockTransaction, signedAggregateTransaction, senderAddress) => {
    return listener
        .confirmed(senderAddress)
        .pipe(operators_1.filter((transaction) => transaction.transactionInfo !== undefined
        && transaction.transactionInfo.hash === signedHashLockTransaction.hash), operators_1.mergeMap(ignored => {
        listener.terminate();
        return transactionHttp.announceAggregateBonded(signedAggregateTransaction);
    }));
};
listener.open().then(() => {
    rxjs_1.merge(announceHashLockTransaction(signedHashLockTransaction), announceAggregateTransaction(listener, signedHashLockTransaction, signedTransaction, bobAccount.address))
        .subscribe(x => console.log('Transaction confirmed:', x.message), err => console.log(err));
});
/* end block 05 */