import React, { Component } from 'react';
import Web3 from 'web3';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from '../components/App';

export default class AppContainer extends Component {
  componentWillMount() {
    this.setState({ loading: true });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const web3 = this.getWeb3();
    const contract = this.getContract();

    const accountRequest = new Promise((resolve, reject) => {
      // allow URI override for debugging
      const query = window.location.search.substr(1);
      const query_parts = query.split('&');
      for (var i in query_parts) {
        const [key, value] = query_parts[i].split('=');
        if (key === 'account') {
          resolve(value);
        }
      }
      
      web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          reject();
        }

        if (accs.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          reject();
        }

        resolve(accs[0]);
      });
    });

    const dataRequest = accountRequest.then(
      account => {
        this.setState({ account: account });
        return account;
      }
    ).then(
      account => {
        // TODO: do not hardcode it here
        // furthermore, we should have many of those
        const security = 'BARC.L';

        return contract.getAccountBalance.call(account, security).then(balances => {
          const [cash, barcl] = balances;

          const securities = {};
          securities[security] = barcl.toNumber();

          this.setState({ cash: cash.toNumber(), securities: securities });
        });
      },
    );

    dataRequest.then(data => {
      this.setState({loading: false });
    });
  }

  getWeb3() {
    if (typeof web3 !== 'undefined') {
      return new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      return new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  }

  getContract() {
    const web3 = this.getWeb3();
    const Contract = require("../../../protocol/lib/build/contracts/StarbuckersDemo.sol.js");
    Contract.setProvider(web3.currentProvider);
    const contract = Contract.deployed();
    
    // for interactive debug
    window.contract = contract;

    return contract;
  }

  render() {
    return (
      <MuiThemeProvider>
        <App {...this.state} />
      </MuiThemeProvider>
    );
  }
}
