'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const rp = require('request-promise');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        if (!this.$request.getAccessToken()){
            if (this.isAlexaSkill()) {
                this.tell('You must authenticate with your Amazon Account to use this skill');
            }
            else if (this.isGoogleAction()) {
                this.tell('You must sign in to use this Action');
            }
        }
        else {
            this.ask('Welcome to Vacation Buddy! Would you like to know your vacation balance?', 'Would you like to know your vacation balance?');
        }
    },

    async BalanceIntent() {
        let data;
        if (this.isAlexaSkill()) {
            let url = `https://api.amazon.com/user/profile?access_token=${this.$request.getAccessToken()}`;
    
            let response = await rp(url);
            data = JSON.parse(response);
        }
        else if (this.isGoogleAction()) {
            let token = this.$request.getAccessToken();
            let options = {
                method: 'GET',
                uri: 'https://vacationaccrualbuddy.auth0.com/userinfo',
                headers: {
                    authorization: 'Bearer ' + token,
                }
            };

            let response = await rp(options);
            data = JSON.parse(response);
        }
        this.tell(data.name + ', your vacation balance for the current pay period is 100 hours.');
    },

    'AMAZON.YesIntent'() {
        return this.toIntent('BalanceIntent');
    },

    'YesIntent'() {
        return this.toIntent('AMAZON.YesIntent');
    },

    'AMAZON.NoIntent'() {
        this.tell('Ok. Bye for now.');
    },

    'NoIntent'() {
        return this.toIntent('AMAZON.NoIntent');
    },

    'AMAZON.FallbackIntent'() {
        this.ask('I\'m sorry, I can\'t help with that, Would you like to know your vacation balance?', 'Would you like to know your vacation balance?');
    },

    'Default Fallback Intent'() {
        return this.toIntent('AMAZON.FallbackIntent');
    },
});

module.exports.app = app;
