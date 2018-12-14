'use strict';

const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = { chain: 'CHAIN', transaction: 'TRANSACTION' };

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = []
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT })

    // Listen to events, new socket connected to the P2P Server
    server.on('connection', socket => this.connectSocket(socket))

    this.connectToPeers();
    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`)
  }

  //Connect new peers to running peers
  connectToPeers() {
    peers.forEach(peer => {
      // ws://localhost:3001
      const socket = new Websocket(peer)

      socket.on('open', () => this.connectSocket(socket))
    })
  }

  //Saves new peers to sockets array, for every peer
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected')

    this.messageHandler(socket)

    //For each new connected peer, all peers send their blockchains
    this.sendChain(socket);
  }

  messageHandler(socket) {
    //triggered by a send function
    socket.on('message', message => {

      const data = JSON.parse(message);
      switch (data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
    })
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

}

module.exports = P2pServer;
