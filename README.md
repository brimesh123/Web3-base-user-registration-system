# Web3 User Registration System

This project is a simple Web3-based user registration system built using HTML, JavaScript, Web3.js, Ganache, and MetaMask. The system enables users to register after successfully completing a transaction on the Ethereum blockchain. Each user registration is processed one at a time, ensuring a secure transaction before the user is registered.

## Key Features

- **Blockchain-Based Registration**: Users can register only after completing a transaction on the Ethereum blockchain.
- **MetaMask Integration**: Users must connect their MetaMask wallet to complete the registration process.
- **Smart Contract**: A smart contract deployed on Ganache handles the transaction and registration logic.
- **Web3.js Integration**: Web3.js is used to interact with the Ethereum blockchain, enabling communication between the frontend and the smart contract.
- **Secure and Unique Registration**: Each registration is confirmed after the blockchain transaction is verified, ensuring a reliable process.
- Truffle

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your machine. Download it [here](https://nodejs.org/).
- **Ganache**: A personal Ethereum blockchain for development purposes. Download Ganache [here](https://trufflesuite.com/ganache/).
- **MetaMask**: A crypto wallet and gateway to blockchain apps. Get MetaMask [here](https://metamask.io/).
- **Web3.js**: The Web3 JavaScript library for interacting with the Ethereum blockchain.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/brimesh123/Web3-base-user-registration-system.git
   cd Web3-base-user-registration-system 
   ```

2. **Install Dependencies:**
   If you have any npm dependencies (for example, Web3.js), install them with:
   ```bash
   npm install
   ```

3. **Setup Ganache:**
   - Start Ganache and create a new workspace.
   - Deploy your smart contract (see the `contract` folder in the repository for contract code).
   
4. **Open the Project:**
   Open the `index.html` file in your browser.

5. **Connect MetaMask:**
   Ensure MetaMask is installed and connected to your local Ganache blockchain network.

6. **Perform a Transaction:**
   - On the user interface, connect MetaMask.
   - Initiate a transaction.
   - After the transaction is confirmed on the blockchain, the user will be registered.

## Usage

1. **Connect MetaMask**: Users must connect their MetaMask wallet to interact with the registration system.
2. **Initiate Transaction**: Once connected, the user can trigger a transaction that registers them on the blockchain.
3. **Registration Completion**: Upon successful transaction confirmation, the user is registered, and the system confirms their registration.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have suggestions or improvements.

---

You can update the repository URL and smart contract details as needed.
