import { errorResponse } from '../utils';
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const api = express();
api.use(cors({ origin: true }));
api.post(
    '/',
    async (request: any, response: any) => {
        const msg = {
            to: 'test@example.com',
            from: 'test@example.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgMail.send(msg);

        
        console.log(request, request.body, request.params);
        const { emailAddress, emailTemplateCode } = request.body;
        if (!emailAddress) {
            return response.status(500).send(errorResponse("The param emailAddress is required!"));
        }
        if (!emailTemplateCode) {
            return response.status(500).send(errorResponse("The param emailTemplateCode is required!"));
        }
    }
);

export default api;