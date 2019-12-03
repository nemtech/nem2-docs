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
const key = nem2_sdk_1.KeyGenerator.generateUInt64Key('CERT');
/* end block 01 */
/* start block 02 */
const alicePublicKey = process.env.ALICE_PUBLIC_KEY;
const alicePublicAccount = nem2_sdk_1.PublicAccount.createFromPublicKey(alicePublicKey, nem2_sdk_1.NetworkType.MIJIN_TEST);
const value = '123456';
const accountMetadataTransaction = nem2_sdk_1.AccountMetadataTransaction.create(nem2_sdk_1.Deadline.create(), alicePublicAccount.publicKey, key, value.length, value, nem2_sdk_1.NetworkType.MIJIN_TEST);
/* end block 02 */
/* start block 03 */
const bobPrivateKey = process.env.BOB_PRIVATE_KEY;
const bobAccount = nem2_sdk_1.Account.createFromPrivateKey(bobPrivateKey, nem2_sdk_1.NetworkType.MIJIN_TEST);
const aggregateTransaction = nem2_sdk_1.AggregateTransaction.createBonded(nem2_sdk_1.Deadline.create(), [accountMetadataTransaction.toAggregate(bobAccount.publicAccount)], nem2_sdk_1.NetworkType.MIJIN_TEST);
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;
const signedTransaction = bobAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 03 */
/* start block 04 */
const hashLockTransaction = nem2_sdk_1.HashLockTransaction.create(nem2_sdk_1.Deadline.create(), nem2_sdk_1.NetworkCurrencyMosaic.createRelative(10), nem2_sdk_1.UInt64.fromUint(480), signedTransaction, nem2_sdk_1.NetworkType.MIJIN_TEST);
const signedHashLockTransaction = bobAccount.sign(hashLockTransaction, networkGenerationHash);
/* end block 04 */
/* start block 05 */
const nodeUrl = 'http://localhost:3000';
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
