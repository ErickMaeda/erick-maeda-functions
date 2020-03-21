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
            const { emailAddress, emailTemplateCode, name, reason, notes } = request.body;
            if (!emailAddress) {
                return response.status(500).send(errorResponse("The param emailAddress is required!"));
            }
            if (!emailTemplateCode) {
                return response.status(500).send(errorResponse("The param emailTemplateCode is required!"));
            }
            if (!name) {
                return response.status(500).send(errorResponse("The param name is required!"));
            }
            if (!reason) {
                return response.status(500).send(errorResponse("The param reason is required!"));
            }
            if (!notes) {
                return response.status(500).send(errorResponse("The param notes is required!"));
            }
    
            console.info('Request body -> ', request.body);
            const emailTemplate = await firestore().collection("emailTemplates").doc(emailTemplateCode).get()
            const emailTemplateFirestore = emailTemplate.data();
            const emailBodyHtml = emailTemplateFirestore?.template
                .split("{NAME}")
                .join(name)
                .split("{REASON}")
                .join(reason)
                .split("{NOTES}")
                .join(notes)
                .split("{EMAIL}")
                .join(emailAddress);

            console.info('emailTemplateFirestore', emailTemplateFirestore);

            sgMail.send({
                to: emailTemplateFirestore?.to,
                from: emailTemplateFirestore?.from,
                subject: emailTemplateFirestore?.subject,
                html: emailBodyHtml,
            });
            return response.send(successResponse());
        } catch (error) {
            return response.send(errorResponse(error.message));
        }
    }
);

export default api;