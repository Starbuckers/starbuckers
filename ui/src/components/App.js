import React, { Component, PropTypes } from 'react';

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../vendor/bootstrap/css/bootstrap-theme.min.css';

export default class App extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool.isRequired,

      account: PropTypes.string,
      cash: PropTypes.number,
      securities: PropTypes.object,
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
          <CreateLendingAgreementDialog />
        </CardActions>
      </Card>
    );
  }
}

class CreateLendingAgreementDialog extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
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
        onTouchTap={this.handleClose}
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
          hello
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
