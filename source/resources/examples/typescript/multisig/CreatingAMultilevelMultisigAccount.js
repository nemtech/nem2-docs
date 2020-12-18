'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
const symbol_sdk_1 = require('symbol-sdk');
/* start block 01 */
// replace with network type
const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// replace with private key
const multisig2PrivateKey =
  'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const multisigAccount2 = symbol_sdk_1.Account.createFromPrivateKey(
  multisig2PrivateKey,
  networkType,
);
// replace with public key
const cosignatoryAccount5PublicKey =
  '17E42BDF5B7FF5001DC96A262A1141FFBE3F09A3A45DE7C095AAEA14F45C0DA0';
const cosignatory5 = symbol_sdk_1.PublicAccount.createFromPublicKey(
  cosignatoryAccount5PublicKey,
  networkType,
);
// replace with public key
const cosignatoryAccount6PublicKey =
  'D04AB232742BB4AB3A1368BD4615E4E6D0224AB71A016BAF8520A332C9778737';
const cosignatory6 = symbol_sdk_1.PublicAccount.createFromPublicKey(
  cosignatoryAccount6PublicKey,
  networkType,
);
const convertMultisigAccount2Transaction = symbol_sdk_1.MultisigAccountModificationTransaction.create(
  symbol_sdk_1.Deadline.create(),
  1,
  1,
  [cosignatory5.address, cosignatory6.address],
  [],
  networkType,
);
/* end block 01 */
/* start block 02 */
// replace with private key
const multisig3PrivateKey =
  '1111111111111111111111111111111111111111111111111111111111111111';
const multisigAccount3 = symbol_sdk_1.Account.createFromPrivateKey(
  multisig3PrivateKey,
  networkType,
);
// replace with public key
const cosignatoryAccount7PublicKey =
  '38C22255DE39952C5D18803EC305A888D5DDE2C59BF3D4EFFAE6FC5FFCBF4F5D';
const cosignatory7 = symbol_sdk_1.PublicAccount.createFromPublicKey(
  cosignatoryAccount7PublicKey,
  networkType,
);
// replace with public key
const cosignatoryAccount8PublicKey =
  '9F784BF20318AE3CA6246C0EC2207FE095FFF7A84B6787E7E3C2CE4C3B92A2EA';
const cosignatory8 = symbol_sdk_1.PublicAccount.createFromPublicKey(
  cosignatoryAccount8PublicKey,
  networkType,
);
// replace with public key
const cosignatoryAccount4PublicKey =
  'EB2B065D27C6A6FB322F2E568E1AAD9CD6C0F155675E2837058D4811F5C0247D';
const cosignatory4 = symbol_sdk_1.PublicAccount.createFromPublicKey(
  cosignatoryAccount4PublicKey,
  networkType,
);
const convertMultisigAccount3Transaction = symbol_sdk_1.MultisigAccountModificationTransaction.create(
  symbol_sdk_1.Deadline.create(),
  2,
  1,
  [cosignatory7.address, cosignatory8.address, cosignatory4.address],
  [],
  networkType,
);
/* end block 02 */
/* start block 03 */
// replace with private key
const multisig1PrivateKey =
  '0000000000000000000000000000000000000000000000000000000000000000';
const multisigAccount1 = symbol_sdk_1.Account.createFromPrivateKey(
  multisig1PrivateKey,
  networkType,
);
const convertMultisigAccount1Transaction = symbol_sdk_1.MultisigAccountModificationTransaction.create(
  symbol_sdk_1.Deadline.create(),
  3,
  1,
  [
    multisigAccount2.publicAccount.address,
    multisigAccount3.publicAccount.address,
    cosignatory4.address,
  ],
  [],
  networkType,
);
/* end block 03 */
/* start block 04 */
const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createBonded(
  symbol_sdk_1.Deadline.create(),
  [
    convertMultisigAccount2Transaction.toAggregate(
      multisigAccount2.publicAccount,
    ),
    convertMultisigAccount3Transaction.toAggregate(
      multisigAccount3.publicAccount,
    ),
    convertMultisigAccount1Transaction.toAggregate(
      multisigAccount1.publicAccount,
    ),
  ],
  networkType,
  [],
  symbol_sdk_1.UInt64.fromUint(2000000),
);
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash =
  '1DFB2FAA9E7F054168B0C5FCB84F4DEB62CC2B4D317D861F3168D161F54EA78B';
const signedTransaction = multisigAccount1.sign(
  aggregateTransaction,
  networkGenerationHash,
);
console.log(signedTransaction.hash);
// replace with symbol.xym id
const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('5E62990DCAC5BE8A');
// replace with network currency divisibility
const networkCurrencyDivisibility = 6;
const hashLockTransaction = symbol_sdk_1.HashLockTransaction.create(
  symbol_sdk_1.Deadline.create(),
  new symbol_sdk_1.Mosaic(
    networkCurrencyMosaicId,
    symbol_sdk_1.UInt64.fromUint(
      10 * Math.pow(10, networkCurrencyDivisibility),
    ),
  ),
  symbol_sdk_1.UInt64.fromUint(480),
  signedTransaction,
  networkType,
  symbol_sdk_1.UInt64.fromUint(2000000),
);
const signedHashLockTransaction = multisigAccount1.sign(
  hashLockTransaction,
  networkGenerationHash,
);
// replace with node endpoint
const nodeUrl = 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new symbol_sdk_1.TransactionService(
  transactionHttp,
  receiptHttp,
);
listener.open().then(() => {
  transactionService
    .announceHashLockAggregateBonded(
      signedHashLockTransaction,
      signedTransaction,
      listener,
    )
    .subscribe(
      (x) => console.log(x),
      (err) => console.log(err),
      () => listener.close(),
    );
});
/* end block 04 */
