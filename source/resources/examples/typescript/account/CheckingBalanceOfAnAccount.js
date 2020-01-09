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
const operators_1 = require("rxjs/operators");
/* start block 01 */
// replace with account address
const rawAddress = 'TBULEA-UG2CZQ-ISUR44-2HWA6U-AKGWIX-HDABJV-IPS4';
const address = nem2_sdk_1.Address.createFromRawAddress(rawAddress);
// replace with node endpoint
const nodeUrl = 'http://api-harvest-20.us-west-1.nemtech.network:3000';
const accountHttp = new nem2_sdk_1.AccountHttp(nodeUrl);
const mosaicHttp = new nem2_sdk_1.MosaicHttp(nodeUrl);
const mosaicService = new nem2_sdk_1.MosaicService(accountHttp, mosaicHttp);
mosaicService
    .mosaicsAmountViewFromAddress(address)
    .pipe(operators_1.mergeMap((_) => _))
    .subscribe((mosaic) => console.log('You have', mosaic.relativeAmount(), mosaic.fullName()), (err) => console.error(err));
/* end block 01 */
