.. post:: 01 Aug, 2018
    :tags: SDK, CLI
    :excerpt: 1
    :nocomments:

###########################
Setting up your workstation
###########################

This first guide will walk you through a step-by-step installation of the required tools to start developing with |codename|.

We will be using the **test network**, which uses the same technology and features of the future main public network.
You can use the testnet to experiment with the offered |codename|'s transaction set in a live network without the loss of valuable assets.

.. _setup-creating-a-test-account:

*******************
Creating an account
*******************

An :doc:`account <../concepts/account>` is a deposit box where you can hold :doc:`mosaics <../concepts/mosaic>` (tokens) and interact with them by :doc:`announcing transactions <../concepts/transaction>`.

.. note:: Symbol CLI require Node.js 12 LTS to execute.

1. Install |cli| executing the following command in a new terminal:

.. code-block:: bash

    npm install --global symbol-cli@0.18.3

2. Generate a new account and save it as a **profile**.

.. code-block:: bash

    symbol-cli account generate

    Enter network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): TEST_NET
    Do you want to save the account? [y/n]: y
    Enter Symbol Node URL. (Example: http://localhost:3000): http://api-01.us-west-1.symboldev.network:3000/
    Insert the profile name: testnet
    Do you want to set the account as the default profile? [y/n]: y

.. note:: If the test network node is not working, you can use another node url from |network-list|. You can also **run your testnet node** by following :doc:`this guide <../guides/network/running-a-test-net-node>`.

3. You should see the account credentials in your terminal.

.. code-block:: bash

    Profile stored correctly
    ┌─────────────┬──────────────────────────────────────────────────────────────────┐
    │ Property    │ Value                                                            │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Address     │ TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB                   │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Public Key  │ 203...C0A                                                        │
    ├─────────────┼──────────────────────────────────────────────────────────────────┤
    │ Private Key │ AAA...AAA                                                        │
    └─────────────┴──────────────────────────────────────────────────────────────────┘

.. note:: The private key must be kept secret. Make sure your private key is backed up safely somewhere offline.

.. _setup-getting-test-currency:

*********************
Getting test currency
*********************

To announce a transaction, the sender should pay a :doc:`fee <../concepts/fees>` to provide an incentive to those who validate and secure the network and run the infrastructure.
This cost is paid in |networkcurrency| mosaics, the default network currency of the public network.

Now that you have created your first account, try to request |networkcurrency| units from the **testnet faucet**.
|faucet|, indicate the amount of |networkcurrency| you want to receive and the address, and click "**CLAIM!**".

.. figure:: ../resources/images/screenshots/faucet.png
    :align: center

.. note:: If the default faucet is empty, try this other |faucet-2|.

After the transaction gets confirmed, check if the account has received |networkcurrency| using the command-line tool.

.. code-block:: bash

    symbol-cli account info --profile testnet

    Balance Information
    ┌──────────────────┬─────────────────┬─────────────────┬───────────────────┐
    │ Mosaic Id        │ Relative Amount │ Absolute Amount │ Expiration Height │
    ├──────────────────┼─────────────────┼─────────────────┼───────────────────┤
    │ 51A99028058245A8 │ 750.0           │ 750000000       | Never             │
    └──────────────────┴─────────────────┴─────────────────┴───────────────────┘

.. note:: The faucet has a limited amount of |networkcurrency| and must be replenished before it dries. If you don’t need your test |networkcurrency| units anymore, please send them back to the account ``TCQSO3-LUEWJZ-X4ITOY-4YWVL5-TAOEJ5-6YXUMS-AJHH``.

.. _setup-development-environment:

******************
Creating a project
******************

Now that you have your account filled with |networkcurrency| units, it is the time to **choose a programming language**.
Pick the one you feel most comfortable with, or follow your project requirements.

Then, **create a folder for your new project** and run the instructions for the selected language.
If none of the languages fits your project, you can always query the blockchain directly using the :doc:`REST gateway <../api>`.

.. tabs::

    .. tab:: TypeScript

        .. note:: Symbol SDK require Node.js 12 LTS to execute.

        1. Create a ``package.json`` file.

        .. code-block:: bash

            npm init

        2. Install |sdk| and RxJS library.

        .. code-block:: bash

            npm install symbol-sdk@0.17.4 rxjs

        3. Install globally TypeScript dependency:

        .. code-block:: bash

            npm install --global typescript
            typescript --version

        4. Install `ts-node`_ to execute TypeScript files with node.

        .. code-block:: bash

            sudo npm install --global ts-node

    .. tab:: JavaScript

        .. note:: Symbol SDK require Node.js 12 LTS to execute.


        1. Create a ``package.json`` file.

        .. code-block:: bash

            npm init

        2. Install |sdk| and RxJS library.

        .. code-block:: bash

            npm install symbol-sdk@0.17.4 rxjs

    .. tab:: Java

        .. note:: Symbol SDK require JDK 8 to execute.

        1. Open a new Java `gradle`_ project.  Use your favourite IDE or create a project from the command line.

        .. code-block:: bash

            gradle init --type java-application

        2. Edit ``build.gradle`` to use Maven central repository.

        .. code-block:: java

            repositories {
                mavenCentral()
            }

        3. Add ``symbol-sdk`` as a dependency.

        .. code-block:: java

            dependencies {
                compile "io.nem:sdk-vertx-client:0.17.0"
            }

        4. Execute ``gradle build`` and ``gradle run`` to run your program.

Continue: :doc:`Writing your first application <first-application>`.

.. _ts-node: https://www.npmjs.com/package/ts-node

.. _gradle: https://gradle.org/install/

.. _JDK: https://www.oracle.com/technetwork/es/java/javase/downloads/index.html

.. |different-ways-to-install-a-nuget-package| raw:: html

   <a href="https://docs.microsoft.com/en-us/nuget/consume-packages/ways-to-install-a-package" target="_blank">different ways to install a NuGet Package</a>

.. |network-list| raw:: html

   <a href="http://explorer.symboldev.network/nodes" target="_blank">this list</a>

.. |faucet| raw:: html

   <a href="http://faucet-01.symboldev.network/" target="_blank">Navigate here</a>

.. |faucet-2| raw:: html

   <a href="http://faucet-02.symboldev.network/" target="_blank">alternative faucet</a>
