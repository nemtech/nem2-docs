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

import {
    Account,
    AggregateTransaction,
    CosignatureSignedTransaction,
    CosignatureTransaction,
    NetworkType,
    RepositoryFactoryHttp,
} from 'nem2-sdk';

import {filter, map, mergeMap} from 'rxjs/operators';

/* start block 01 */
const cosignAggregateBondedTransaction = (transaction: AggregateTransaction, account: Account): CosignatureSignedTransaction => {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    return account.signCosignatureTransaction(cosignatureTransaction);
};
/* end block 01 */

/* start block 02 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with private key
const privateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl, networkType);
const transactionHttp = repositoryFactory.createTransactionRepository();
const listener = repositoryFactory.createListener();

listener.open().then(() => {
    listener
        .aggregateBondedAdded(account.address)
        .pipe(
            filter((_) => !_.signedByAccount(account.publicAccount)),
            map((transaction) => cosignAggregateBondedTransaction(transaction, account)),
            mergeMap((signedCosignatureTransaction) => {
                listener.close();
                return transactionHttp.announceAggregateBondedCosignature(signedCosignatureTransaction);
            }),
        )
        .subscribe((announcedTransaction) => {
            console.log(announcedTransaction);
            listener.close();
        }, (err) => console.error(err));
});
/* end block 02 */
