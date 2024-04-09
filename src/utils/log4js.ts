import * as Log4js from 'log4js';
import config from './log4js.config';

Log4js.configure(config);

export default Log4js.getLogger;
