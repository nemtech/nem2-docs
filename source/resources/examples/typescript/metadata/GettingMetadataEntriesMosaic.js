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
const mosaicIdHex = process.env.MOSAIC_ID;
const mosaicId = new nem2_sdk_1.MosaicId(mosaicIdHex);
const metadataHttp = new nem2_sdk_1.MetadataHttp('http://localhost:3000');
metadataHttp.getMosaicMetadata(mosaicId)
    .subscribe((metadata) => {
    if (metadata.length > 0) {
        metadata
            .map((entry) => {
            const metadataEntry = entry.metadataEntry;
            console.log('\n \n' + 'Key:\t', metadataEntry.scopedMetadataKey);
            console.log('\n' + '---');
            console.log('\n' + 'Value:\t', metadataEntry.value);
            console.log('\n' + 'Sender Public Key:\t', metadataEntry.senderPublicKey);
            console.log('\n' + 'Scoped Metadata Key:\t', metadataEntry.targetPublicKey);
            console.log('\n' + 'TargetId:\t', metadataEntry.targetId);
        });
    }
    else {
        console.log('\n The mosaic does not have metadata entries assigned.');
    }
}, (err) => console.log(err));
/* end block 01 */
