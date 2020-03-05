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
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    PlainMessage,
    RepositoryFactoryHttp,
    TransferTransaction,
    UInt64,
} from 'symbol-sdk';

/* start block 01 */
// replace with mosaic id
const mosaicIdHex = '7cdf3b117a3c40cc';
const mosaicId = new MosaicId(mosaicIdHex);
// replace with customer address
const rawAddress = 'TBULEA-UG2CZQ-ISUR44-2HWA6U-AKGWIX-HDABJV-IPS4';
const recipientAddress = Address.createFromRawAddress(rawAddress);
// replace with network type
const networkType = NetworkType.TEST_NET;

const transferTransaction = TransferTransaction.create(
    Deadline.create(),
    recipientAddress,
    [new Mosaic(mosaicId, UInt64.fromUint(1))],
    PlainMessage.create('enjoy your ticket'),
    networkType,
    UInt64.fromUint(2000000));
/* end block 01 */

/* start block 02 */
// replace with ticket vendor private key
const privateKey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = '44D2225B8932C9A96DCB13508CBCDFFA9A9663BFBA2354FEEC8FCFCB7E19846C';
const signedTransaction = account.sign(transferTransaction, networkGenerationHash);
/* end block 02 */

/* start block 03 */
// replace with node endpoint
const nodeUrl = 'http://api-2-01.us-west-1.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);

const transactionHttp = repositoryFactory.createTransactionRepository();

transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
