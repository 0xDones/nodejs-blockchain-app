const Blockchain = require('./index')
const Block = require('./block');
const { DIFFICULTY } = require('../config')

describe('Blockchain', () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    })

    it('1. Starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it('2. Adds a new block', () => {
        const data = 'foo'
        bc.addBlock(data)

        expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })

    it('3. Validates a valid chain', () => {
        bc.addBlock('foo')
        bc2.addBlock('foo');

        console.log(bc.chain.toString())
        console.log(bc2.chain.toString())

        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })

    it('4. Invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad Data';

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('5. Invalidates a corrupt chain', () => {
        bc2.addBlock('foo')
        bc2.chain[1].data = 'Not foo'

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('6. Replaces the chain with a valid chain', () => {
        bc2.addBlock('goo')
        bc.replaceChain(bc2.chain)

        expect(bc.chain).toEqual(bc2.chain)
    })

    it('7. Does not replace the chain with one of less than or equal to lenght', () => {
        bc.addBlock('foo')
        bc.replaceChain(bc2.chain)

        expect(bc.chain).not.toEqual(bc2.chain)
    })
})