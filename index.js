let mandrill = require('mandrill-api/mandrill');
const default_en = require("./default.json");

const log = console.log;

const ERRORS = {
    missing_configuration: 'MandrillAdapter requires configuration.',
    missing_mandrill_settings:
        'MandrillAdapter requires an API Key and a From Email Address',
    bad_template_config: 'MandrillAdapter templates are not properly configured.'
};

MandrillAdapter = (mandrillOptions) => {
    if (!mandrillOptions) {
        throw new Error(ERRORS.missing_configuration);
    }

    const { apiKey, fromEmail , displayName, replyTo} = mandrillOptions;
    
    if (!apiKey || !fromEmail) {
        throw new Error(ERRORS.missing_mandrill_settings);
    }

    let sendVerificationEmail = options => {
        log(options)
        let global_merge_vars = globalVars(mandrillOptions, options);

        let configMessage = configureText(options.user)

        let message = getMessageToSend(fromEmail, displayName, replyTo, configMessage, options, global_merge_vars)
        
        return new Promise((resolve, reject) => {
            if (mandrillOptions.verificationTemplateName) {
                sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
            } else {
                sendMail(mandrill_client, message);
            }
        });
    }

    let sendPasswordResetEmail = options => {
        let global_merge_vars = globalVars(mandrillOptions, options);

        let message = getMessageToSend(fromEmail, displayName, replyTo, message, options, global_merge_vars)

        return new Promise((resolve, reject) => {
            if (mandrillOptions.passwordResetTemplateName) {                
                sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
            } else {
                sendMail(mandrill_client, message, resolve, reject);
            }
        });
    }

    let sendMail = options => {
        let global_merge_vars = globalVars(mandrillOptions, options);

        let message = getMessageToSend(fromEmail, displayName, replyTo, message, options, global_merge_vars)

        return new Promise((resolve, reject) => {
            sendMail(mandrill_client, message, resolve, reject);
        });       
    }

    return Object.freeze({
        sendVerificationEmail: sendVerificationEmail,
        sendPasswordResetEmail: sendPasswordResetEmail,
        sendMail: sendMail
    });

}

globalVars = (mandrillOptions, options) =>{
    log(options)
    let global_merge_vars = [
        { name: 'appname', content: options.appName },
        { name: 'username', content: options.user.get("username") },
        { name: 'email', content: options.user.get("email") },
        { name: 'link', content: options.link }
    ];

    if (typeof mandrillOptions.customUserAttributesMergeTags !== 'undefined') {
        for (var extra_attr of mandrillOptions.customUserAttributesMergeTags) {
            global_merge_vars.push({ name: extra_attr, content: options.user.get(extra_attr) || '' });
        }
    }

    return global_merge_vars;
}

getMessageToSend = (fromEmail, displayName, replyTo, message, options, global_merge_vars) =>{
    return {
        from_email: fromEmail,
        from_name: displayName,
        headers: {
            'Reply-To': replyTo
        },
        to: [{  email: options.user.get("email") }],
        subject: message.verificationSubject,
        text: mandrillOptions.verificationBody,
        global_merge_vars: global_merge_vars
    }
}

mandrillClient = (mandrill_client, message, resolve, reject) =>{
    return mandrill_client.messages.send(
        {
            message: message,
            async: true
        },
        resolve,
        reject
    )
}

sendTemplate = (mandrill_client, mandrillOptions, message, resolve, reject) => {
    return mandrill_client.messages.sendTemplate(
        {
            template_name: mandrillOptions.passwordResetTemplateName,
            template_content: [],
            message: message,
            async: true
        },
        resolve,
        reject
    );
}

configureText = (options) =>{
    let language = options.get("localIndentifier");

    if(!language){

    } else { 
        
    }
}

module.exports = { MandrillAdapter };