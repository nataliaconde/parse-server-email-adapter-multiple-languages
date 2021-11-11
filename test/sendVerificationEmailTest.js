const log = console.log
const helpers = require("../helpers")
const configWrong = {
    apiKey:"AAAAAA11AAA",
    fromEmail:"abc@test.br" 
}

const correctKeys = {
    apiKey:"ed6be5d5420333680786a5719733c1cb-us4",
    fromEmail:"abc@test.br" 
}

ParseUser = (localeIdentifier) =>{
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
                    case 'localeIdentifier':
                        value = localeIdentifier
                        break;
                }
                return value;
            }
        }
    };

    const user = new Parse.User();
    return user;
}

sendMessageTest = async(Adapter, value) =>{
    const user = ParseUser(value);

    const options = {
        displayName:"TEST",
        replyTo:"abc@abc.br",
        appName: "Test",
        user: user
    }
    

    let mandrill = Adapter.MandrillAdapter(correctKeys);
    let result = await mandrill.sendMail(options);
    result.then(message=>{
        return message
    }).catch(error=>{
        return error
    })
}

localeIdentifierUndefined = async(Adapter, value) =>{
    const user = ParseUser(value);

    const options = {
        displayName:"TEST",
        replyTo:"abc@abc.br",
        appName: "Test",
        pathFile: "/home/natalia/projects/parse-server-email-adapter-multiple-languages/locale.json",
        user: user
    }
    
    const file = helpers.configureMessage(options);
    return file;
}

module.exports = {
    sendMessageTest,
    localeIdentifierUndefined
}