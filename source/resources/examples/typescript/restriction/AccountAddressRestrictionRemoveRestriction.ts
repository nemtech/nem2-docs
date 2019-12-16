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
    AccountRestrictionFlags,
    AccountRestrictionTransaction,
    Address,
    Deadline,
    NetworkType,
    TransactionHttp,
} from 'nem2-sdk';

/* start block 01 */
const companyRawAddress = 'TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB';
const companyAddress = Address.createFromRawAddress(companyRawAddress);
/* end block 01 */

/* start block 02 */
// replace with network type
const networkType = NetworkType.TEST_NET;

const transaction = AccountRestrictionTransaction
    .createAddressRestrictionModificationTransaction(
        Deadline.create(),
        AccountRestrictionFlags.AllowIncomingAddress,
        [],
        [companyAddress],
        networkType).setMaxFee(2);
/* end block 02 */

/* start block 03 */
// replace with product private key
const productPrivateKey = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const productAccount = Account.createFromPrivateKey(productPrivateKey, networkType);
const signedTransaction = productAccount.sign(transaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-harvest-20.us-west-1.nemtech.network:3000';
const transactionHttp = new TransactionHttp(nodeUrl);

transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
