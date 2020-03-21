import { errorResponse, successResponse } from '../utils';
import { firestore } from 'firebase-admin';
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const api = express();

sgMail.setApiKey("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");
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
                html: emailBodyHtml,
            };
            console.info('Request Email -> ', emailOptions);

            sgMail.send(emailOptions);
            return response.send(successResponse({ version: 2 }));
        } catch (error) {
            return response.send(errorResponse(error.message));
        }
    }
);

export default api;