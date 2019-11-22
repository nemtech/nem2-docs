###########
Transaction
###########

A transaction generally represents a unit of work within a database system. In the case of blockchain, that is when an action signed by an :doc:`account <account>` changes its state.

*****************
Transaction types
*****************

.. _transaction-types:

There are different types of transactions. For example, you can transfer :doc:`mosaics <mosaic>` between accounts, transfer or configure the ownership of accounts (including the use of :doc:`multisig <multisig-account>` rules), and more.

.. csv-table::
    :header:  "Id",  "Type", "Description"
    :widths: 20 30 50
    :delim: ;

    **Remote harvesting**;;
    0x414C; :ref:`AccountLinkTransaction <account-link-transaction>`; Delegate the account importance to a proxy account.
    **Aggregate**;;
    0x4141; :ref:`AggregateCompleteTransaction <aggregate-transaction>`; Send transactions in batches to different accounts.
    0x4241; :ref:`AggregateBondedTransaction <aggregate-transaction>`; Propose an arrangement of transactions between different accounts.
    --; :ref:`CosignatureTransaction <cosignature-transaction>`; Cosign an AggregateBondedTransaction.
    **Mosaic**;;
    0x414D; :ref:`MosaicDefinitionTransaction <mosaic-definition-transaction>`; Register a new mosaic.
    0x424D; :ref:`MosaicSupplyChangeTransaction <mosaic-supply-change-transaction>`; Change an existent mosaic supply.
    **Namespace**;;
    0x414E; :ref:`NamespaceRegistrationTransaction <namespace-registration-transaction>`; Register namespaces to organize your assets.
    0x424E; :ref:`AddressAliasTransaction <address-alias-transaction>`; Attach a namespace name to an account.
    0x434E; :ref:`MosaicAliasTransaction <mosaic-alias-transaction>`; Attach a namespace name to a mosaic.
    **Metadata**;;
    0x4144; :ref:`AccountMetadataTransaction <account-metadata-transaction>`; Associate a key-value state to an account.
    0x4244; :ref:`MosaicMetadataTransaction <mosaic-metadata-transaction>`; Associate a key-value state to a mosaic.
    0x4344; :ref:`NamespaceMetadataTransaction <namespace-metadata-transaction>`; Associate a key-value state to a namespace.
    **Multisignature**;;
    0x4155; :ref:`MultisigAccountModificationTransaction <multisig-account-modification-transaction>`; Create or modify a multisig contract.
    **Hash Lock**;;
    0x4148; :ref:`HashLockTransaction <hash-lock-transaction>`;  Lock a deposit needed to announce aggregate bonded transactions.
    **Secret Lock**;;
    0x4152; :ref:`SecretLockTransaction <secret-lock-transaction>`; Start a token swap between different chains.
    0x4252; :ref:`SecretProofTransaction <secret-proof-transaction>`; Conclude a token swap between different chains.
    **Account restriction**;;
    0x4150; :ref:`AccountAddressRestrictionTransaction <account-address-restriction-transaction>`; Allow or block incoming and outgoing transactions for a given a set of addresses.
    0x4250; :ref:`AccountMosaicRestrictionTransaction <account-mosaic-restriction-transaction>`; Allow or block incoming transactions containing a given set of mosaics.
    0x4350; :ref:`AccountOperationRestrictionTransaction <account-operation-restriction-transaction>`; Allow or block outgoing transactions by transaction type.
    **Mosaic restriction**;;
    0x4151; :ref:`MosaicGlobalRestrictionTransaction  <mosaic-global-restriction-transaction>`; Set a global restriction to a mosaic.
    0x4251; :ref:`MosaicAddressRestrictionTransaction <mosaic-address-restriction-transaction>`; Set a mosaic restriction to a specific address.
    **Transfer**;;
    0x4154; :ref:`TransferTransaction <transfer-transaction>`; Send mosaics and messages between two accounts.

.. _transaction-definition:

**********************
Defining a transaction
**********************

Transactions are defined in a `serialized <https://github.com/nemtech/catbuffer>`_ form. Each transaction extends from the :ref:`transaction schema definition <transaction>`, combining the type's particular properties. You can find the description of the additional properties under the :ref:`"Schema" section <transfer-transaction>`, at the end of each built-in feature description.

We recommend `using the NEM2-SDK to define <https://github.com/nemtech/nem2-docs/blob/master/source/resources/examples/typescript/transaction/SendingATransferTransaction.ts#L30>`_ transactions.

.. code-block:: typescript

    import {
        Address,
        Deadline,
        NetworkCurrencyMosaic,
        NetworkType,
        PlainMessage,
        TransferTransaction
    } from "nem2-sdk";

    const recipientAddress = Address
        .createFromRawAddress('SD5DT3-CH4BLA-BL5HIM-EKP2TA-PUKF4N-Y3L5HR-IR54');

    const transferTransaction = TransferTransaction.create(
        Deadline.create(),
        recipientAddress,
        [NetworkCurrencyMosaic.createRelative(10)],
        PlainMessage.create('Welcome To NEM'),
        NetworkType.MIJIN_TEST);

    console.log(transferTransaction.serialize());

    /* Outputs:
    B3000000000000000000000000000000000000000000000
    00000000000000000000000000000000000000000000000
    00000000000000000000000000000000000000000000000
    00000000000000000000000000000000000000000000000
    000000000000039054410000000000000000B986E63F170
    0000090FA39EC47E05600AFA74308A7EA607D145E371B5F
    4F1447BC0F00010057656C636F6D6520546F204E454D44B
    262C46CEABB858096980000000000
    */

.. _transaction-signature:

*********************
Signing a transaction
*********************

Accounts must sign transactions before announcing them to the network. `Signing a transaction <https://github.com/nemtech/nem2-docs/blob/master/source/resources/examples/typescript/transaction/SendingATransferTransaction.ts#L40>`_ expresses the account's agreement to change the network state as defined.

For example, a TransferTransaction describes who is the recipient and the quantity of mosaics to transfer. In this case, signing the transaction means to accept moving those mosaics from one account's balance to another.

An account has to follow the next steps to `sign a transaction <https://github.com/nemtech/nem2-library-js/blob/f171afb516a282f698081aea407339cfcd21cd63/src/transactions/VerifiableTransaction.js#L64>`_ :

1. Get the ``signing bytes``, which are all the bytes of the transaction except the size, signature and signer.
2. Get the nemesis block generation hash. You can query ``http://localhost:3000/block/1`` and copy ``meta.generationHash`` value.
3. Prepend the nemesis block generation hash to the signing bytes.
4. Sign the resulting string with the signer's private key. This will give you the transaction ``signature``.
5. Append the signer's signature and public key to the transaction to obtain the ``payload``.
6. Calculate the `hash of the transaction <https://github.com/nemtech/nem2-library-js/blob/f171afb516a282f698081aea407339cfcd21cd63/src/transactions/VerifiableTransaction.js#L76>`_ by applying the network hashing algorithm to the first 32 bytes of signature, the signer public key, nemesis block generation hash, and the remaining transaction payload.

.. code-block:: typescript

    import {Account} from "nem2-sdk";

    const privateKey = process.env.PRIVATE_KEY as string;
    const generationHash = process.env.GENERATION_HASH as string;
    const account = Account.createFromPrivateKey(privateKey,NetworkType.MIJIN_TEST);

    const signedTransaction = account.sign(transferTransaction, generationHash);

    console.log(signedTransaction.payload);

    /* Outputs:
    B3000000F77A8DCFCB57B81F9BE5B46738F7132998F5512
    3BFF4D89DC8E5CAE1F071A040E5571F4D8DA125B243C785
    DA5261F878E3DE898815F6E8F12A2C0A5F0A9C3504FA624
    9E8334E3F83E972461125504AFFD3E7750AFBB3371E7B2D
    22A599A3D0E3039054410000000000000000265DEE3F170
    0000090FA39EC47E05600AFA74308A7EA607D145E371B5F
    4F1447BC0F00010057656C636F6D6520546F204E454D44B
    262C46CEABB858096980000000000
     */

    console.log(signedTransaction.hash);

    /* Outputs:
    21C4D9583CE1887BE7187D4B65B67567B45D5E6114AEE155C0CD266B6AA6A302
     */

.. _transaction-validation:

************************
Announcing a transaction
************************

Signed transactions are ready to be announced to the network. You can either use the SDK ``TransactionHttp`` service or append the payload to the request of the `transaction endpoint <https://nemtech.github.io/nem2-openapi/#operation/announceTransaction>`_.

.. example-code::

    .. code-block:: typescript

        import {TransactionHttp} from "nem2-sdk";

        const transactionHttp = new TransactionHttp('http://localhost:3000');

        transactionHttp
            .announce(signedTransaction)
            .subscribe(x => console.log(x), err => console.error(err));

    .. code-block:: bash

        curl -X PUT -H "Content-type: application/json" -d '{"payload":"B3000000F77A8DCFCB57B81F9BE5B46738F7132998F55123BFF4D89DC8E5CAE1F071A040E5571F4D8DA125B243C785DA5261F878E3DE898815F6E8F12A2C0A5F0A9C3504FA6249E8334E3F83E972461125504AFFD3E7750AFBB3371E7B2D22A599A3D0E3039054410000000000000000265DEE3F1700000090FA39EC47E05600AFA74308A7EA607D145E371B5F4F1447BC0F00010057656C636F6D6520546F204E454D44B262C46CEABB858096980000000000"}' http://localhost:3000/transaction

After announcing the transaction, the REST API will always return an OK response immediately. At this point, it is still unknown whether the transaction is valid.

.. figure:: ../resources/images/diagrams/transaction-cycle.png
    :width: 800px
    :align: center

    Transaction cycle

The first stage of validation happens in the API nodes. If the transaction presents some error, the WebSocket throws a notification through the status channel. In the positive case, the transaction reaches the P2P network with an **unconfirmed** status.  Never rely on a transaction which has an unconfirmed state. It is not clear if it will get included in a block, as it should pass a second validation.

The second validation is done before the transaction is added in a :doc:`harvested block <block>`. If valid, the harvester stores the transaction in a block, and it reaches the **confirmed** status.

Continuing the previous example, the transaction gets processed and the amount stated gets transferred from the signer's account to the recipient's account. Additionally, the transaction fee is deducted from the signer's account.

The transaction has **zero confirmations** at this point. When another block is added to the blockchain, the transaction has one confirmation. The next block added to the chain will give it two confirmations and so on.

.. _rollbacks:

*********
Rollbacks
*********

Blockchains are designed in a way that under certain circumstances recent blocks need to be rolled back. These are essential to resolve forks of the blockchain.

The :properties:`rewrite limit <config-network.properties>` is the maximum number of blocks that can be rolled back. Hence, forks can only be resolved up to a certain depth too.

Catapult has a rewrite limit of ``40`` blocks. Once a transaction has more than 40 confirmations, it cannot be reversed.

.. From experience, forks that are deeper than 20 blocks do not happen, unless there is a severe problem with the blockchain due to a bug in the code or an attack.

******
Guides
******

.. postlist::
    :category: Monitoring
    :date: %A, %B %d, %Y
    :format: {title}
    :list-style: circle
    :excerpts:
    :sort:

*******
Schemas
*******

.. _transaction:

Transaction
===========

Serialization of a transaction.

**Inlines**:

* :ref:`SizePrefixedEntity <size-prefixed-entity>`
* :ref:`VerifiableEntity <verifiable-entity>`
* :ref:`EntityBody <entity-body>`

.. csv-table::
    :header: "Property", "Type", "Description"
    :delim: ;

    max_fee; :schema:`Amount <types.cats#L1>`; Maximum fee allowed to spend for the transaction.
    deadline; :schema:`Timestamp <types.cats#L5>`;  Number of milliseconds elapsed since the creation of the nemesis block. If a transaction does not get included in a block before the deadline is reached, it is deleted. Deadlines are only allowed to lie up to ``24`` hours ahead.

.. _embedded-transaction-header:

EmbeddedTransactionHeader
=========================

Binary layout for an embedded transaction header.

**Inlines**:

* :ref:`SizePrefixedEntity <size-prefixed-entity>`

.. csv-table::
    :header: "Property", "Type", "Description"
    :delim: ;

    embeddedTransactionHeader_Reserved1; uint32; Reserved padding to align end of EmbeddedTransactionHeader on 8-byte boundary.

.. _embedded-transaction:

EmbeddedTransaction
===================

Serialization of an :doc:`aggregate <aggregate-transaction>` inner transaction.

**Inlines**:

* :ref:`EmbeddedTransactionHeader <embedded-transaction-header>`
* :ref:`EntityBody <entity-body>`

Continue: :doc:`Fees <fees>`.
