const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');

describe('Wallet', () => {
  let tp, wallet;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4oands-reci1pe';
      console.log('Creating first tx')
      transaction = wallet.createTransaction(recipient, sendAmount, tp);

    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        console.log('Creating second tx')
        transaction = wallet.createTransaction(recipient, sendAmount, tp);
      });

      it('should doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it('clone the `sendAmount` output for the recipient', () => {
        expect(
          transaction.outputs
            .filter(output => output.address === recipient)
            .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });

    });
  });

});
