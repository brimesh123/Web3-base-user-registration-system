App = {
    web3Provider: null,
    contracts: {},
    account: null, // Changed from '0x0' to null
  
    init: async function () {
      // Determine which page we're on
      if (document.getElementById('connectWalletButton')) {
        // Landing page
        return App.initLandingPage();
      } else if (document.getElementById('disconnectButton')) {
        // Registration page
        return App.initRegistrationPage();
      }
    },
  
    initLandingPage: function () {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install it to use this app.');
        return;
      }
  
      // Add event listener to the connect wallet button
      document
        .getElementById('connectWalletButton')
        .addEventListener('click', App.connectWallet);
    },
  
    connectWallet: async function () {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Proceed to the registration page
          window.location.href = 'registration.html';
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    },
  
    initRegistrationPage: async function () {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        App.initWeb3();
        try {
          // Request account access if not already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0) {
            // Not connected, redirect to landing page
            window.location.href = 'index.html';
            return;
          }
          App.account = accounts[0];
          await App.initContract();
          await App.render();
  
          // Listen for account and network changes
          App.setupListeners();
        } catch (error) {
          console.error('User denied account access');
          window.location.href = 'index.html';
        }
      } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        window.location.href = 'index.html';
      }
    },
  
    initWeb3: function () {
      window.web3 = new Web3(App.web3Provider);
    },
  
    initContract: async function () {
      const response = await fetch('abis/EmployeeRegistration.json');
      const EmployeeRegistrationArtifact = await response.json();
  
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EmployeeRegistrationArtifact.networks[networkId];
  
      if (deployedNetwork) {
        App.contracts.EmployeeRegistration = new web3.eth.Contract(
          EmployeeRegistrationArtifact.abi,
          deployedNetwork.address
        );
      } else {
        alert('Contract not deployed on the current network.');
      }
    },
  
    render: async function () {
      document.getElementById('account').innerText = 'Your Account: ' + App.account;
  
      document
        .getElementById('registrationForm')
        .addEventListener('submit', App.registerEmployee);
  
      document
        .getElementById('disconnectButton')
        .addEventListener('click', App.disconnectWallet);
  
      // Load existing employees
      await App.loadEmployees();
    },
  
    registerEmployee: async function (event) {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const position = document.getElementById('position').value;
  
      const instance = App.contracts.EmployeeRegistration;
  
      try {

        
        // Send the transaction and handle events
        instance.methods
          .registerEmployee(name, email, position)
          .send({ from: App.account })
          .on('transactionHash', function (hash) {
            console.log('Transaction sent. Waiting for confirmation...');
          })
          .on('receipt', function (receipt) {
            // Transaction confirmed
            const event = receipt.events.EmployeeRegistered;
            const employeeId = event.returnValues.id;
            const txHash = receipt.transactionHash;
  
            const employee = {
              id: employeeId,
              name: event.returnValues.name,
              email: event.returnValues.email,
              position: event.returnValues.position,
              txHash: txHash,
            };
  
            // Add the new employee to the table
            App.addEmployeeToTable(employee);
  
            alert(`Employee registered successfully! Employee ID: ${employeeId}`);
  
            // Clear the form fields
            document.getElementById('registrationForm').reset();
          })
          .on('error', function (error) {
            console.error(error);
            alert('An error occurred while registering the employee.');
          });
      } catch (error) {
        console.error(error);
        alert('An error occurred while registering the employee.');
      }
    },
  
    loadEmployees: async function () {
      const instance = App.contracts.EmployeeRegistration;
  
      try {
        // Get all past EmployeeRegistered events
        const events = await instance.getPastEvents('EmployeeRegistered', {
          fromBlock: 0,
          toBlock: 'latest',
        });
  
        // Filter events by the current account
        const filteredEvents = events.filter(
          (event) =>
            event.returnValues.registrant.toLowerCase() === App.account.toLowerCase()
        );
  
        // Loop through the events and add employees to the table
        for (let i = 0; i < filteredEvents.length; i++) {
          const event = filteredEvents[i];
          const txHash = event.transactionHash;
  
          const employee = {
            id: event.returnValues.id,
            name: event.returnValues.name,
            email: event.returnValues.email,
            position: event.returnValues.position,
            txHash: txHash,
          };
  
          App.addEmployeeToTable(employee);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while loading employees.');
      }
    },
  
    addEmployeeToTable: function (employee) {
      const tableBody = document.getElementById('employeesTableBody');
  
      const row = document.createElement('tr');
  
      // Transaction Hash
      const txHashCell = document.createElement('td');
      txHashCell.innerHTML = `<a href="#" onclick="App.viewTransactionDetails('${employee.txHash}')">${employee.txHash}</a>`;
      row.appendChild(txHashCell);
  
      // ID
      const idCell = document.createElement('td');
      idCell.innerText = employee.id;
      row.appendChild(idCell);
  
      // Name
      const nameCell = document.createElement('td');
      nameCell.innerText = employee.name;
      row.appendChild(nameCell);
  
      // Email
      const emailCell = document.createElement('td');
      emailCell.innerText = employee.email;
      row.appendChild(emailCell);
  
      // Position
      const positionCell = document.createElement('td');
      positionCell.innerText = employee.position;
      row.appendChild(positionCell);
  
      tableBody.appendChild(row);
    },
  
    viewTransactionDetails: function (txHash) {
      // Implement this function to show transaction details
      alert('Transaction Hash: ' + txHash);
    },
  
    disconnectWallet: function () {
      // Clear account information and reset state
      App.account = null;
      App.web3Provider = null;
      App.contracts = {};
  
      // Clear UI elements
      document.getElementById('account').innerText = 'Your Account: ';
      document.getElementById('employeesTableBody').innerHTML = '';
  
      // Remove event listeners
      document
        .getElementById('registrationForm')
        .removeEventListener('submit', App.registerEmployee);
  
      document
        .getElementById('disconnectButton')
        .removeEventListener('click', App.disconnectWallet);
  
      // Redirect to landing page
      window.location.href = 'index.html';
    },
  
    setupListeners: function () {
      // Listen for account changes
      window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          App.disconnectWallet();
        } else {
          // Reload the page to update the account information
          window.location.reload();
        }
      });
  
      window.ethereum.on('chainChanged', function (chainId) {
        // Reload the page to update the network information
        window.location.reload();
      });
    },
  };
  
  window.addEventListener('load', function () {
    App.init();
  });
  