'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

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
        this.ask('Hey John! Would you like to know your vacation balance?', 'Would you like to know your vacation balance?');
    },

    BalanceIntent() {
        this.tell('John, your vacation balance for the current pay period is 100 hours.');
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
