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
    MosaicId,
    MosaicDefinitionTransaction,
    MosaicProperties,
    MosaicSupplyChangeTransaction,
    MosaicSupplyType,
    MosaicNonce,
    NetworkType,
    TransactionHttp,
    UInt64
} from 'nem2-sdk';

/* start block 01 */
const transactionHttp = new TransactionHttp('http://localhost:3000');
const privateKey = process.env.PRIVATE_KEY as string;
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const nonce = MosaicNonce.createRandom();
const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    nonce,
    MosaicId.createFromNonce(nonce, account.publicAccount),
    MosaicProperties.create({
        supplyMutable: true,
        transferable: true,
        divisibility: 0,
        duration: UInt64.fromUint(1000)
    }),
    NetworkType.MIJIN_TEST);
/* end block 01 */

/* start block 02 */
const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    mosaicDefinitionTransaction.mosaicId,
    MosaicSupplyType.Increase,
    UInt64.fromUint(1000000),
    NetworkType.MIJIN_TEST);
/* end block 02 */

/* start block 03 */
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)
    ],
    NetworkType.MIJIN_TEST,
    []);

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH as string;
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);

transactionHttp
    .announce(signedTransaction)
    .subscribe(x=> console.log(x),err => console.error(err));
/* end block 03 */
