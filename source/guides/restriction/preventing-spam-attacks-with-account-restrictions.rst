:orphan:

.. post:: 07 May, 2019
    :category: Account Restriction
    :excerpt: 1
    :nocomments:

#################################################
Preventing spam attacks with account restrictions
#################################################

Learn how to add and remove account restrictions.

**********
Background
**********

Imagine you are a company using the public chain to certify the quality of your products.

When the quality verification process concludes, an operator sends a :doc:`quality seal <../../concepts/mosaic>` to the product account, which the customers can review by scanning a QR code.
For the convenience of the customers, you only want to **show relevant transactions** and prevent spam from cluttering the product account.

The final customers can review the product mosaics scanning a QR code.
For that reason, the company only wants to show related transactions, avoiding that others spam their products with non-related information.

.. figure:: ../../resources/images/examples/account-restrictions-spam.png
    :align: center
    :width: 450px

    Blocking spam attacks

Thus, you opt to configure the product :doc:`account restrictions <../../concepts/account-restriction>` to only receive transactions that follow a set of conditions.

*************
Prerequisites
*************

- Finish :doc:`sending mosaics and messages between two accounts guide <../transfer/sending-a-transfer-transaction>`
- Finish :doc:`creating a mosaic guide <../mosaic/creating-a-mosaic>`

*************************
Method #01: Using the SDK
*************************

Before starting solving the use case, you will need to set up two accounts with the :doc:`CLI tool<../../cli>`.

1. Create an account to represent the product.

.. code-block:: bash

    symbol-cli account generate

    Enter network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): TEST_NET
    Do you want to save the account? [y/n]: y
    Enter a Symbol Node URL. (Example: http://localhost:3000): http://api-2-01.us-west-1.symboldev.network:3000
    Insert profile name: product

    New Account
    ┌─────────────┬──────────────────────────────────────────────────────────────────┐
    │ Property    │ Value                                                            │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Address     │ TAEG6L-KWXRA7-PSWUEE-ILQPG4-3V5CYZ-S5652T-JTUU                   │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Public Key  │ 6C0350A10724FC325A1F06CEFC4CA14464BC472F566842D22418AEE0F8746B4C │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Private Key │ FFF..FFF                                                         │
    └─────────────┴──────────────────────────────────────────────────────────────────┘

2. Create another account for the company.

.. code-block:: bash

    symbol-cli account generate

    Enter network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): TEST_NET
    Do you want to save account? [y/n]: y
    Enter a Symbol Node URL. (Example: http://localhost:3000): http://api-2-01.us-west-1.symboldev.network:3000
    Insert profile name: company

    New Account
    ┌─────────────┬──────────────────────────────────────────────────────────────────┐
    │ Property    │ Value                                                            │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Address     │ TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB                   │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Public Key  │ 20330294DC18D96BDEEF32FB02338A6462A0469CB451A081DE2F05B4302C0C0A │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Private Key │ AAA...AAA                                                        │
    └─────────────┴──────────────────────────────────────────────────────────────────┘

Next, you will configure the product's account only to accept receiving transfer transactions that contain a specific mosaic.

Blocking transactions by address
================================

An account can decide to receive transactions only from an allowed list of :doc:`addresses <../../concepts/account>`.
Similarly, an account can specify a blocked list of addresses to block transactions from.

.. note:: Allow and block restrictions are mutually exclusive per restriction type. In other words, an account can only be configured to have either an allowed or blocked list per type of restriction.

By default, when there is no restriction set, all the accounts in the network can announce transactions to the stated account.

Returning to our previous example, let us imagine that you want to configure the product account only to accept receiving transactions that come from the company's account.
You might take the following steps to do so:

1. Define the company’s address ``TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB`` in a new variable.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

2. Create an **AccountRestrictionTransaction**, with restrictionType ``AllowAddress``.
Add to the company’s address from the previous step to the allowed list.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.ts
        :language: typescript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.js
        :language: javascript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

3. Sign and announce the transaction with the product's account.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.ts
        :language: typescript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionAllowList.js
        :language: javascript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

Now, if you send a :doc:`TransferTransaction <../transfer/sending-a-transfer-transaction>` from another account, you will get an error since only ``TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB`` is allowed to send transactions to the product's account.

Blocking transactions by mosaic id
==================================

Imagine that the account that represents the company owns the following mosaics:

- ``company.share``: represents shares of the company.
- ``company.quality.seal``: represents that the product has passed a quality test.
- ``company.safety.seal``: represents that the product has passed a safety test.

In this case, it might be useful if the product could only receive seals and not company shares.

Thus, you could narrow the type of transactions that the product can receive from the company's account through the use of negation.
Instead of specifically allowing the seals, the product can be set up to block receiving transactions that contain ``company.share``.
This is how it can be done:

1. Define the **AccountRestrictionModification**.
Add the mosaic id you want to block to the blocked list.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

2. Create an **AccountRestrictionTransaction**, with restrictionType ``BlockMosaic``.
Add to the array the modification created in the previous step.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.ts
        :language: typescript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.js
        :language: javascript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

3. Sign and announce the transaction with the product's account.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.ts
        :language: typescript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountMosaicRestrictionBlockList.js
        :language: javascript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

If the process was successful, the product account can now only receive transactions from the company's account that does not include any ``company.share`` mosaic.

Removing a restriction
======================

After the company sells the product to the final client, they want to remove the condition that only allowed the company's account to send transactions to the product. The account restrictions can be removed as easily as they were set up:

1. Define the **AccountRestrictionModification**.
Remove from the allowed list the company's address.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

2. Create an **AccountRestrictionTransaction**, setting the type ``AllowAddress``. Add as well the modification created.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.ts
        :language: typescript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.js
        :language: javascript
        :start-after:  /* start block 02 */
        :end-before: /* end block 02 */

3. Sign and announce the transaction with the product's account.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.ts
        :language: typescript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

    .. viewsource:: ../../resources/examples/typescript/restriction/AccountAddressRestrictionRemoveRestriction.js
        :language: javascript
        :start-after:  /* start block 03 */
        :end-before: /* end block 03 */

After the transaction gets confirmed, you should be able to send transactions from any account to the product's account again.
