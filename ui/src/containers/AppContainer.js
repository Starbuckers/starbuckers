import React, { Component } from 'react';
import Web3 from 'web3';

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

    const accountRequest = new Promise((resolve) => {
      web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
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
        return new Promise((resolve) => {
          web3.eth.getAccounts((err, accs) => {
            contract.getBalance.call(account).then(balance => {
              this.setState({ balance: balance.toNumber() });
              resolve();
            });
          });
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
    const Contract = require("../../../protocol/lib/build/contracts/StarBuckers.sol.js");
    Contract.setProvider(web3.currentProvider);
    return Contract.deployed();
  }

  render() {
    return (
      <App {...this.state} />
    );
  }
}
