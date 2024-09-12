const express = require('express');
const crypto = require('crypto');

const app = express();
const secret = 'devmamgaintesting123';

app.use(express.urlencoded({
    extended: true,
    verify: (req, res, buf, encoding) => {
        const signature = req.headers['x-hub-signature'];
        if (!signature) {
            return res.status(403).send('No signature provided.');
        }

        const hmac = crypto.createHmac('sha1', secret);
        const digest = 'sha1=' + hmac.update(buf).digest('hex');

        if (signature !== digest) {
            return res.status(403).send('Signature mismatch.');
        }
    }
}));

app.use(express.json()); 
app.post('/webhook', (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received GitHub event: ${event}`);
    console.log('Payload:', payload);

    switch (event) {
        case 'push':
            console.log('Push event payload:', payload);
            break;
        case 'pull_request':
            console.log('Pull request event payload:', payload);
            break;
        case 'issues':
            console.log('Issue event payload:', payload);
            break;
        case 'create':
            console.log('Branch or tag created:', payload);
            break;
        case 'delete':
            console.log('Branch or tag deleted:', payload);
            break;
        default:
            console.log(`Unhandled event: ${event}`);
    }

    res.status(200).send('Event received.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
