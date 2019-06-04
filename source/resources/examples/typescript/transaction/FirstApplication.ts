/*
 *
 * Copyright 2019 NEM
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
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64,
} from 'nem2-sdk';

/* start block 01 */
const mosaicId = process.env.MOSAIC_ID as string;
const address = process.env.ADDRESS as string;

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    Address.createFromRawAddress(address),
    [new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(1))],
    PlainMessage.create('enjoy your ticket!'),
    NetworkType.MIJIN_TEST
);
/* end block 01 */

/* start block 02 */
const privateKey = process.env.PRIVATE_KEY as string;
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH as string;

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);
const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 02 */

/* start block 03 */
const transactionHttp = new TransactionHttp('http://localhost:3000');

transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */
