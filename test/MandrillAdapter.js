const expect = require('chai').expect;
const Adapter = require('../index.js');
const log = console.log
const sendVerificationEmailTest = require("./sendVerificationEmailTest");

describe('MandrillAdapter', () => {
    throwsError = (args) => {
        Adapter.MandrillAdapter(args)
    }
    describe('initializing mandrill', () => {
        it('should fail if called without a configuration object', () => {
            expect(throwsError.bind(null, undefined)).to.throw('MandrillAdapter requires configuration.');
        });

        it('should fail if not called with an apiKey or fromEmail', () => {
            expect(throwsError.bind(null, { apiKey: '.', fromAddress: '.' })).to.throw('MandrillAdapter requires an API Key and a From Email Address');        
        });
    });

    describe('API Keys', ()=>{
        it('should faild if API Keys is wrong', () => {
            sendVerificationEmailTest.sendMessageTest(Adapter).then(result=>{
                expect(result.message).to.throw('Invalid API key');
            }).catch(error=>{
                expect(error.message).to.eql('Invalid API key');
            });
        });
    });

    describe('Localization', ()=>{
        it('Test Message - undefined localeIdentifier', () => {
            sendVerificationEmailTest.localeIdentifierUndefined(Adapter).then(result=>{
                expect(Object.keys(result).length).greaterThan(0)
            })
        });
        it('Test Message - set localeIdentifier', () => {
            sendVerificationEmailTest.localeIdentifierUndefined(Adapter, "pt_BR").then(result=>{
                expect(Object.keys(result).length).greaterThan(0)
            })
        });
    });
})