    const path = require('path');
    const express = require('express');
	const axios = require('axios');
	const bodyParser = require('body-parser');
	const { URLSearchParams } = require('url'); // can also use form-data
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
	const client_id = '821655420410003497';
	const client_secret = '';

    const app = express();

    const port = process.env.PORT || '49681';

	function make_config(authorization_token) { // Define the function
		data = { // Define "data"
		  headers: { // Define "headers" of "data"
			"authorization": `Bearer ${authorization_token}` // Define the authorization
		  }
		};
		return data; // Return the created object
	  };


	app.use(express.urlencoded({ extended: false })); // configure the app to parse requests with urlencoded payloads
    app.use(express.json()); // configure the app to parse requests with JSON payloads
    app.use(bodyParser.text());
    app.use(express.static(path.join(__dirname + '/public')));

	app.get(`/`, (request, response) => {
		return response.sendFile(path.join(__dirname + '/index.html'));
	});
	

	app.get('/auth/discord',(request, response) => {
		response.sendFile(path.join(__dirname + '/public/Home.html'));
	});

/* Handle POST Requests */
app.post('/user', (req, res) => {
    /* Create our Form Data */
    const data_1 = new URLSearchParams();

    data_1.append('client_id', client_id);
    data_1.append('client_secret', client_secret);
    data_1.append('grant_type', 'authorization_code');
    data_1.append('redirect_uri', `http://localhost:${port}`);
    data_1.append('scope', 'identify');
    data_1.append('code', req.body);

    fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(data => {
        axios.get("https://discord.com/api/users/@me", make_config(data.access_token)).then(response => {
            res.status(200).send(response.data.username);
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
