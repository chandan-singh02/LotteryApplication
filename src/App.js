import tiger from "./ForkastPlus-Tiger-NFT.png";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import React, { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState("");
  function refreshPage(event) {
    window.location.reload(false);
    event.preventDefault();
  }
  const getManager = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
  };

  const getplayers = async () => {
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
  };

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  };

  useEffect(() => {
    getManager();
    getplayers();
    getBalance();
  }, [balance]);

  //each players join or enter the ether
  const EthersubmitHandler = async (event) => {
    event.preventDefault();
    setLoader(!loader);
    // setMessage("Waiting on transaction success...");

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setLoader(false);
    setMessage("You have been entered");
    refreshPage();
  };

  //manager will select the Winner
  const pickHandler = async () => {
    const accounts = await web3.eth.getAccounts();
    setLoader(!loader);
    // setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setLoader(false);
    setMessage("Winner has been picked");
    refreshPage();
  };
  return (
    <div className="App">
      <h2 className="lotteryhunt">
        Decentralised <img src={tiger} className="tiger" /> LotteryHunt
      </h2>
      <div className="firstblock">
        <p className="owner">
          This is a application Owner
          <span className="manager"> {manager}</span>
        </p>
        <p className="owner">
          As of now there are currently people join--
          <span className="manager">{players.length}</span>
        </p>
        <p className="owner">
          Total amount win--
          <span className="manager">
            {web3.utils.fromWei(balance, "ether")} Etherss!
          </span>
        </p>
      </div>
      <div className="secondblock">
        <form onSubmit={EthersubmitHandler}>
          <h3>Do you feel You are lucky? Try out this!</h3>
          <div>
            <label className="amountether">Amount of ether to enter</label>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <button>Enter</button>
        </form>
        <p className="amountether">Select a Winner!</p>
        <button onClick={pickHandler} className="button2">
          Winner
        </button>
      </div>

      {loader ? (
        <TailSpin color="green" height={40} width={40} />
      ) : (
        <h2>{message}</h2>
      )}
    </div>
  );
};

export default App;
