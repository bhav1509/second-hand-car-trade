const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledTransaction = require("../ethereum/build/transaction.json");

let accounts;
let transaction;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  transaction = await new web3.eth.Contract(compiledTransaction.abi)
    .deploy({ data: compiledTransaction.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1600000" });
});

describe("Transaction", () => {
  it("deploys a transaction contract", () => {
    assert.ok(transaction.options.address);
  });

  it("marks the creator of the contract with admin role", async () => {
    const admin = await transaction.methods.admin(accounts[0]).call();
    assert.equal(admin, true);
  });

  it("only admin role is provided to the creator of the transaction contract", async () => {
    const adminRole = await transaction.methods.admin(accounts[0]).call();
    assert.equal(adminRole, true);
    const carDealerRole = await transaction.methods
      .carDealer(accounts[0])
      .call();
    assert.equal(carDealerRole, false);
    const carMaintenanceRole = await transaction.methods
      .carMaintenance(accounts[0])
      .call();
    assert.equal(carMaintenanceRole, false);
    const secondHandCarSaleRole = await transaction.methods
      .secondHandCarSale(accounts[0])
      .call();
    assert.equal(secondHandCarSaleRole, false);
  });

  it("admin gives another address Admin Role successfully", async () => {
    const adminRoleBefore = await transaction.methods.admin(accounts[1]).call();
    assert.equal(adminRoleBefore, false);
    await transaction.methods
      .addAdmin(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });
    const adminRoleAfter = await transaction.methods.admin(accounts[1]).call();
    assert.equal(adminRoleAfter, true);

    const carDealerRole = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerRole, false);
    const carMaintenanceRole = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceRole, false);
    const secondHandCarSaleRole = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleRole, false);
  });

  it("admin gives Car Dealer Role successfully", async () => {
    const carDealerBefore = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerBefore, false);

    await transaction.methods
      .addCarDealer(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carDealerAfter = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerAfter, true);

    const adminRole = await transaction.methods.admin(accounts[1]).call();
    assert.equal(adminRole, false);
    const carMaintenanceRole = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceRole, false);
    const secondHandCarSaleRole = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleRole, false);
  });

  it("admin gives Car Maintenance Role successfully", async () => {
    const carMaintenanceBefore = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceBefore, false);

    await transaction.methods
      .addCarMaintenance(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carMaintenanceAfter = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceAfter, true);

    const adminRole = await transaction.methods.admin(accounts[1]).call();
    assert.equal(adminRole, false);
    const carDealerRole = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerRole, false);
    const secondHandCarSaleRole = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleRole, false);
  });

  it("admin gives Second Hand Car Sale Role successfully", async () => {
    const secondHandCarSaleBefore = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleBefore, false);

    await transaction.methods
      .addSecondHandCarSale(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const secondHandCarSaleAfter = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleAfter, true);

    const adminRole = await transaction.methods.admin(accounts[1]).call();
    assert.equal(adminRole, false);
    const carDealerRole = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerRole, false);
    const carMaintenanceRole = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceRole, false);
  });

  it("newCar called by CarDealer", async () => {
    await transaction.methods
      .addCarDealer(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carDealerAfter = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerAfter, true);

    await transaction.methods
      .newCar("KA 01 ML 6925", "20/04/2023", "Bangalore", "Honda City")
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory[0][1], "20/04/2023");
  });

  it("maintenance called by CarMaintenance", async () => {
    await transaction.methods
      .addCarMaintenance(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carMaintenanceAfter = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceAfter, true);

    await transaction.methods
      .maintenance(
        "KA 01 ML 6925",
        "24/04/2023",
        "Bangalore",
        "Car Maintenance"
      )
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory[0][1], "24/04/2023");
  });

  it("changeOwner called by SecondHandCarSale", async () => {
    await transaction.methods
      .addSecondHandCarSale(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const secondHandCarSaleAfter = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleAfter, true);

    await transaction.methods
      .changeOwner("KA 01 ML 6925", "24/10/2023", "Bangalore", "Owner Changed")
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory[0][1], "24/10/2023");
  });

  it("complete test", async () => {
    await transaction.methods
      .addCarDealer(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carDealerAfter = await transaction.methods
      .carDealer(accounts[1])
      .call();
    assert.equal(carDealerAfter, true);

    await transaction.methods
      .newCar("KA 01 ML 6925", "20/04/2023", "Bangalore", "Honda City")
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory[0][1], "20/04/2023");

    await transaction.methods
      .addCarMaintenance(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const carMaintenanceAfter = await transaction.methods
      .carMaintenance(accounts[1])
      .call();
    assert.equal(carMaintenanceAfter, true);

    await transaction.methods
      .maintenance(
        "KA 01 ML 6925",
        "24/04/2023",
        "Bangalore",
        "Car Maintenance"
      )
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory1 = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory1[1][1], "24/04/2023");

    await transaction.methods
      .addSecondHandCarSale(accounts[1])
      .send({ from: accounts[0], gas: "1400000" });

    const secondHandCarSaleAfter = await transaction.methods
      .secondHandCarSale(accounts[1])
      .call();
    assert.equal(secondHandCarSaleAfter, true);

    await transaction.methods
      .changeOwner("KA 01 ML 6925", "24/10/2023", "Bangalore", "Owner Changed")
      .send({ from: accounts[1], gas: "1400000" });

    const carHistory2 = await transaction.methods
      .displayAll("KA 01 ML 6925")
      .call();
    assert.equal(carHistory2[2][1], "24/10/2023");
  });
});
