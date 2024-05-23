const IdentityService = require('../services/identityService');
import { Request, Response } from 'express';

exports.generateIdentity = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body;

        console.log('email', email);
        console.log('phoneNumber', phoneNumber);
        if (
            (email == undefined || email == null || email == '') &&
            (phoneNumber == undefined || phoneNumber == null || phoneNumber == '')
        ) {
            throw new Error('please provide email and phoneNumber in request').message;
        }

        const result = await IdentityService.checkIdentity(req, email, phoneNumber);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(400).send({ message: 'Something Gone Wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
};
