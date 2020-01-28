import {Account, Deadline, NetworkType, PersistentDelegationRequestTransaction, PublicAccount, UInt64,} from 'nem2-sdk';
import {RepositoryFactoryHttp} from 'nem2-sdk/dist/src/infrastructure/RepositoryFactoryHttp';

/* start block 01 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with private key
const mainAccountPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const mainAccount = Account.createFromPrivateKey(mainAccountPrivateKey, networkType);
const remoteAccount = Account.generateNewAccount(networkType);
// replace with private key
const announcerAccountPrivateKey = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const announcerAccount = Account.createFromPrivateKey(announcerAccountPrivateKey, networkType);
/* end block 01 */

/* start block 02 */
// replace with node publicKey (nodeUrl + '/node/info')
const nodePublicKey = '3A537D5A1AF51158C42F80A199BB58351DBF3253C4A6A1B7BD1014682FB595EA';
const nodePublicAccount = PublicAccount.createFromPublicKey(nodePublicKey, networkType);

const persistentDelegationRequestTransaction = PersistentDelegationRequestTransaction
    .createPersistentDelegationRequestTransaction(
        Deadline.create(),
        remoteAccount.privateKey,
        nodePublicAccount.publicKey,
        announcerAccount.privateKey,
        networkType,
        UInt64.fromUint(2000000));

/* end block 02 */

/* start block 03 */
// replace with meta.generationHash (nodeUrl + '/block/1')
const networkGenerationHash = 'CC42AAD7BD45E8C276741AB2524BC30F5529AF162AD12247EF9A98D6B54A385B';
const signedTransaction = announcerAccount.sign(persistentDelegationRequestTransaction, networkGenerationHash);

// replace with node endpoint
const nodeUrl = 'http://api-xym-harvest-20.us-west-1.nemtech.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl, networkType, networkGenerationHash);
const transactionHttp = repositoryFactory.createTransactionRepository();
transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
