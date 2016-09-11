import React, { Component, PropTypes } from 'react';

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import Timestamp from 'react-timestamp';

import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../vendor/bootstrap/css/bootstrap-theme.min.css';

export default class App extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool.isRequired,

      account: PropTypes.string,
      cash: PropTypes.number,
      securities: PropTypes.object,
      agreements: PropTypes.array,
      orders: PropTypes.array,
      trades: PropTypes.array,
      loans: PropTypes.array,

      proposeLendingAgreement: PropTypes.func,
      runDemo: PropTypes.func,
      runDemo2: PropTypes.func,
    };
  }

  render() {
    return (
      <div>
        <FlatButton
          label="DEMO"
          onTouchTap={this.props.runDemo}
        />
        <FlatButton
          label="DEMO2"
          onTouchTap={this.props.runDemo2}
        />
        {this.renderBalancesCard()}
        {this.renderLendingAgreementsCard()}
        {this.renderOrdersCard()}
        {this.renderTradesCard()}
        {this.renderLoansCard()}
      </div>
    );
  }

  renderBalancesCard() {
    const securities = this.props.securities
      ? Object.keys(this.props.securities).map(
          key => (
              <TableRow key={key}>
                <TableRowColumn>{key}</TableRowColumn>
                <TableRowColumn>{this.props.securities[key]}</TableRowColumn>
              </TableRow>
          )
        )
        : null;

    return (
      <Card>
        <CardTitle
          title={this.props.loading ? "Balances... (wait)" : "Balances"}
          subtitle={"Account: "+this.props.account}>
          {this.renderProgress()}
        </CardTitle>
        <CardText>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Amount</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>Cash</TableRowColumn>
                <TableRowColumn>£{this.props.cash}</TableRowColumn>
              </TableRow>
              {securities}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  renderLendingAgreementsCard() {
    const stateNames = ['PENDING', 'ACTIVE', 'REJECTED', 'CANCELLED'];

    const makeActions = (agreement, index) => {
      if (stateNames[agreement.state.toNumber()] === 'PENDING') {
        if (agreement.to === this.props.account) {
          return (
            <AcceptButton
              onConfirm={x => this.props.acceptLendingAgreement(index)}
            />
          );
        }
      }

      return <div />;
    };
    
    const agreements = this.props.agreements
      ? this.props.agreements.map(
          (a, i) => (
              <TableRow key={i}>
                <TableRowColumn>{a.from}</TableRowColumn>
                <TableRowColumn>{a.to}</TableRowColumn>
                <TableRowColumn>{a.security}</TableRowColumn>
                <TableRowColumn>{a.haircut.toNumber() / 100}%</TableRowColumn>
                <TableRowColumn>{a.rate.toNumber() / 100}%</TableRowColumn>
                <TableRowColumn>{stateNames[a.state.toNumber()]}</TableRowColumn>
                <TableRowColumn>{makeActions(a, i)}</TableRowColumn>
              </TableRow>
          )
        )
        : null;

    return (
      <Card>
        <CardTitle title="Lending agreements">
          {this.renderProgress()}
        </CardTitle>
        <CardText>
          <Table
            selectable={false}
            fixedHeader={false}
            style={{'table-layout': 'auto'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>From</TableHeaderColumn>
                <TableHeaderColumn>To</TableHeaderColumn>
                <TableHeaderColumn>Security</TableHeaderColumn>
                <TableHeaderColumn>Haircut</TableHeaderColumn>
                <TableHeaderColumn>Rate</TableHeaderColumn>
                <TableHeaderColumn>State</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {agreements}
            </TableBody>
          </Table>
        </CardText>
        <CardActions>
          <CreateLendingAgreementDialog
            proposeLendingAgreement={this.props.proposeLendingAgreement}
          />
        </CardActions>
      </Card>
    );
  }

  renderOrdersCard() {
    const stateNames = ['PENDING', 'MATCHED', 'CANCELLED'];
    const buySell = ['BUY', 'SELL'];

    const orders = this.props.orders
      ? this.props.orders.map(
          (a, i) => (
              <TableRow key={i}>
                <TableRowColumn>{a.from}</TableRowColumn>
                <TableRowColumn>{a.to}</TableRowColumn>
                <TableRowColumn>{buySell[a.buysell.toNumber()]}</TableRowColumn>
                <TableRowColumn>{a.security}</TableRowColumn>
                <TableRowColumn>{a.units.toNumber()}</TableRowColumn>
                <TableRowColumn>£{a.price.toNumber() / 100.0}</TableRowColumn>
                <TableRowColumn>
                  {stateNames[a.state.toNumber()]}
                </TableRowColumn>
              </TableRow>
          )
        )
        : null;

    return (
      <Card>
        <CardTitle title="Orders">
          {this.renderProgress()}
        </CardTitle>
        <CardText>
          <Table
            selectable={false}
            fixedHeader={false}
            style={{'table-layout': 'auto'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>From</TableHeaderColumn>
                <TableHeaderColumn>To</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Security</TableHeaderColumn>
                <TableHeaderColumn>Units</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {orders}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  renderTradesCard() {
    const stateNames = ['PENDING', 'EXECUTED', 'CANCELLED'];

    const trades = this.props.trades
      ? this.props.trades.map(
          (a, i) => (
              <TableRow key={i}>
                <TableRowColumn>{a.buyer}</TableRowColumn>
                <TableRowColumn>{a.seller}</TableRowColumn>
                <TableRowColumn>{a.security}</TableRowColumn>
                <TableRowColumn>{a.units.toNumber()}</TableRowColumn>
                <TableRowColumn>£{a.price.toNumber() / 100.0}</TableRowColumn>
                <TableRowColumn>
                  {stateNames[a.state.toNumber()]}
                </TableRowColumn>
              </TableRow>
          )
        )
        : null;

    return (
      <Card>
        <CardTitle title="Trades">
          {this.renderProgress()}
        </CardTitle>
        <CardText>
          <Table
            selectable={false}
            fixedHeader={false}
            style={{'table-layout': 'auto'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Buyer</TableHeaderColumn>
                <TableHeaderColumn>Seller</TableHeaderColumn>
                <TableHeaderColumn>Security</TableHeaderColumn>
                <TableHeaderColumn>Units</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {trades}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  renderLoansCard() {
    const stateNames = ['ACTIVE', 'INACTIVE'];

    const loans = this.props.loans
      ? this.props.loans.map(
          (a, i) => (
              <TableRow key={i}>
                <TableRowColumn>{a.lender}</TableRowColumn>
                <TableRowColumn>{a.borrower}</TableRowColumn>
                <TableRowColumn>{a.security}</TableRowColumn>
                <TableRowColumn>{a.units.toNumber()}</TableRowColumn>
                <TableRowColumn>
                  <Timestamp time={a.ts_start}/>
                </TableRowColumn>
                <TableRowColumn>
                  <Timestamp time={a.ts_end}/>
                </TableRowColumn>
                <TableRowColumn>{a.margin.toNumber()/100.0}%</TableRowColumn>
                <TableRowColumn>£{a.interest_paid.toNumber()}</TableRowColumn>
                <TableRowColumn>
                  {stateNames[a.state.toNumber()]}
                </TableRowColumn>
              </TableRow>
          )
        )
        : null;

    return (
      <Card>
        <CardTitle title="Loans">
          {this.renderProgress()}
        </CardTitle>
        <CardText>
          <Table
            selectable={false}
            fixedHeader={false}
            style={{'table-layout': 'auto'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Lender</TableHeaderColumn>
                <TableHeaderColumn>Borrower</TableHeaderColumn>
                <TableHeaderColumn>Security</TableHeaderColumn>
                <TableHeaderColumn>Units</TableHeaderColumn>
                <TableHeaderColumn>Start time</TableHeaderColumn>
                <TableHeaderColumn>End time</TableHeaderColumn>
                <TableHeaderColumn>Margin</TableHeaderColumn>
                <TableHeaderColumn>Interest paid</TableHeaderColumn>
                <TableHeaderColumn>State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {loans}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  renderProgress() {
    if (this.props.loading) {
      return <LinearProgress mode="indeterminate" />;
    }

    return <div />;
  }
}

class CreateLendingAgreementDialog extends React.Component {
  static get propTypes() {
    return {
      proposeLendingAgreement: PropTypes.func,
    };
  }

  state = {
    open: false,
    rate: '3',
    haircut: '10',
    security: 'BARC.L',
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit() {
    this.props.proposeLendingAgreement({
      rate: this.state.rate,
      haircut: this.state.haircut,
      recipient: this.state.recipient,
      security: this.state.security,    
    }).then(
      x => this.handleClose(),
    );
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Create"
        primary={true}
        keyboardFocused={true}
        onTouchTap={x => this.handleSubmit(x)}
      />,
    ];

    const dialog = this.state.open ? (
        <Dialog
          title="New lending agreement"
          actions={actions}
          modal={true}
          open={true}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="recipient address"
            floatingLabelText="Recipient"
            value={this.state.recipient || ""}
            onChange={
              event => this.setState({
                recipient: event.target.value
              })
            }
          />
          <TextField
            hintText="which security you want to lend"
            floatingLabelText="Security"
            value={this.state.security}
            onChange={
              event => this.setState({
                security: event.target.value
              })
            }
          />
          <TextField
            hintText="haircut"
            floatingLabelText="Haircut, %"
            value={this.state.haircut}
            onChange={
              event => this.setState({
                haircut: event.target.value
              })
            }
          />
          <TextField
            hintText="lending rate"
            floatingLabelText="Lending rate, %"
            value={this.state.rate}
            onChange={
              event => this.setState({
                rate: event.target.value
              })
            }
          />
        </Dialog>
    ) : null;

    return (
      <div>
        <RaisedButton
          label="Create lending agreement"
          primary={true}
          onTouchTap={this.handleOpen}
        />

        {dialog}
      </div>
    );
  }
}

class AcceptButton extends React.Component {
  static get propTypes() {
    return {
      onConfirm: PropTypes.func,
    };
  }

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleConfirm() {
    this.props.onConfirm().then(x => this.handleClose()); 
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={x => this.handleClose(x)}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        keyboardFocused={true}
        onTouchTap={x => this.handleConfirm(x)}
      />,
    ];

    return (
      <div>
        <FlatButton label="Accept" onTouchTap={this.handleOpen} primary={true} />
        <Dialog
          title="Are you sure you want to accept this agreement?"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        />
      </div>
    );
  }
}
