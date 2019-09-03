let mandrill = require('mandrill-api/mandrill');
const default_en = require("./default.json");

const ERRORS = {
    missing_configuration: 'MandrillAdapter requires configuration.',
    missing_mandrill_settings:
        'MandrillAdapter requires an API Key and a From Email Address',
    bad_template_config: 'MandrillAdapter templates are not properly configured.',
    user_details: "This module doesn't found a user"
};

MandrillAdapter = (mandrillOptions) => {
    if (!mandrillOptions) {
        throw new Error(ERRORS.missing_configuration);
    }

    const { apiKey, fromEmail , userDetails} = mandrillOptions;
    
    if (!apiKey || !fromEmail) {
        throw new Error(ERRORS.missing_mandrill_settings);
    } else {
        if (!userDetails){
            throw new Error(ERRORS.user_details);
        }
    }
   

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


    let user = {

    }

    let sendVerificationEmail = options => {
        var message = {
            from_email: mandrillOptions.fromEmail,
            from_name: mandrillOptions.displayName,
            headers: {
                'Reply-To': mandrillOptions.replyTo
            },
            to: [{
                
            }],
            subject: message.verificationSubject,
            text: mandrillOptions.verificationBody,
            global_merge_vars: global_merge_vars
        }

        return new Promise((resolve, reject) => {
            if (mandrillOptions.verificationTemplateName) {
                mandrill_client.messages.sendTemplate(
                    {
                        template_name: mandrillOptions.verificationTemplateName,
                        template_content: [],
                        message: message,
                        async: true
                    },
                    resolve,
                    reject
                )
            } else {
                mandrill_client.messages.send(
                    {
                        message: message,
                        async: true
                    },
                    resolve,
                    reject
                )
            }
        });
    }

    var sendPasswordResetEmail = options => {

        var global_merge_vars = [
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

        var message = {
            from_email: mandrillOptions.fromEmail,
            from_name: mandrillOptions.displayName,
            headers: {
                'Reply-To': mandrillOptions.replyTo
            },
            to: [{
                email: options.user.get("email") || options.user.get("username")
            }],
            subject: mandrillOptions.passwordResetSubject,
            text: mandrillOptions.passwordResetBody,
            global_merge_vars: global_merge_vars
        }

        return new Promise((resolve, reject) => {
            if (mandrillOptions.passwordResetTemplateName) {
                mandrill_client.messages.sendTemplate(
                    {
                        template_name: mandrillOptions.passwordResetTemplateName,
                        template_content: [],
                        message: message,
                        async: true
                    },
                    resolve,
                    reject
                )
            } else {
                mandrill_client.messages.send(
                    {
                        message: message,
                        async: true
                    },
                    resolve,
                    reject
                )
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