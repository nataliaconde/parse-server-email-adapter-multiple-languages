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

const { globalVars, sendTemplate, mandrillClient,  getMessageToSend, configureMessage } = require("./helpers");

MandrillAdapter = (mandrillOptions) => {
    if (!mandrillOptions) {
        throw new Error(ERRORS.missing_configuration);
    }

    const { apiKey, fromEmail , displayName, replyTo } = mandrillOptions;
    
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
        let text = configureMessage(options);
        let global_merge_vars = globalVars(mandrillOptions, options);

        let message = getMessageToSend(fromEmail, displayName, replyTo, text, options, global_merge_vars, mandrillOptions);

        return new Promise((resolve, reject) => {
            if (mandrillOptions.verificationTemplateName) {
                sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
            } else {
                mandrillClient(mandrill_client, message);
            }
        });
    }

    let sendPasswordResetEmail = options => {
        let text = configureMessage(options);
        let global_merge_vars = globalVars(mandrillOptions, options);

        let message = getMessageToSend(fromEmail, displayName, replyTo, text, options, global_merge_vars, mandrillOptions);

        return new Promise((resolve, reject) => {
            if (mandrillOptions.passwordResetTemplateName) {                
                sendTemplate(mandrill_client, mandrillOptions, message, resolve, reject)
            } else {
                mandrillClient(mandrill_client, message, resolve, reject);
            }
        });
    }

    let sendMail = options => {
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

module.exports = { MandrillAdapter };