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
    Deadline,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    MosaicRestrictionType,
    NamespaceMosaicIdGenerator,
    NetworkType,
    TransactionHttp,
    UInt64
} from 'nem2-sdk';

/* start block 01 */
const mosaicIdHexa = process.env.MOSAIC_ID as string;
const mosaicId = new MosaicId(mosaicIdHexa);
const referenceMosaicIdHexa = process.env.REFERENCE_MOSAIC_ID as string;
const referenceMosaicId = new MosaicId(referenceMosaicIdHexa);
/* end block 01 */

/* start block 02 */
const transaction = MosaicGlobalRestrictionTransaction
    .create(
        Deadline.create(),
        mosaicId,
        referenceMosaicId,
        new UInt64(NamespaceMosaicIdGenerator.namespaceId('Is_Verified')), //restictionKey
        UInt64.fromUint(0),
        MosaicRestrictionType.NONE,
        UInt64.fromUint(2),
        MosaicRestrictionType.EQ,
        NetworkType.MIJIN_TEST);
/* end block 02 */

/* start block 03 */
const privateKey = process.env.PRIVATE_KEY as string;
const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
const networkGenerationHash = process.env.NETWORK_GENERATION_HASH as string;
const signedTransaction = account.sign(transaction, networkGenerationHash);
console.log(signedTransaction.hash);

const transactionHttp = new TransactionHttp('http://localhost:3000');
transactionHttp
    .announce(signedTransaction)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 03 */
