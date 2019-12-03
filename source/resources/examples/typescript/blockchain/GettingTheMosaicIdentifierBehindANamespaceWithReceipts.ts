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
    Address, BlockHttp,
    Deadline,
    Listener,
    Mosaic,
    NamespaceId,
    NetworkType,
    PlainMessage,
    ReceiptHttp,
    ResolutionEntry,
    ResolutionStatement,
    TransactionHttp,
    TransferTransaction,
    UInt64,
} from 'nem2-sdk';
import {filter, map, mergeMap} from "rxjs/operators";

/* start block 01 */
const aliasedMosaic = new Mosaic(
    new NamespaceId('cat.currency'),
    UInt64.fromUint(1000000)
);
/* end block 01 */

/* start block 02 */
// replace with network type
const networkType = NetworkType.TEST_NET;
const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress('TBULEA-UG2CZQ-ISUR44-2HWA6U-AKGWIX-HDABJV-IPS4'),
    [aliasedMosaic],
    PlainMessage.create('Test aliased mosaic'),
    networkType);

// replace with sender private key
const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = '6C0350A10724FC325A1F06CEFC4CA14464BC472F566842D22418AEE0F8746B4C';
const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 02 */

/* start block 03 */
// replace with node endpoint
const nodeUrl = 'http://api-01.us-east-1.nemtech.network:3000';
const receiptHttp = new ReceiptHttp(nodeUrl);
const transactionHttp = new TransactionHttp(nodeUrl);
const listener = new Listener(nodeUrl);

listener.open().then(() => {

    transactionHttp
        .announce(signedTransaction)
        .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */

/* start block 04 */
    listener
        .confirmed(account.address)
        .pipe(
            // Get the block height where the transaction was included
            filter((transaction) => transaction.transactionInfo !== undefined
                && transaction.transactionInfo.hash === signedTransaction.hash),
            // Get the list of receipts triggered for that block
            mergeMap((transaction) => receiptHttp.getBlockReceipts(transaction.transactionInfo!.height.toString())),
            // Iterate over each resolution statement. Find the resolution for the aliased MosaicId.
            map((receipts) => receipts.mosaicResolutionStatements),
            mergeMap((resolutionStatements) => resolutionStatements),
            filter((resolutionStatement) => resolutionStatement.unresolved instanceof NamespaceId
                && resolutionStatement.unresolved.toHex() === aliasedMosaic.id.toHex())
        )
        .subscribe((resolutionStatement:ResolutionStatement) => {
            resolutionStatement.resolutionEntries.map((entry:ResolutionEntry) => {
                console.log("Resolved MosaicId: ", entry.resolved);
                console.log("PrimaryId: ", entry.source.primaryId);
                console.log("SecondaryId: ", entry.source.secondaryId);
            });
            listener.terminate();
        }, err => console.log(err));
});
/* end block 04 */
