<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Twilio Flex Plugin - Hours Of Operations Queue Filter 

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the APIs, check out our [Flex documentation](https://www.twilio.com/docs/flex).

This plugin 

The included assets contains a sample hoops.js file, defining when each "queue" is open or closed.  This file MUST be edited to reflect actual business operating hours.

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node > 12 (and recommend the _even_ versions of Node). Afterwards, install the dependencies by running `npm install`:

```bash
cd 

# If you use npm
npm install
```

Next, please install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) by running:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install BOTH the [Flex Plugin extension](https://www.twilio.com/docs/flex/developer/plugins/cli/install) and the [Serverless Plugin extension](https://www.twilio.com/docs/labs/serverless-toolkit).

To install the [Flex Plugin extension](https://www.twilio.com/docs/flex/developer/plugins/cli/install) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```

To install the  [Serverless Plugin extension](https://www.twilio.com/docs/labs/serverless-toolkit) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-serverless
```

## Updating the Hours of Operation

Run `twilio flex:plugins --help` or and `twilio serverless --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio CLI Plugins Docs](https://www.twilio.com/docs/twilio-cli/plugins) page.

Open the hoops.js file in the `default/assets` directory.  Edit, following the structure requirements...


In the `default` directory, deploy the Serverless Function and Assets.

```bash
twilio serverless:deploy --override-existing-project
```
Note the Domain displayed in the command output. Copy this value.

In the base project directory copy the .env.sample file to .env, and add this value (from the previous step):

FLEX_APP_FUNCTIONS_BASE=https://YOUR-DOMAIN.twil.io


In the base project directory, deploy the Flex Plugin.

```bash
twilio flex:plugins:deploy --changelog "add your comment"
```

Note the instructions in the command output - the next command to run is supplied.  Copy and paste it, and run it to activate this release of the Plugin.

There are comments in the source code for src/FlexLocalizationPlugin.js describing how to determine which Language Asset file to load.  Review those, and the rest of the code, and configure Flex Users with their language settings.

Close all browsers with Flex running, and open a new browser window to start Flex.

For further reference see [Flex Localization and Templating](https://www.twilio.com/docs/flex/developer/ui/localization-and-templating)

If necessary, run `npm install twilo-flex-token-validator` for dependencies in both base project directory and the `default` directory!

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.
