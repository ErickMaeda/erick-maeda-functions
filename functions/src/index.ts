import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import emailApi from './api/email';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

admin.initializeApp();

exports.email = functions.https.onRequest(emailApi);
