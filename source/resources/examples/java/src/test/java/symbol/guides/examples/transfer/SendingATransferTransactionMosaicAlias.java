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

package symbol.guides.examples.transfer;

import io.nem.symbol.sdk.api.RepositoryFactory;
import io.nem.symbol.sdk.infrastructure.vertx.RepositoryFactoryVertxImpl;
import io.nem.symbol.sdk.model.account.Account;
import io.nem.symbol.sdk.model.blockchain.NetworkType;
import io.nem.symbol.sdk.model.message.PlainMessage;
import io.nem.symbol.sdk.model.mosaic.Mosaic;
import io.nem.symbol.sdk.model.namespace.NamespaceId;
import io.nem.symbol.sdk.model.transaction.TransferTransactionFactory;
import org.junit.jupiter.api.Test;

import java.math.BigInteger;
import java.util.Collections;
import java.util.concurrent.ExecutionException;

class SendingATransferTransactionMosaicAlias {

    @Test
    void sendingATransferTransactionMosaicAlias()
            throws ExecutionException, InterruptedException {
        // replace with node endpoint
        try (final RepositoryFactory repositoryFactory = new RepositoryFactoryVertxImpl(
                "http://api-xym-harvest-3-01.us-west-2.nemtech.network:3000")) {
            /* start block 01 */
            final NetworkType networkType = repositoryFactory.getNetworkType().toFuture().get();
            // replace with aliased mosaic
            final String namespaceName = "foo";
            final NamespaceId mosaicId = NamespaceId.createFromName(namespaceName);

            TransferTransactionFactory
                    .create(
                            networkType,
                            Account.generateNewAccount(networkType).getAddress(),
                            Collections.singletonList(
                                    new Mosaic(mosaicId, BigInteger.valueOf(10000000))),
                            PlainMessage.Empty)
                    .maxFee(BigInteger.valueOf(2000000)).build();
            /* end block 01 */
        }
    }
}

