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

const nem2Sdk = require("nem2-sdk");
const operators = require('rxjs/operators');
const Account = nem2Sdk.Account,
    Deadline = nem2Sdk.Deadline,
    NetworkType = nem2Sdk.NetworkType,
    TransferTransaction = nem2Sdk.TransferTransaction,
    TransactionHttp = nem2Sdk.TransactionHttp,
    PlainMessage = nem2Sdk.PlainMessage,
    NetworkCurrencyMosaic = nem2Sdk.NetworkCurrencyMosaic,
    AggregateTransaction = nem2Sdk.AggregateTransaction,
    HashLockTransaction = nem2Sdk.HashLockTransaction,
    UInt64 = nem2Sdk.UInt64,
    Listener = nem2Sdk.Listener,
    Address = nem2Sdk.Address,
    PublicAccount = nem2Sdk.PublicAccount,
    filter = operators.filter,
    mergeMap = operators.mergeMap;

const nodeUrl = 'http://localhost:3000';
const transactionHttp = new TransactionHttp(nodeUrl);
const listener = new Listener(nodeUrl);

const cosignatoryPrivateKey = process.env.COSIGNATORY_PRIVATE_KEY;
const cosignatoryAccount = Account.createFromPrivateKey(cosignatoryPrivateKey, NetworkType.MIJIN_TEST);

const multisigAccountPublicKey = process.env.MULTISIG_PUBLIC_KEY;
const multisigAccount = PublicAccount.createFromPublicKey(multisigAccountPublicKey, NetworkType.MIJIN_TEST);

const recipientAddress = Address.createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [NetworkCurrencyMosaic.createRelative(10)],
    PlainMessage.create('sending 10 cat.currency'),
    NetworkType.MIJIN_TEST);

/* start block 01 */
const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [transferTransaction.toAggregate(multisigAccount)],
    NetworkType.MIJIN_TEST);

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH;
const signedTransaction = cosignatoryAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 01 */

/* start block 02 */
const hashLockTransaction = HashLockTransaction.create(
    Deadline.create(),
    NetworkCurrencyMosaic.createRelative(10),
    UInt64.fromUint(480),
    signedTransaction,
    NetworkType.MIJIN_TEST);

const hashLockTransactionSigned = cosignatoryAccount.sign(hashLockTransaction, networkGenerationHash);

listener.open().then(() => {

    transactionHttp
        .announce(hashLockTransactionSigned)
        .subscribe(x => console.log(x), err => console.error(err));

    listener
        .confirmed(cosignatoryAccount.address)
        .pipe(
            filter((transaction) => transaction.transactionInfo !== undefined
                && transaction.transactionInfo.hash === hashLockTransactionSigned.hash),
            mergeMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
        )
        .subscribe(announcedAggregateBonded => console.log(announcedAggregateBonded),
            err => console.error(err));
});
/* end block 02 */
