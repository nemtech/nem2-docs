############
Cryptography
############

|codename| uses `elliptic curve cryptography <https://en.wikipedia.org/wiki/Elliptic-curve_cryptography>`__ to verify data integrity and to authenticate a signer's identity.

.. _keypair:

********
Key pair
********

Elliptic curve cryptography is based on **key pairs**: a private and a matching public key. In particular, |codename| uses the `Twisted Edwards curve <https://en.wikipedia.org/wiki/Twisted_Edwards_curve>`__ with the digital signature algorithm named `Ed25519 <https://ed25519.cr.yp.to>`__ and hashing algorithm **SHA-512**:

* **Private key**: A random 256-bit (64 byte) integer used to sign :ref:`entities <verifiable-entity>` known by the owner.

* **Public key**: A 128-bit (32 bytes) integer derived from the private key. It serves as the public identifier of the key pair and can be disseminated widely. It is used to prove that an entity was signed with the paired private key.

The public key can be derived from the private key, but **not the other way around**.

The implementation can be found in the `crypto module <https://github.com/nemtech/catapult-server/blob/main/src/catapult/crypto>`__  of :doc:`catapult-server <../server>`.

|codename| keys
===============

Key pairs are used in |codename| in different places, for **different purposes**. This is a summary of the keys used:

* **Main**: This key pair manages a **regular** :doc:`account`, containing mosaics.
* **Remote**: This key pair manages the **remote account** used in :ref:`remote-harvesting`.
* **VRF**: Required :ref:`for harvesting <account_eligibility>`.
* **Voting**: Required for nodes participating in the :ref:`finalization` process.
* **Transport**: This key pair is used by nodes for secure transport over `TLS <https://en.wikipedia.org/wiki/Transport_Layer_Security>`__.

.. note::

   As a rule of thumb, the **private key** in any key pair should be kept secret at all times. However, **how bad is it to have a private key stolen?**

   .. csv-table::
      :header: "Key", "Severity", "Impact"
      :widths: 20,20,60
      :delim: ;

      **Main**; 🔴 HIGH; Funds could be transferred to another account.
      **Remote**; 🟠 MED; Harmless to the account or the node. Easily reverted by linking another remote account. An attacker grabbing a large number of remote keys could gain a lot of harvesting power, influencing which blocks are added to the blockchain.
      **VRF**; 🟡 LOW; Harmless without the key used for harvesting.
      **Voting**; 🟠 MED; Harmless to the account or the node. Easily reverted by linking another voting account. An attacker grabbing more than 50% of the network's voting keys could influence block finalization.
      **Transport**; 🟡 LOW; An attacker could steal harvesting delegations away from the node, but harmless otherwise.

*********
Signature
*********

**Messages can be signed** using a private key, producing 512-bit (128 byte) **signatures**.

Using the matching public key signatures can then **validate** that the key pair signed an entity.

The implementation can be found in the `Signer class <https://github.com/nemtech/catapult-server/blob/main/src/catapult/crypto/Signer.cpp>`__ under the ``crypto`` module of :doc:`catapult-server <../server>`.

.. _address:

*******
Address
*******

|codename| public keys can be shared in a **shorter form** as 39-character addresses.

First, a 24-byte triplet is built, consisting of:

* A network-id byte.
* A 160-bit (20 byte) hash of the account's public key.
* A 3-byte checksum, to allow the quick recognition of mistyped addresses.

Then, the whole string is `Base32-encoded <https://en.wikipedia.org/wiki/Base32>`__ to produce the 39-character address.

The implementation can be found in the `PublicKeyToAddress() <https://github.com/nemtech/catapult-server/blob/main/src/catapult/model/Address.cpp>`__ method of :doc:`catapult-server <../server>`.

It is possible to create an address without interacting with the blockchain. In fact, the blockchain only tracks addresses and public keys when they first appear in a transaction.

Continue: :doc:`Block <block>`.
