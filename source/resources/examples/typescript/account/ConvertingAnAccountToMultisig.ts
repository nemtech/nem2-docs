/*
 *
 * Copyright 2018 NEM
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

import {
    Account,
    AggregateTransaction,
    Deadline,
    HashLockTransaction,
    Listener,
    ModifyMultisigAccountTransaction,
    Mosaic,
    MosaicId,
    MultisigCosignatoryModification,
    MultisigCosignatoryModificationType,
    NetworkType,
    PublicAccount,
    TransactionHttp,
    UInt64
} from "nem2-sdk";
import {filter, mergeMap} from "rxjs/operators";


//01 - Setup
const nodeUrl = 'http://localhost:3000';
const transactionHttp = new TransactionHttp(nodeUrl);
const listener = new Listener(nodeUrl);

const privateKey = process.env.PRIVATE_KEY as string; // Private key of the account to convert into multisig
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const cosignatory1PublicKey = '7D08373CFFE4154E129E04F0827E5F3D6907587E348757B0F87D2F839BF88246';
const cosignatory1 = PublicAccount.createFromPublicKey(cosignatory1PublicKey, NetworkType.MIJIN_TEST);
const cosignatory2PublicKey = 'F82527075248B043994F1CAFD965F3848324C9ABFEC506BC05FBCF5DD7307C9D';
const cosignatory2 = PublicAccount.createFromPublicKey(cosignatory2PublicKey, NetworkType.MIJIN_TEST);

//02 - Create ModifyMultisigAccountTransaction
const convertIntoMultisigTransaction = ModifyMultisigAccountTransaction.create(
    Deadline.create(),
    1,
    1,
    [
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory1,
        ),
        new MultisigCosignatoryModification(
            MultisigCosignatoryModificationType.Add,
            cosignatory2,
        )],
    NetworkType.MIJIN_TEST);

// 03 - Create and sign the AggregateTransaction.
const aggregateTransaction = AggregateTransaction.createBonded(
    Deadline.create(),
    [convertIntoMultisigTransaction.toAggregate(account.publicAccount)],
    NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(aggregateTransaction);
console.log(signedTransaction.hash);

// 04 - Announce transaction
const hashLockTransaction = HashLockTransaction.create(
    Deadline.create(),
    new Mosaic(
        new MosaicId('0dc67fbe1cad29e3'), // Replace with your network currency mosaic id
        UInt64.fromUint(10000000)
    ),
    UInt64.fromUint(480),
    signedTransaction,
    NetworkType.MIJIN_TEST);

const hashLockTransactionSigned = account.sign(hashLockTransaction);

listener.open().then(() => {

    transactionHttp
        .announce(hashLockTransactionSigned)
        .subscribe(x => console.log(x), err => console.error(err));

    listener
        .confirmed(account.address)
        .pipe(
            filter((transaction) => transaction.transactionInfo !== undefined
                && transaction.transactionInfo.hash === hashLockTransactionSigned.hash),
            mergeMap(ignored => transactionHttp.announceAggregateBonded(signedTransaction))
        )
        .subscribe(announcedAggregateBonded => console.log(announcedAggregateBonded),
            err => console.error(err));
});
