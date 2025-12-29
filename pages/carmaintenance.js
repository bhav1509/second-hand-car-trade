import React, { Component } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Transaction from "../ethereum/transaction";
import web3 from "../ethereum/web3";
import { Link, Router } from "../routes";
import Layout from "../components/Layout";

class RequestNew extends Component {
  state = {
    vehicleNumber: "",
    date: "",
    location: "",
    maintenanceDetails: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();

      await Transaction.methods
        .maintenance(
          this.state.vehicleNumber,
          this.state.date,
          this.state.location,
          this.state.maintenanceDetails
        )
        .send({ from: accounts[0], gas: "1400000" });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/`}>
          <a>Back</a>
        </Link>
        <h3>Car Maintenance Transaction</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Vehicle Number</label>
            <Input
              value={this.state.vehicleNumber}
              onChange={(event) =>
                this.setState({ vehicleNumber: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Date</label>
            <Input
              value={this.state.date}
              onChange={(event) => this.setState({ date: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Location</label>
            <Input
              value={this.state.location}
              onChange={(event) =>
                this.setState({ location: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Car Maintenance Details</label>
            <div className="field">
              <textarea
                value={this.state.maintenanceDetails}
                onChange={(event) =>
                  this.setState({ maintenanceDetails: event.target.value })
                }
              ></textarea>
            </div>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
