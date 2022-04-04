import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

//import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import { Actions as HoopDataAction, initialState} from './states/HoopDataState';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'GrndtFlexHoopQueuesFilterPlugin';

export default class GrndtFlexHoopQueuesFilterPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    this.loadHOOP(manager);

    flex.Actions.addListener("beforeShowDirectory", (payload) => {
      const hoopList = this.evalHOOP(manager);
      flex.WorkerDirectoryTabs.defaultProps.hiddenQueueFilter = hoopList;
    });
  }

  // Called during init to fetch Hours Of Operation definition
  // and store in redux store
  loadHOOP = (manager) => {
    this.getAsset(Intl.DateTimeFormat().resolvedOptions().timeZone, manager).then(response => {
      manager.store.dispatch(HoopDataAction.storeHoops(response));
    });
  }
  
  // Called by loadHoop to perform actual fetch
  getAsset = async (myTz, manager) => {
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/fetchHOOPs`;

    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      clientTz: myTz
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let resText;
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      resText = await response.json();
      return resText;
    } catch (error) {
      console.error('Failed to get asset file');
    }
  };

  // Evaluates Hours Of Operation data and compares to "now"
  // to create a Queue filter that shows only available Queues
  evalHOOP = (manager) => {
  
    // The HOOP data
    const theData = manager.store.getState()['grndt-flex-hoop-queues-filter'].hoopData.hoopData;

    // Need to find queue names that are open now!
    // Where "now" is translated to the timezone
    // used in the Hours Of Operation json

    const formatOptions = {
      timeZone: theData.timezone,
      weekday: 'short',
      hour: 'numeric',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
  
    // Get the current time and day of the week for your specific time zone
    const formattedDate = formatter.format(new Date()).split(', ');
  
    const hour = formattedDate[1];
    const day = formattedDate[0];
  
    const invalidKeys = ['timezone'];
  
    // Convert to query syntax
    let newFilters = [];
    let subAry = [];
    let i = 1;

    for( const [key, value] of Object.entries(theData)) {
      // This means value is object listing days and open/close
      if(!(invalidKeys.includes(key)) && value[day].open <= hour && value[day].close > hour) {
        subAry.push('"' + key + '"');
      }
      if(subAry.length == 29) {
        newFilters.push(subAry.join(", "));
        subAry = [];
      }
    }

    if(subAry.length > 0) {
      newFilters.push(subAry.join(", "));
    }

    let newQuery = 'data.queue_name IN [' + newFilters.join('] OR data.queue_name IN [') + ']';

    return newQuery;
  };
  
  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
