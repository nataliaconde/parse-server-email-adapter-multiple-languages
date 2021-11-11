const log = console.log,
    en_US = require("./default.json");

globalVars = (mandrillOptions, options) => {
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

mandrillClient = (mandrill_client, message, resolve, reject) => {
    return mandrill_client.messages.send(
        {
            message: message,
            async: true
        },
        resolve,
        reject
    )
}

getMessageToSend = (fromEmail, displayName, replyTo, message, options, global_merge_vars) => {
    let email = (options.user.get("email"));
    return {
        from_email: fromEmail,
        from_name: displayName,
        headers: {
            'Reply-To': replyTo
        },
        to: [{
            email: email
        }],
        subject: message.verificationSubject,
        text: message.verificationBody,
        global_merge_vars: global_merge_vars
    }
}

configureSendEmailMessage = (mandrillOptions, options, text) => {
    let message = {
        from_email: mandrillOptions.fromEmail,
        from_name: mandrillOptions.displayName,
        headers: {
            'Reply-To': mandrillOptions.replyTo
        },
        to: [{
            email: options.to
        }],
        subject: text.subject,
        text: text.text
    }

    return message;

}

configureMessage = (options, mandrillOptions) => {
    let language = options.user.get("localeIdentifier")
    let file = pathExists(mandrillOptions.pathFile);

    if (file[language] === undefined) {
        return en_US["en_US"];
    } else {
        return file[language];
    }
}

pathExists = (pathFile) => {
    let fs = require('fs');
    let file;

    try {
        fs.statSync(pathFile);
        file = fs.readFileSync(pathFile, 'utf-8');
        file = JSON.parse(file);
    }
    catch (e) {
        file = require("./default.json");
        console.log(e.message)
    }
    return file;
}

module.exports = {
    globalVars: globalVars,
    sendTemplate,
    mandrillClient,
    getMessageToSend,
    configureMessage: configureMessage,
    configureSendEmailMessage: configureSendEmailMessage
}