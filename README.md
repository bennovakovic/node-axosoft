# node-axosoft
A time tracking nodejs app for axosoft

## Setup


### Create account settings file
Create a file called `account.js` in the base folder and put the following in it - replacing the deets accordingly:
```
var ACCOUNT = {
    'axosoft_domain': '',
    'axosoft_client_id' : ''
}
module.exports = ACCOUNT;
```

### Installing the app

Just run:
```
npm install
```

### Running the app

You can run the app by typing:
```
npm start
```


### Get an access token

The first time you run the app, you'll need to auth with axosoft, so just run and follow the steps:

```
/login
```


Once you've logged into axosoft and got the token, just save it via:

```
/token <token>
```

After you have completed this step, make sure you __restart the app__ to get the app to load the access token.


## Using the app

All commands are prefixed with `/` and can __kinda__ tab complete.

### To work on a feature:
```
/f <feature_ticket_id>
```

### To work on a bug:
```
/b <bug_ticket_id>
```

### To work on a chore:
```
/c <chore_ticket_id>
```

### Finishing work on a ticket

When you are finished working on the ticket, make sure you run `/finish`

```
/finish <optional message to log against the axosoft work log>
```

### Extra functionality:

If you want an add a work log, but continue work on the same ticket, you can type:

```
/log <some work log>
```


If you want to see the current timer since you ran `/f`, `/b` or `/c`:

```
/timer
```

