const SHA256 = require('crypto-js/sha256')
const { DIFFICULTY, MINE_RATE } = require('../config')
const ChainUtil = require('../chain-util');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0, 20)}
        Hash      : ${this.hash.substring(0, 20)}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty}
        Data      : ${this.data}
        `
  }

  //Can be used without instantiating the object
  static genesis() {
    return new this('Genesis Time', '------', 'f1r57-h45h', [], 0, DIFFICULTY)
  }

  static mineBlock(lastBlock, data) {

    const lastHash = lastBlock.hash;
    let hash, timestamp, nonce = 0;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = this.hash(timestamp, lastHash, data, nonce, difficulty)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this(timestamp, lastHash, hash, data, nonce, difficulty)
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
    return difficulty
  }
}

module.exports = Block;
