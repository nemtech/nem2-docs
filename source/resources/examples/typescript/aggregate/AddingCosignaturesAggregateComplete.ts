import { Account, AggregateTransaction, CosignatureSignedTransaction, CosignatureTransaction, Deadline, Mosaic, NamespaceId, NetworkCurrencyPublic, NetworkType, PlainMessage, PublicAccount, RepositoryFactoryHttp, TransactionMapping, TransferTransaction, UInt64 } from 'symbol-sdk';

const networkType = NetworkType.TEST_NET;

// replace with alice private key
const alicePrivatekey = '';
const aliceAccount =  Account.createFromPrivateKey(alicePrivatekey, networkType);

// replace with bob public key
const bobPublicKey = '';
const bobPublicAccount = PublicAccount.createFromPublicKey(bobPublicKey, networkType);

const aliceTransferTransaction = TransferTransaction.create(
    Deadline.create(),
    bobPublicAccount.address,
    [NetworkCurrencyPublic.createRelative(100)],
    PlainMessage.create('payout'),
    networkType,
);

const bobTransferTransaction = TransferTransaction.create(
    Deadline.create(),
    aliceAccount.address,
    [new Mosaic(new NamespaceId('collectible'), UInt64.fromHex('1'))],
    PlainMessage.create('payout'),
    networkType,
);

const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [aliceTransferTransaction.toAggregate(aliceAccount.publicAccount), bobTransferTransaction.toAggregate(bobPublicKey)],
    networkType,
    [],
    UInt64.fromUint(2000000),
);
