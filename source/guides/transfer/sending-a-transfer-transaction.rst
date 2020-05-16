:orphan:

.. post:: 10 Aug, 2018
    :category: Transfer Transaction
    :tags: wallet, SDK, CLI
    :excerpt: 1
    :nocomments:

#################################################
Sending mosaics and messages between two accounts
#################################################

Define, sign, and announce a transfer transaction.

This guide will show you how to send 10 |networkcurrency| from your account to Bob's, whose address is ``TBONKW-COWBZY-ZB2I5J-D3LSDB-QVBYHB-757VN3-SKPP``.

*************
Prerequisites
*************

- Complete the :doc:`getting started section <../../getting-started/setup-workstation>`.
- Create a new :ref:`account <setup-creating-a-test-account>`.
- Load the account with enough |networkcurrency| to pay for transaction fees.

************************************
Method #01: Using the Desktop Wallet
************************************

1. From the home page of your Desktop Wallet, click on the "**Transfer**" tab.

.. figure:: ../../resources/images/screenshots/desktop-transfer-1.gif
    :align: center
    :width: 800px

2. Fill out the necessary information for the transfer transaction.
For this example, you need to specify that you are sending 10 XYM to Bob (``TCQSO3-LUEWJZ-X4ITOY-4YWVL5-TAOEJ5-6YXUMS-AJHH``).  You can add a message, but it is not necessary in this case.

.. figure:: ../../resources/images/screenshots/desktop-transfer-2.gif
    :align: center
    :width: 800px

3. Once you have filled out all the information, click "**Send**". A popup will show.
Read and verify the information, then enter your wallet password and click "**Confirm**".

4. You can verify that the transaction was successful by going back to the "**Dashboard**" tab.
At first, it might show up under "**Unconfirmed**" transactions as the transaction becomes included in a block, but you should soon be able to see it under the "**Confirmed**" transactions.

*************************
Method #02: Using the SDK
*************************

1. In a new terminal, monitor which transactions involving the your account are confirmed and which of them are rejected by the network.

.. code-block:: bash

   symbol-cli monitor all --address <YOUR-ADDRESS>

2. Define the **TransferTransaction**, including Bob address as the recipient and attaching 10 |networkcurrency|.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/java/src/test/java/symbol/guides/examples/transfer/SendingATransferTransaction.java
        :language: java
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

As you may have noticed, transfer transactions require an array of mosaics as a parameter.
This permits sending transfer transactions with multiple mosaics at the same time.

If you own more than one mosaic, you can send them together in the same transaction:

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransactionWithMultipleMosaics.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransactionWithMultipleMosaics.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/java/src/test/java/symbol/guides/examples/transfer/SendingATransferTransactionWithMultipleMosaics.java
        :language: java
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

.. note:: |codename| works with absolute amounts. To get an absolute amount, multiply the number of assets you want to send by 10\ :sup:`divisibility`.  For example, if the mosaic has :doc:`divisibility <../mosaic/getting-mosaic-information>` 2, to send 10 units (relative) you should define 1000 (absolute) instead.

3. Sign the transaction with your account.
Include the network generation hash to make the transaction only valid for your network. Open ``nodeUrl + '/node/info'`` in a new browser tab and copy the ``meta.networkGenerationHash`` value.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.ts
        :language: typescript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.js
        :language: javascript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

    .. viewsource:: ../../resources/examples/java/src/test/java/symbol/guides/examples/transfer/SendingATransferTransaction.java
        :language: java
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

4. Once signed, :doc:`announce the transaction <../../concepts/transaction>` to the network.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.ts
        :language: typescript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

    .. viewsource:: ../../resources/examples/typescript/transfer/SendingATransferTransaction.js
        :language: javascript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

    .. viewsource:: ../../resources/examples/java/src/test/java/symbol/guides/examples/transfer/SendingATransferTransaction.java
        :language: java
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

5. Open the terminal where you are monitoring the transaction's status.
The transaction should appear as confirmed after ±15 seconds and the amount defined gets transferred from the sender's account to the recipient's account.
If the terminal raises an error, check the error code meaning :ref:`here <status-errors>`.

*************************
Method #03: Using the CLI
*************************

Open a terminal window and run the following command to transfer 10 XYM from your default account to Bob's address.

.. viewsource:: ../../resources/examples/bash/transfer/SendingATransferTransaction.sh
    :language: bash
    :start-after: #!/bin/sh

