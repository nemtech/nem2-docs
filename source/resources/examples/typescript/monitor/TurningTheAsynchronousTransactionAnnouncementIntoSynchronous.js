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
/* start block 01 */
// replace with recipient address
const rawRecipientAddress = '462EE976890916E54FA825D26BDD0235F5EB5B6A143C199AB0AE5EE9328E08CE';
const recipientAddress = nem2_sdk_1.Address.createFromRawAddress(rawRecipientAddress);
// replace with network type
const networkType = nem2_sdk_1.NetworkType.MIJIN_TEST;
// replace with nem.xem id
const networkCurrencyMosaicId = new nem2_sdk_1.MosaicId('75AF035421401EF0');
// replace with network currency divisibility
const networkCurrencyDivisibility = 6;
const transferTransaction = nem2_sdk_1.TransferTransaction.create(nem2_sdk_1.Deadline.create(), recipientAddress, [new nem2_sdk_1.Mosaic(networkCurrencyMosaicId, nem2_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility)))], nem2_sdk_1.EmptyMessage, networkType);
// replace with sender private key
const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
const account = nem2_sdk_1.Account.createFromPrivateKey(privateKey, networkType);
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 01 */
/* start block 02 */
const transactionHttp = new nem2_sdk_1.TransactionHttp('http://0.0.0.0:9000');
transactionHttp
    .announceSync(signedTransaction)
    .subscribe((x) => {
    console.log(x);
    // TODO: send email to recipient
}, (err) => console.error(err));
/* end block 02 */
