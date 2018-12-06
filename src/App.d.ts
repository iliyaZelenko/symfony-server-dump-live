import AppServer from '~/AppServer';
import CLIParamsInterface from '~/CLIParamsInterface';
export default class App {
    private readonly CLIParams;
    private readonly appServer;
    constructor();
    getAppServer(): AppServer;
    getCLIParams(): CLIParamsInterface;
    private makeCLI;
    private runServerDump;
}
