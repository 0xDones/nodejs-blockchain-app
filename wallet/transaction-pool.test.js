const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'RANDOM-ADDRESS', 30)
    tp.updateOrAddTransaction(transaction);
  });

  it('should adds a transaction to the poll', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('should updates a transaction in the poll', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-bar0', 40);
    tp.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction)
  });

});
