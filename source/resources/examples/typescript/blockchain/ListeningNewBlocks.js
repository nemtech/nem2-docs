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
// replace with node url
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new nem2_sdk_1.RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
listener.open().then(() => {
    listener
        .newBlock()
        .subscribe((block) => {
        console.log(block);
        listener.close();
    }, (err) => console.error(err));
});
/* end block 01 */
