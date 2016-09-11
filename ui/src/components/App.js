import React, { Component, PropTypes } from 'react';

import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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
    return this.renderBalancesCard();
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
}
