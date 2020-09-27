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
            redirect_uri: 'https://cf97f8db3b3b.ngrok.io/oauth/typeform/callback',
            state: token,
            scope: 'forms:read forms:write'
        })
    );
});

router.get('/oauth/typeform/callback', async (req, res) => {
    const { code, state } = req.query;

    const params = {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.TYPEFORM_CLIENT_ID,
        client_secret: process.env.TYPEFORM_CLIENT_SECRET,
        redirect_uri: 'https://cf97f8db3b3b.ngrok.io/oauth/typeform/callback',
    };

    const body = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const oauthToken = await (await fetch('https://api.typeform.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })).json();

    await tokenStoreService.storeToken('typeform', oauthToken.access_token);

    return res.redirect('https://auth.monday.com/oauth2/authorize?' +
        querystring.stringify({
            client_id: process.env.MONDAY_CLIENT_ID,
            state
        })
    );
});

router.get('/oauth/monday/callback', async (req, res) => {
    const { code, state } = req.query;
    const { userId, accountId, backToUrl } = jwt.verify(state, process.env.MONDAY_SIGNING_SECRET);
    const oauthToken = await mondaySdk({ state }).oauthToken(code, process.env.MONDAY_CLIENT_ID, process.env.MONDAY_CLIENT_SECRET);

    await tokenStoreService.storeToken('monday', oauthToken);

    return res.redirect(backToUrl);
});

module.exports = router;