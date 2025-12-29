import React, { Component } from "react";
import Layout from "../components/Layout";
import { Input, Button } from "semantic-ui-react";
import Transaction from "../ethereum/transaction";
import { Link } from "../routes";

class CampaignIndex extends Component {
  state = {
    vehicleNumber: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const transaction = await Transaction.methods
        .displayAll(this.state.vehicleNumber)
        .call();
      console.log(
        await Transaction.methods.displayAll(this.state.vehicleNumber).call()
      );
      this.setState({ transactions: transaction });
      // Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <div>
          <div className="ui grid">
            <div className="twelve wide column">
              <div className="ui search">
                <div className="ui icon input" style={{ width: "100%" }}>
                  <Input
                    placeholder="Search Car"
                    value={this.state.vehicleNumber}
                    onChange={(event) =>
                      this.setState({ vehicleNumber: event.target.value })
                    }
                    style={{ width: "100%" }}
                  />
                  <button className="big ui button" style={{ width: "50px" }}>
                    <i
                      className="search icon"
                      style={{ alignSelf: "centre" }}
                      onClick={this.onSubmit}
                    ></i>
                  </button>
                </div>
              </div>

              {this.state.transactions &&
                this.state.transactions.map((transaction, index) => (
                  <div key={index}>
                    <div style={{ height: "5px" }}></div>
                    <div class="ui card" style={{ width: "100%" }}>
                      <div class="content">
                        <div class="right floated meta">
                          {transaction.date}, {transaction.location}
                        </div>
                        <div class="header">{transaction.VIN}</div>

                        <span>
                          DETAILS:
                          <br /> {transaction.details}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="four wide column">
              <div
                className="ui vertical primary buttons"
                style={{ padding: "0px" }}
              >
                <Link route="/newcar">
                  <a>
                    {" "}
                    <button
                      className="big ui button"
                      style={{ padding: "20px" }}
                    >
                      Create New Car
                    </button>
                  </a>
                </Link>
                <div style={{ height: "10px" }}></div>
                <Link route="/carmaintenance">
                  <a>
                    <button
                      className="big ui button"
                      style={{ padding: "20px" }}
                    >
                      Car Maintenance
                    </button>
                  </a>
                </Link>
                <div style={{ height: "10px" }}></div>
                <Link route="/changeowner">
                  <a>
                    <button
                      className="big ui button"
                      style={{ padding: "20px" }}
                    >
                      Second Hand Car
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
