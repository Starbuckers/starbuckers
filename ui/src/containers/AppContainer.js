import React, { Component } from 'react';
import Web3 from 'web3';
import _ from 'underscore'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from '../components/App';

export default class AppContainer extends Component {
  state = { loading: false };

  componentDidMount() {
    this.fetchData();
  }

  getAccount() {
    const web3 = this.getWeb3();

    return new Promise((resolve, reject) => {
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
  }

  fetchData() {
    this.setState({ loading: true });

    return this.getAccount().then(
      account => {
        this.setState({ account: account });
        return this.fetchDataForAccount(account);
      },
    ).then(_ => {
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

  fetchDataForAccount(account) {
    return Promise.all([
      this.fetchBalance(account),
      this.fetchLendingAgreements(account),
      this.fetchOrders(account),
      this.fetchTrades(account),
      this.fetchLoans(account),
    ]);
  }

  fetchBalance(account) {
    // TODO: do not hardcode it here
    // furthermore, we should have many of those
    const security = 'BARC.L';
    const contract = this.getContract();

    return contract.getAccountBalance.call(account, security).then(balances => {
      const [cash, barcl] = balances;

      const securities = {};
      securities[security] = barcl.toNumber();

      this.setState({ cash: cash.toNumber(), securities: securities });
    });
  }

  fetchLendingAgreements(account) {
    const contract = this.getContract();

    return contract.getAgreementArraySize.call().then(
      size => Promise.all(
        _.range(size).map(
          index => contract.getAgreement.call(index),
        ),
      ),
    ).then(
      arr => {
        this.setState({
          agreements: arr.map(
            row => {
              const [from, to, sec, haircut, rate, state] = row;
              return {
                from: from,
                to: to,
                security: sec,
                haircut: haircut,
                rate: rate,
                state: state,
              };
            },
          ),
        });
      },
    );
  }

  fetchOrders(account) {
    const contract = this.getContract();

    return contract.getOrderArraySize.call().then(
      size => Promise.all(
        _.range(size).map(
          index => contract.getOrder.call(index),
        ),
      ),
    ).then(
      arr => {
        this.setState({
          orders: arr.map(
            row => {
              const [
                from, to, buysell, sec, units, price, state
              ] = row;

              return {
                from: from,
                to: to,
                buysell: buysell,
                security: sec,
                units: units,
                price: price,
                state: state,
              };
            },
          ),
        });
      },
    );
  }

  fetchTrades(account) {
    const contract = this.getContract();

    return contract.getTradesArraySize.call().then(
      size => Promise.all(
        _.range(size).map(
          index => contract.getTrade.call(index),
        ),
      ),
    ).then(
      arr => {
        this.setState({
          trades: arr.map(
            row => {
              const [
                buyer, seller, security, units, price, state 
              ] = row;

              return {
                buyer: buyer,
                seller: seller,
                security: security,
                units: units,
                price: price,
                state: state,
              };
            },
          ),
        });
      },
    );
  }

  fetchLoans(account) {
    const contract = this.getContract();

    return contract.getLoansArraySize.call().then(
      size => Promise.all(
        _.range(size).map(
          index => contract.getLoan.call(index),
        ),
      ),
    ).then(
      arr => {
        this.setState({
          loans: arr.map(
            row => {
              const [
                lender,
                borrower,
                security,
                units,
                ts_start,
                ts_end,
                margin,
                interest_paid,
                state,
              ] = row;

              return {
                lender: lender,
                borrower: borrower,
                security: security,
                units: units,
                ts_start: ts_start,
                ts_end: ts_end,
                margin: margin,
                interest_paid: interest_paid,
                state: state,
              };
            },
          ),
        });
      },
    );
  }

  proposeLendingAgreement(fields) {
    const contract = this.getContract();
 
    return this.getAccount().then(
      account => contract.proposeLendingAgreement(
        fields.recipient,
        fields.security,
        fields.haircut,
        fields.rate,
        { from: account },
      ),
    ).then(
      x => {
        this.fetchData();
        // allow to close dialog as soon as transaction is sent
        // not waiting for data refresh
        return null;
      },
    );
  }

  acceptLendingAgreement(index) {
    const contract = this.getContract();
 
    return this.getAccount().then(
      account => contract.acceptLendingAgreement(
        index,
        { from: account },
      ),
    ).then(
      x => {
        this.fetchData();
        // allow to close dialog as soon as transaction is sent
        // not waiting for data refresh
        return null;
      },
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        <App
          proposeLendingAgreement={f => this.proposeLendingAgreement(f)}
          acceptLendingAgreement={i => this.acceptLendingAgreement(i)}
          {...this.state}
        />
      </MuiThemeProvider>
    );
  }
}
