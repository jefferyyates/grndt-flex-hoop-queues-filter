<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Twilio Flex Plugin - Hours Of Operations Queue Filter 

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the APIs, check out our [Flex documentation](https://www.twilio.com/docs/flex).

This plugin and its associated Serverless Functions and Assets creates a filter for the list of Queues displayed when transferring a phone call.  It collates all of the defined Queues against a private Asset named hoops.json, and builds a Flex filter list from that.

The included assets contains a sample hoops.js file, defining when each Queue is open or closed.  This file MUST be edited to reflect actual business operating hours and holidays.

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

Open the hoops.js file in the `default/assets` directory.  Edit JSON, following the data structure shown in the sample file.  Global information is accomodated, so not every Queue must be defined in this file.  Note that the timezone used to define the hours must be provided at the top of the file, as this is used to convert open and close times to the agent's local timezone.

Open (or create if it doesn't exist) the .env file in the `default` directory.  Remove all lines from the file, and add this line:

WORKSPACE_SID=<yourworkspacesid>

Your Workspace SID can be found in the Twilio Console, and starts with the "WS".

In the `default` directory, deploy the Serverless Function and Assets.

```bash
twilio serverless:deploy --override-existing-project --env=./.env
```
Note the Domain displayed in the command output. Copy this value.

In the base project directory copy the .env.sample file to .env, and add this value (from the previous step):

FLEX_APP_FUNCTIONS_BASE=https://YOUR-DOMAIN.twil.io


In the base project directory, deploy the Flex Plugin.

```bash
twilio flex:plugins:deploy --changelog "add your comment"
```

Note the instructions in the command output - the next command to run is supplied.  Copy and paste it, and run it to activate this release of the Plugin.

There are comments in all of the source code describing how the hoops.js file is read, parsed, and converted to a filter for the Queues in the Transfer Call panel.

Close all browsers with Flex running, and open a new browser window to start Flex.

If necessary, run `npm install twilo-flex-token-validator` for dependencies in both base project directory and the `default` directory!

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.
