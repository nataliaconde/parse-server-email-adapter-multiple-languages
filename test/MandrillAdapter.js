const expect = require('chai').expect;
const Adapter = require('../index.js');

const config = {
    fromAddress: 'AwesomeApp <noreply@awesomeapp.com>',
    domain: 'yourmailgundomain.mailgun.org',
    apiKey: 'secretApiKey'
}

describe('MandrillAdapter', () => {
    throwsError = (args) => {
        console.log(Adapter.MandrillAdapter())
    }
    describe('initializing mandrill', () => {
        it('should fail if called without a configuration object', () => {
            expect(throwsError.bind(null, undefined)).to.throw('MandrillAdapter requires configuration.');
        });

        it('should fail if not called with an apiKey or fromEmail', () => {
            expect(throwsError.bind(null, { apiKey: '.', fromAddress: '.' })).to.throw('MandrillAdapter requires an API Key and a From Email Address');        
        });

        it('should fail if not send user', () => {
            expect(throwsError.bind(null, { apiKey: '.', fromAddress: '.' })).to.throw('MandrillAdapter requires an API Key and a From Email Address');        
        });
    })
    describe('templates', ()=>{
        it('', () => {
            const test_3 = {
                apiKey: '.', domain: '.', fromAddress: '.',
                templates: {
                    passwordResetEmail: { subject: '.' },
                    verificationEmail: { subject: '.' }
                }
            };
            expect(throwsError.bind(null, undefined)).to.throw('MandrillAdapter requires configuration.');
        });
    })
})