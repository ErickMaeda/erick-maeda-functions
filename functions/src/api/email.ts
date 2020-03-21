import { errorResponse, successResponse } from '../utils';
import { firestore } from 'firebase-admin';
const express = require('express');
const cors = require('cors');
const api = express();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
api.use(cors({ origin: true }));
api.post(
    '/',
    async (request: any, response: any) => {
        try {
            const { emailTemplateCode } = request.body;
            if (!emailTemplateCode) {
                return response.status(500).send(errorResponse("The param emailTemplateCode is required!"));
            }

            console.info('Request body -> ', request.body);
            const emailTemplate = await firestore().collection("emailTemplates").doc(emailTemplateCode).get()
            const emailTemplateFirestore = emailTemplate.data();

            let emailBodyHtml = emailTemplateFirestore?.template;
            emailTemplateFirestore?.params.forEach((element: string) => {
                emailBodyHtml = emailBodyHtml.split(`{${element}}`).join(request.body[element.toLowerCase()])
            });

            const emailOptions = {
                to: emailTemplateFirestore?.to,
                from: emailTemplateFirestore?.from,
                subject: emailTemplateFirestore?.subject,
                text: emailBodyHtml,
                html: emailBodyHtml
            };
            console.info('Request Email Options -> ', emailOptions);

            const emailResult = await sgMail.send(emailOptions);

            console.info('Request Email Result -> ', emailResult);
            return response.send(successResponse({ version: 6 }));
        } catch (error) {
            return response.send(errorResponse(error.message));
        }
    }
);

export default api;