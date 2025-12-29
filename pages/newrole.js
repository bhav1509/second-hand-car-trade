import React, { Component } from "react";
import { Form, Button, Input, Message, Dropdown } from "semantic-ui-react";
import Layout from "../components/Layout";
import transaction from "../ethereum/transaction";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class CampaignNew extends Component {
  state = {
    address: "",
    role: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      if (this.state.role == "0") {
        await transaction.methods
          .addAdmin(this.state.address)
          .send({ from: accounts[0], gas: "1400000" });
      } else if (this.state.role == "1") {
        await transaction.methods
          .addCarDealer(this.state.address)
          .send({ from: accounts[0], gas: "1400000" });
      } else if (this.state.role == "2") {
        await transaction.methods
          .addCarMaintenance(this.state.address)
          .send({ from: accounts[0], gas: "1400000" });
      } else if (this.state.role == "3") {
        await transaction.methods
          .addSecondHandCarSale(this.state.address)
          .send({ from: accounts[0], gas: "1400000" });
      }
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>NEW ROLE</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Address</label>
            <Input
              label="wallet address"
              labelPosition="right"
              value={this.state.address}
              onChange={(event) =>
                this.setState({ address: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <select
              className="ui dropdown"
              onChange={(event) => this.setState({ role: event.target.value })}
            >
              <option value="">Role</option>
              <option value="0">Admin</option>
              <option value="1">Car Retailer</option>
              <option value="2">Car Maintenance</option>
              <option value="3">Second Hand Car Trade</option>
            </select>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
