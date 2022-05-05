import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  submitHandler = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have entered Ether! " });
  };
  clickHandler = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "A winner has been Picked" });
  };
  render() {
    // web3.eth.getAccounts().then(console.log);
    return (
      <div className="App">
        <h2 className="lotteryhunt">Decentralised LotteryHunt</h2>

        <div className="firstblock">
          <p className="owner">
            This is a application owner--
            <span className="manager">{this.state.manager}</span>
          </p>
          <p className="owner">
            As of now there are currently people join--
            <span className="manager">{this.state.players.length}</span>
          </p>
          <p className="owner">
            Total amount win--
            <span className="manager">
              {web3.utils.fromWei(this.state.balance, "ether")} Etherss!
            </span>
          </p>
        </div>
        <div className="secondblock">
          <form onSubmit={this.submitHandler}>
            <h3>Do you feel You are lucky? Try out this!</h3>
            <div>
              <label className="amountether">Amount of ether to enter</label>
              <input
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              />
            </div>
            <button>Enter</button>
          </form>
          <p className="amountether">Select a Winner!</p>
          <button onClick={this.clickHandler} className="button2">
            Winner
          </button>
          <h3 className="message">{this.state.message}</h3>
        </div>
      </div>
    );
  }
}
export default App;
