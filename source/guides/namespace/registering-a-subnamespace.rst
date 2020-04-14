:orphan:

.. post:: 18 Aug, 2018
    :category: Namespace
    :tags: SDK, CLI
    :excerpt: 1
    :nocomments:

#######################
Creating a subnamespace
#######################

Create subnamespaces to organize your assets.

*************
Prerequisites
*************

- Complete :doc:`registering a namespace <registering-a-namespace>` guide.

*************************
Method #01: Using the SDK
*************************

Once you have a registered root :doc:`namespace <../../concepts/namespace>`, you can create up to ``3`` levels of subnamespaces to **organize your assets**.

This code example creates a subnamespace called ``bar`` under the namespace ``foo``.

.. example-code::

    .. viewsource:: ../../resources/examples/typescript/namespace/RegisteringASubnamespace.ts
        :language: typescript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

    .. viewsource:: ../../resources/examples/typescript/namespace/RegisteringASubnamespace.js
        :language: javascript
        :start-after:  /* start block 01 */
        :end-before: /* end block 01 */

*************************
Method #02: Using the CLI
*************************

.. viewsource:: ../../resources/examples/bash/namespace/RegisteringASubnamespace.sh
    :language: bash
    :start-after: #!/bin/sh

************
What's next?
************

When the transaction is confirmed, link the subnamespace with a :doc:`mosaic <../namespace/link-a-namespace-to-a-mosaic>` or :doc:`address <../namespace/link-a-namespace-to-an-address>`.
