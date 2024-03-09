# MultiSig upgradable proxy proposal

Transparent upgradable proxy (TUP) is an amazing concept which allows developers to upgrade business logic in their contract. Current TUP implementation is still vulerable to single point of failure which is `Owner` wallet. In case of wallet is leaked (Which can happen in case of computer storage breach, wallet hack (MetaMask) or AI coding helpers breach), hackers can transfer ownership of the contract and modify or modify it's business logic. 

This repository is an open-source repo developed by Web3 Marius Šilenskis (Saakuru Labs VP of Web3). Feel free to fork it or propose changes, which can enhance developer experience and security of products built on Web3.

Repository consist of several core components:

1. Development ready environment which you can use as entry point
2. Script which allows to store encrypted private key with secret (avoid storing plain private key in ENV files)
3. Transparent upgradable proxy with MultiSign implementation


# How to prep wallet key:

1. Use `./scripts/encrypt.ts` (npm run encrypt) to encrypt your private key. Take Your private key and store inside .env file as `WLT` prop. 
2. Add validators addresses to .env config
# How to run any command

Append KEY and SALT props before running any command
KEY=test SALT=test npm run compile 

# IMPORTANT

1. Note, that this is not a bullet approach and hackers can still use many different methods to track your terminal and storage. You need make sure your computer is clean of various malwares. 
This approach helps to ensure that you don't store plain private key in .env file so it reduces the risk from less sofisticated attacks.

# Tips & Trickes

1. I've setup network configs for Saakuru Blockchain. This is a GasLess L2 blockchain with super fast block confirmation times, so it allows you to build way more interesting concepts and much more user friendly applications. Tho, you can use same approach for any blockchain
2. Use `interact` script to interact with your contracts easier and faster

