// https://medium.com/valist/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a

import React from 'react'; 
import { useState, useEffect } from 'react';

import './App.css';

import Web3 from 'web3';

import {ABI,contractAddress} from './ABI_Contract';

function App() {
  const [networkID, setnetworkID] = useState('');

  const [network, setnetwork] = useState('');

  const [ account, setaccount ] = useState({accountid:'', balance:''});

  const [ name, setName ] = useState('');
  const [ symbol, setSymbol] = useState('');
  const [ decimals, setDecimals] = useState('');
  const [ totalSupply, setTotalSupply] = useState('');
  const [ tBalance, setTBalance] = useState('');
  const [ minter, setMinter ] = useState('');

  //Reload the page
  const refresh = async () => {
    window.location.reload();
  }

  const getToken = async () => {
    let w3 = null;

    if(window.ethereum){
      w3 = new Web3(window.ethereum);
      console.log('Web3:',w3);
      //const accounts = await ethereum.send('eth_requestAccounts');
    }
    else{
      alert('Please install MetaMask to use this dApp');
      return;
    }


    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    //const accounts = await w3.eth.getAccounts();
    //const accounts = await ethereum.send('eth_requestAccounts');
    console.log('accounts >',accounts);
    const tc = new w3.eth.Contract(ABI,contractAddress);

    const name = await tc.methods.name().call();
    const symbol = await tc.methods.symbol().call();
    const totalSupply = await tc.methods.totalSupply().call();
    const decimals = await tc.methods.decimals().call();
    const minter = await tc.methods._minter().call();
    const tBalance = await tc.methods.balanceOf(accounts[0]).call();

    setName( name ); 
    setSymbol( symbol );
    setTotalSupply( totalSupply );
    setDecimals( decimals );
    setTBalance( tBalance );
    setMinter( minter );
  }

  const loadBlock = async() =>{
    let web3 = null;

    try {
      if(window.ethereum){
        web3 = new Web3(window.ethereum);
        console.log('web3',web3);
      } else{
        alert ('Please install MetaMask');
        return;
      }
      
      //Old Version
      //const web3 = new Web3 ( Web3.givenProvider || "http://localhost:8545" );

      const networkType = await web3.eth.net.getNetworkType();
      setnetwork(networkType);

      const networkID = await web3.eth.net.getId();
      setnetworkID(networkID);

      //const accounts = await web3.eth.getAccounts();
      //const accounts = await ethereum.send('eth_requestAccounts');
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      const balance = await web3.eth.getBalance(accounts[0]);

      setaccount({accountid:accounts[0],balance:balance/1e18}); //Balance converted in Ether

      const blockinfo = await web3.eth.getBlock('latest');

      console.log('block info: ',blockinfo);


    }
    catch(error){
      console.log();
    }
  }

  //Solo se ejecuta una vez, es como el initState
  useEffect (() => {
    loadBlock(); 
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <div className='container'>
      <h2> React / JS / Web3 / MetaMask / BlockChain / Solidity Smart Contracts</h2>
      <p> Net ID: <span style={{color:'orange',fontWeight:'bold'}}>{ networkID }  </span>  </p>
      <p> Net Type: <span style={{color:'orange',fontWeight:'bold'}}>{ network }</span> </p>
      <p> My Account: <span className='clearText' > { account.accountid } </span> </p>
      <p> My Balance: <span className='clearText'> { account.balance }</span> Ether </p>
      <p>____________________________________________________</p>
      <p> Token name: <span className='clearText'> { name }</span></p>
      <p> Symbol: <span className='clearText'> { symbol }</span></p>
      <p> Minter: <span className='clearText'> { minter }</span></p>
      <p> TotalSupply: <span className='clearText'> { totalSupply }</span></p>
      <p> Decimals: <span className='clearText'> { decimals }</span></p>
      <p> My Token Bal: <span className='clearText'> { tBalance }</span></p>
      
      {/* <p> Latest block:  { block } </p> */}
      <div className='btngroup'>
      <button className='btn2' onClick={ () => refresh() } > Refresh </button>
      <button className='btn2' onClick={ () => getToken() } > Token </button>
      </div>
      </div>
    </div>
  );

}

export default App;

/*
LINKS
https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
*/