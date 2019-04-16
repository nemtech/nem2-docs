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

const nem2Sdk = require("nem2-sdk");
const Account = nem2Sdk.Account,
    Deadline = nem2Sdk.Deadline,
    NetworkType = nem2Sdk.NetworkType,
    TransferTransaction = nem2Sdk.TransferTransaction,
    TransactionHttp = nem2Sdk.TransactionHttp,
    PlainMessage = nem2Sdk.PlainMessage,
    Mosaic = nem2Sdk.Mosaic,
    MosaicId = nem2Sdk.MosaicId,
    Address = nem2Sdk. Address,
    UInt64 = nem2Sdk.UInt64,
    NetworkCurrencyMosaic = nem2Sdk.NetworkCurrencyMosaic;

// 01 - Create Transfer Transaction
const recipientAddress = Address.createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    /* start block 01 */
    [new Mosaic( new MosaicId('7cdf3b117a3c40cc'), UInt64.fromUint(1000)),
        NetworkCurrencyMosaic.createRelative(10)],
    /* end block 01 */
    PlainMessage.create('Welcome To NEM'),
    NetworkType.MIJIN_TEST);

// 02 - Signing the transaction
const privateKey = process.env.PRIVATE_KEY;

const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

const signedTransaction = account.sign(transferTransaction);

// 03 - Announcing the transaction
const transactionHttp = new TransactionHttp('http://localhost:3000');

transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
