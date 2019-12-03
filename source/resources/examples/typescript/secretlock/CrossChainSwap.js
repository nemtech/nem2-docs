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
const js_sha3_1 = require("js-sha3");
const crypto = require("crypto");
/* start block 01 */
const alicePublicChainAccount = nem2_sdk_1.Account.createFromPrivateKey('', nem2_sdk_1.NetworkType.MAIN_NET);
const alicePrivateChainAccount = nem2_sdk_1.Account.createFromPrivateKey('', nem2_sdk_1.NetworkType.MIJIN);
const bobPublicChainAccount = nem2_sdk_1.Account.createFromPrivateKey('', nem2_sdk_1.NetworkType.MAIN_NET);
const bobPrivateChainAccount = nem2_sdk_1.Account.createFromPrivateKey('', nem2_sdk_1.NetworkType.MIJIN);
const privateChainTransactionHttp = new nem2_sdk_1.TransactionHttp('http://localhost:3000');
const publicChainTransactionHttp = new nem2_sdk_1.TransactionHttp('http://localhost:3000');
const publicChainGenerationHash = process.env.NETWORK_GENERATION_HASH;
const privateChainGenerationHash = process.env.NETWORK_GENERATION_HASH;
/* end block 01 */
/* start block 02 */
const random = crypto.randomBytes(10);
const proof = random.toString('hex');
console.log('Proof:', proof);
const hash = js_sha3_1.sha3_256.create();
const secret = hash.update(random).hex().toUpperCase();
console.log('Secret:', secret);
/* end block 02 */
/* start block 03 */
const tx1 = nem2_sdk_1.SecretLockTransaction.create(nem2_sdk_1.Deadline.create(), new nem2_sdk_1.Mosaic(new nem2_sdk_1.MosaicId([520597229, 83226871]), nem2_sdk_1.UInt64.fromUint(10)), nem2_sdk_1.UInt64.fromUint(96 * 3600 / 15), // assuming one block every 15 seconds
nem2_sdk_1.HashType.Op_Sha3_256, secret, bobPrivateChainAccount.address, nem2_sdk_1.NetworkType.MIJIN);
/* end block 03 */
/* start block 04 */
const tx1Signed = alicePrivateChainAccount.sign(tx1, privateChainGenerationHash);
privateChainTransactionHttp
    .announce(tx1Signed)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 04 */
/* start block 05 */
const tx2 = nem2_sdk_1.SecretLockTransaction.create(nem2_sdk_1.Deadline.create(), new nem2_sdk_1.Mosaic(new nem2_sdk_1.MosaicId([2061634929, 1373884888]), nem2_sdk_1.UInt64.fromUint(10)), nem2_sdk_1.UInt64.fromUint(84 * 3600 / 15), // assuming one block every 15 seconds
nem2_sdk_1.HashType.Op_Sha3_256, secret, alicePublicChainAccount.address, nem2_sdk_1.NetworkType.MAIN_NET);
/* end block 05 */
/* start block 06 */
const tx2Signed = bobPublicChainAccount.sign(tx2, publicChainGenerationHash);
publicChainTransactionHttp
    .announce(tx2Signed)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 06 */
/* start block 07 */
const tx3 = nem2_sdk_1.SecretProofTransaction.create(nem2_sdk_1.Deadline.create(), nem2_sdk_1.HashType.Op_Sha3_256, secret, alicePublicChainAccount.address, proof, nem2_sdk_1.NetworkType.MAIN_NET);
const tx3Signed = alicePublicChainAccount.sign(tx3, publicChainGenerationHash);
publicChainTransactionHttp
    .announce(tx3Signed)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 07 */
/* start block 08 */
const tx4 = nem2_sdk_1.SecretProofTransaction.create(nem2_sdk_1.Deadline.create(), nem2_sdk_1.HashType.Op_Sha3_256, secret, bobPrivateChainAccount.address, proof, nem2_sdk_1.NetworkType.MIJIN);
const tx4Signed = bobPrivateChainAccount.sign(tx4, privateChainGenerationHash);
privateChainTransactionHttp
    .announce(tx4Signed)
    .subscribe(x => console.log(x), err => console.error(err));
/* end block 08 */
