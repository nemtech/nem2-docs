import {Account, AccountLinkTransaction, Deadline, LinkAction, NetworkType, UInt64} from 'nem2-sdk';
import {RepositoryFactoryHttp} from 'nem2-sdk/dist/src/infrastructure/RepositoryFactoryHttp';

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
const accountLinkTransaction = AccountLinkTransaction.create(
    Deadline.create(),
    remoteAccount.publicKey,
    LinkAction.Link,
    networkType,
    UInt64.fromUint(2000000));
/* end block 02 */

/* start block 03 */
// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const transactionHttp = repositoryFactory.createTransactionRepository();
const signedTransaction = mainAccount.sign(accountLinkTransaction, networkGenerationHash);
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
