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
    KeyGenerator,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicGlobalRestrictionTransaction,
    MosaicId,
    MosaicNonce,
    MosaicRestrictionType,
    NetworkType,
    UInt64,
} from 'nem2-sdk';
import {RepositoryFactoryHttp} from 'nem2-sdk/dist/src/infrastructure/RepositoryFactoryHttp';

/* start block 01 */
const networkType = NetworkType.TEST_NET;
// replace with kyc provider private key
const kycProviderPrivateKey = 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
const kycProviderAccount = Account.createFromPrivateKey(kycProviderPrivateKey, networkType);

// Define KYC Mosaic Id
const mosaicNonce = MosaicNonce.createRandom();
const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    mosaicNonce,
    MosaicId.createFromNonce(mosaicNonce, kycProviderAccount.publicAccount),
    MosaicFlags.create(true, true, true),
    0,
    UInt64.fromUint(0),
    networkType);
console.log('KYC MosaicId:', mosaicDefinitionTransaction.mosaicId.toHex());

// Define Mosaic global restriction Is_Verified = 1
const key = KeyGenerator.generateUInt64Key('IsVerified'.toLowerCase());
const mosaicGlobalRestrictionTransaction = MosaicGlobalRestrictionTransaction
    .create(
        Deadline.create(),
        mosaicDefinitionTransaction.mosaicId, // mosaicId
        key, // restictionKey
        UInt64.fromUint(0), // previousRestrictionValue
        MosaicRestrictionType.NONE, // previousRestrictionType
        UInt64.fromUint(1), // newRestrictionValue
        MosaicRestrictionType.EQ, // newRestrictionType
        networkType);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        mosaicDefinitionTransaction.toAggregate(kycProviderAccount.publicAccount),
        mosaicGlobalRestrictionTransaction.toAggregate(kycProviderAccount.publicAccount)],
    networkType,
    [],
    UInt64.fromUint(2000000));
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const signedTransaction = kycProviderAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const transactionHttp = repositoryFactory.createTransactionRepository();

transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 01 */
