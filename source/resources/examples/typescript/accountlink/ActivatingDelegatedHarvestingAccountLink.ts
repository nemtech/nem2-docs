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
// Set network type
const networkType = NetworkType.TEST_NET;
// Main account private key for signing transaction
const mainAccountPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const mainAccount = Account.createFromPrivateKey(mainAccountPrivateKey, networkType);
// Generate a new account as remote account
const remoteAccount = Account.generateNewAccount(networkType);
/* end block 01 */

/* start block 02 */
const accountLinkTransaction = AccountKeyLinkTransaction.create(
    Deadline.create(),
    remoteAccount.publicKey,
    LinkAction.Link,
    networkType,
    UInt64.fromUint(2000000)); // Absolute number
/* end block 02 */

/* start block 03 */
// Replace with any node in the network
const nodeUrl = 'http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000';
// Replace with networkGenerationHashSeed by querying http://<node-url>:3000/node/info
const networkGenerationHash = '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
const signedTransaction = mainAccount.sign(accountLinkTransaction, networkGenerationHash);
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
