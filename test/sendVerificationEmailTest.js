const log = console.log

const configWrong = {
    apiKey:"AAAAAA11AAA",
    fromEmail:"abc@test.br" 
}

const correctKeys = {
    apiKey:"AAAAAA11AAA",
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

localeIdentifierUndefined = async(Adapter, value) =>{
    const user = ParseUser(value);

    console.log("user => ", user.get("localeIdentifier"))

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

module.exports = {
    localeIdentifierUndefined
}