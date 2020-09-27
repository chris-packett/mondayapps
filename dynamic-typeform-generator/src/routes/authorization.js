const mondaySdk = require('monday-sdk-js');
const express = require('express');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const fetch = require('node-fetch');
const tokenStoreService = require('../services/tokenStoreService');

const router = express.Router();

router.get('/authorization', (req, res) => {
    const { token } = req.query;

    return res.redirect('https://api.typeform.com/oauth/authorize?' +
        querystring.stringify({
            client_id: process.env.TYPEFORM_CLIENT_ID,
            redirect_uri: 'https://95f95139e587.ngrok.io/oauth/typeform/callback',
            state: token,
            scope: 'offline forms:read forms:write'
        })
    );
});

router.get('/oauth/typeform/callback', async (req, res) => {
    const { code, state } = req.query;
    const { userId } = jwt.verify(state, process.env.MONDAY_SIGNING_SECRET);

    const params = {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.TYPEFORM_CLIENT_ID,
        client_secret: process.env.TYPEFORM_CLIENT_SECRET,
        redirect_uri: 'https://95f95139e587.ngrok.io/oauth/typeform/callback',
    };

    const body = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const { access_token, refresh_token, expires_in } = await (await fetch('https://api.typeform.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })).json();

    await tokenStoreService.storeToken(userId, 'typeform', access_token, refresh_token, expires_in);

    return res.redirect('https://auth.monday.com/oauth2/authorize?' +
        querystring.stringify({
            client_id: process.env.MONDAY_CLIENT_ID,
            state
        })
    );
});

router.get('/oauth/monday/callback', async (req, res) => {
    const { code, state } = req.query;
    const { userId, backToUrl } = jwt.verify(state, process.env.MONDAY_SIGNING_SECRET);
    const { access_token, refresh_token, expires_in } = await mondaySdk({ state }).oauthToken(code, process.env.MONDAY_CLIENT_ID, process.env.MONDAY_CLIENT_SECRET);

    await tokenStoreService.storeToken(userId, 'monday', access_token, refresh_token, expires_in);

    return res.redirect(backToUrl);
});

module.exports = router;