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
/* start block 01 */
const validTransaction = (transaction, publicAccount) => {
    return transaction instanceof nem2_sdk_1.TransferTransaction &&
        transaction.signer.equals(publicAccount) &&
        transaction.mosaics.length == 1 &&
        transaction.mosaics[0].id.equals(nem2_sdk_1.NetworkCurrencyMosaic.NAMESPACE_ID) &&
        transaction.mosaics[0].amount.compact() < nem2_sdk_1.NetworkCurrencyMosaic.createRelative(100).amount.compact();
};
const cosignAggregateBondedTransaction = (transaction, account) => {
    const cosignatureTransaction = nem2_sdk_1.CosignatureTransaction.create(transaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
};
const privateKey = process.env.PRIVATE_KEY;
const account = nem2_sdk_1.Account.createFromPrivateKey(privateKey, nem2_sdk_1.NetworkType.MIJIN_TEST);
const nodeUrl = 'http://localhost:3000';
const transactionHttp = new nem2_sdk_1.TransactionHttp(nodeUrl);
const listener = new nem2_sdk_1.Listener(nodeUrl);
listener.open().then(() => {
    listener
        .aggregateBondedAdded(account.address)
        .pipe(operators_1.filter((_) => _.innerTransactions.length == 2), operators_1.filter((_) => !_.signedByAccount(account.publicAccount)), operators_1.filter((_) => validTransaction(_.innerTransactions[0], account.publicAccount) || validTransaction(_.innerTransactions[1], account.publicAccount)), operators_1.map(transaction => cosignAggregateBondedTransaction(transaction, account)), operators_1.mergeMap(signedCosignatureTransaction => transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction)))
        .subscribe(announcedTransaction => console.log(announcedTransaction), err => console.error(err));
});
/* end block 01 */
