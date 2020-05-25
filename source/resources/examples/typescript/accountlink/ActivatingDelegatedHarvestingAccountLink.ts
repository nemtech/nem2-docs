import {
    Account,
    AccountKeyLinkTransaction,
    Deadline,
    LinkAction,
    NetworkType,
    RepositoryFactoryHttp,
    UInt64,
} from 'symbol-sdk';

/* start block 01 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with private key
const mainAccountPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const mainAccount = Account.createFromPrivateKey(mainAccountPrivateKey, networkType);
// replace with remote account
const remoteAccount = Account.generateNewAccount(networkType);
/* end block 01 */

/* start block 02 */
const accountLinkTransaction = AccountKeyLinkTransaction.create(
    Deadline.create(),
    remoteAccount.publicKey,
    LinkAction.Link,
    networkType,
    UInt64.fromUint(2000000));
/* end block 02 */

/* start block 03 */
// replace with node endpoint
const nodeUrl = 'http://api-01.ap-northeast-1.testnet-0951-v1.symboldev.network:3000';
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
const signedTransaction = mainAccount.sign(accountLinkTransaction, networkGenerationHash);
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
