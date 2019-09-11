const expect = require('chai').expect;
const Adapter = require('../index.js');

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
    })
    describe('sendEmail', ()=>{
        const Parse = {
            User: class User {
                get(arg) {
                    let value;
                    switch (arg) {
                        case 'username':
                            value = 'foo'
                            break;
                        case 'email':
                            value = 'foo@bar.com'
                            break;
                        case 'localIdentifier':
                            value = 'en_S'
                            break;
                    }
                    return value;
                }
            }
        };

        const user = new Parse.User();

        const config = {
            apiKey:"AAAAAA11AAA",
            fromEmail:"abc@test.br" 
        }

        const options = {
            displayName:"TEST",
            replyTo:"abc@abc.br",
            appName: "Test",
            user: user
        }
        
        it('test1', () => {
            let mandrill = Adapter.MandrillAdapter(config);
            mandrill.sendMail(options);       
        });

        // it('it should failed because api key is wrong', () => {
        //     let mandrill = Adapter.MandrillAdapter(config);
        //     mandrill.sendVerificationEmail(options).then(error=>{
        //         // console.log("e=:" + error)
        //         // expect(throwsError.bind(null, config)).to.throw('MandrillAdapter requires configuration.');
        //     })            
        // });
    })
})