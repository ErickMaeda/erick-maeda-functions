import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import emailApi from './api/email';

admin.initializeApp();

exports.email = functions.https.onRequest(emailApi);
