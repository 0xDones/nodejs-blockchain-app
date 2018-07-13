const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
    }

    toString() {
        return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0, 20)}
        Hash     : ${this.hash.substring(0, 20)}
        Data     : ${this.data}
        `
    }

    //Can be used without instantiating the object
    static genesis() {
        return new this('Genesis Time', '------', 'f1r57-h45h', [])
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now()
        const lastHash = lastBlock.hash;
        const hash = this.hash(timestamp, lastHash, data)

        return new this(timestamp, lastHash, hash, data)
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString()
    }
}

module.exports = Block;