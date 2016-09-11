import React, { Component, PropTypes } from 'react';

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../vendor/bootstrap/css/bootstrap-theme.min.css';

export default class App extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool.isRequired,

      account: PropTypes.string,
      cash: PropTypes.number,
      securities: PropTypes.object,

      proposeLendingAgreement: PropTypes.func,
    };
  }

  render() {
    return (
      <div>
        {this.renderBalancesCard()}
        {this.renderLendingAgreementsCard()}
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
          subtitle={"Account: "+this.props.account}
        />
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
                <TableRowColumn>${this.props.cash}</TableRowColumn>
              </TableRow>
              {securities}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  renderLendingAgreementsCard() {
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
        <CardTitle title="Lending agreements" />
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
                <TableRowColumn>${this.props.cash}</TableRowColumn>
              </TableRow>
              {securities}
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
