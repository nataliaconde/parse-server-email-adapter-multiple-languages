const 
    mandrill = require('mandrill-api/mandrill'),
    en_US = require("./default.json"),
    log = console.log,
    ERRORS = {
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

    let mandrill_client = new mandrill.Mandrill(mandrillOptions.apiKey);    

    mandrillOptions.replyTo =
        mandrillOptions.replyTo ||
        mandrillOptions.fromEmail;
    mandrillOptions.displayName =
        mandrillOptions.displayName ||
        mandrillOptions.replyTo;    

    mandrillOptions.customUserAttributesMergeTags = mandrillOptions.customUserAttributesMergeTags || [];    

    let sendVerificationEmail = options => {
        let language = configureLocale(options);
        let global_merge_vars = globalVars(mandrillOptions, options);

        return new Promise((resolve, reject) => {
            resolve("done")
        });

        
        
        // let message = getMessageToSend(fromEmail, displayName, replyTo, configMessage, options, global_merge_vars, mandrillOptions);
        
        // return new Promise((resolve, reject) => {
        //     if (mandrillOptions.verificationTemplateName) {
        //         sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
        //     } else {
        //         mandrillClient(mandrill_client, message);
        //     }
        // });
    }

    let sendPasswordResetEmail = options => {
        let global_merge_vars = globalVars(mandrillOptions, options);

        let message = getMessageToSend(fromEmail, displayName, replyTo, message, options, global_merge_vars)

        return new Promise((resolve, reject) => {
            if (mandrillOptions.passwordResetTemplateName) {                
                sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
            } else {
                mandrillClient(mandrill_client, message, resolve, reject);
            }
        });
    }

    let sendMail = options => {
        console.log(options)
        let message = {
          from_email: mandrillOptions.fromEmail,
          from_name: mandrillOptions.displayName,
          headers: {
            'Reply-To': mandrillOptions.replyTo
          },
          to: [{
            email: options.to
          }],
          subject: options.subject,
          text: options.text
        }
    
        return new Promise((resolve, reject) => {
          mandrill_client.messages.send(
            {
              message: message,
              async: true
            },
            resolve,
            reject
          )
      });
    }

    return Object.freeze({
        sendVerificationEmail: sendVerificationEmail,
        sendPasswordResetEmail: sendPasswordResetEmail,
        sendMail: sendMail
    });

}

getMessageToSend = (fromEmail, displayName, replyTo, message, options, global_merge_vars, mandrillOptions) =>{
    let email = (options.user.get("email"));
    return {
        from_email: fromEmail,
        from_name: displayName,
        headers: {
            'Reply-To': replyTo
        },
        to: [{  email: email}],
        subject: message.verificationSubject,
        text: message.verificationBody,
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

configureLocale = (options) =>{
    let language = options.user.get("localIndentifier");
    log(pathExists())
}

pathExists = () =>{
    let fs = require('fs'),
    path = '/path/to/my/file',
    stats;

    try {
        stats = fs.statSync(path);
        fs.readFile(path, {encoding: 'utf-8'}, function(err,data){
            if (!err) {
                stats = require("./default.json");
            } else {
                log("data", data)
                stats = data;
            }
        });
        console.log("File exists.");
    }
    catch (e) {
        stats = require("./default.json")
        console.log("File does not exist.");
    }
    return stats;
}

globalVars = (mandrillOptions, options) =>{
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

module.exports = { MandrillAdapter };