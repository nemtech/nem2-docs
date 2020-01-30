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

package nem2.guides.examples.account;

import io.nem.sdk.api.AccountRepository;
import io.nem.sdk.api.QueryParams;
import io.nem.sdk.api.RepositoryFactory;
import io.nem.sdk.infrastructure.vertx.RepositoryFactoryVertxImpl;
import io.nem.sdk.model.account.PublicAccount;
import io.nem.sdk.model.blockchain.NetworkType;
import io.nem.sdk.model.transaction.Transaction;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.junit.jupiter.api.Test;

class GettingConfirmedTransactions {

    @Test
    void gettingConfirmedTransactions()
        throws ExecutionException, InterruptedException {
        /* start block 01 */
        try (final RepositoryFactory repositoryFactory = new RepositoryFactoryVertxImpl(
            "http://localhost:3000")) {

            final AccountRepository accountRepository = repositoryFactory
                .createAccountRepository();

            final NetworkType networkType = repositoryFactory
                .getNetworkType()
                .toFuture().get();

            // Replace with a public key
            final String publicKey = "1A6B1797FD323FEC48F71CDFE3D181B53D001FC2B56928DBA06C9319722B0FF8";

            final PublicAccount publicAccount = PublicAccount
                .createFromPublicKey(publicKey, networkType);

            // Page size between 10 and 100, otherwise 10
            int pageSize = 20;

//            final List<Transaction> transactions = accountRepository
//                .transactions(publicAccount, new QueryParams(pageSize, null)).toFuture().get();
//
//            System.out.print(transactions);
            /* end block 01 */
        }
    }
}
