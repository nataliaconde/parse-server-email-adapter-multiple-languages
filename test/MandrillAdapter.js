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
        it('should faild if email address is wrong', () => {
            sendVerificationEmailTest.localeIdentifierUndefined(Adapter).then(result=>{
                log(result)
                expect(result.message).to.throw('Invalid API key');
            }).catch(error=>{
                log(error)
            });
        });

        it('should faild if API Keys is wrong', () => {

        });
    });

    describe('sendVerificationEmail', ()=>{
        it('localeIdentifier isnt defined', () => {
            sendVerificationEmailTest.localeIdentifierUndefined(Adapter).then(result=>{
                expect(result.message).to.throw('Invalid API key');
            }).catch(error=>{
                expect(error.message).to.eql('Invalid API key');
            })
        });
        it('localeIdentifier is defined', () => {
            sendVerificationEmailTest.localeIdentifierUndefined(Adapter, "en_US").then(result=>{
                expect(result.message).to.throw('Invalid API key');
            }).catch(error=>{
                expect(error.message).to.eql('Invalid API key');
            })
        });
    });

    // describe('sendPasswordResetEmail', ()=>{
    //     it('localeIdentifier isnt defined', () => {
    //         sendVerificationEmailTest.localeIdentifierUndefined(Adapter).then(result=>{
    //             expect(result.message).to.throw('Invalid API key');
    //         }).catch(error=>{
    //             expect(error.message).to.eql('Invalid API key');
    //         })
    //     });
    //     it('localeIdentifier is defined', () => {
    //         sendVerificationEmailTest.localeIdentifierUndefined(Adapter, "en_US").then(result=>{
    //             expect(result.message).to.throw('Invalid API key');
    //         }).catch(error=>{
    //             expect(error.message).to.eql('Invalid API key');
    //         })
    //     });

    // });

    // describe('sendMail', ()=>{

    // });

})