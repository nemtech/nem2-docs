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
    Deadline,
    MosaicDefinitionTransaction, MosaicFlags,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    MosaicNonce,
    MosaicRestrictionType,
    NetworkType,
    TransactionHttp,
    UInt64
} from 'nem2-sdk';

/* start block 01 */
const mosaicIdHexa = process.env.MOSAIC_ID as string;
const mosaicId = new MosaicId(mosaicIdHexa);

const privateKey = process.env.PRIVATE_KEY as string;
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);

const mosaicNonce = MosaicNonce.createRandom();
const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    mosaicNonce,
    MosaicId.createFromNonce(mosaicNonce, account.publicAccount),
    MosaicFlags.create(true, true, true),
    0,
    UInt64.fromUint(1000),
    NetworkType.MIJIN_TEST);

const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction
    .create(
        Deadline.create(),
        mosaicId, // mosaicId
        mosaicDefinitionTransaction.mosaicId, // referenceMosaicId
        UInt64.fromHex('1FE'), // restrictionKey
        UInt64.fromUint(0), // previousRestrictionValue
        MosaicRestrictionType.NONE, // previousRestrictionType
        UInt64.fromUint(1), // newRestrictionValue
        MosaicRestrictionType.EQ, // newRestrictionType
        NetworkType.MIJIN_TEST);

const networkGenerationHash = process.env.NETWORK_GENERATION_HASH as string;

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicGlobalRestrictionTransaction.toAggregate(account.publicAccount)],
    NetworkType.MIJIN_TEST,
    []
);
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);

const transactionHttp = new TransactionHttp('http://localhost:3000');
transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 01 */
