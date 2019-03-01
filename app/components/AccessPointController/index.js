const { Components } = require("passeljs")

module.exports = class AccessPointController extends Components.Base{
    constructor(props){
        super(props)
    }

    componentWillMount(){
        console.log(process.arch)
        // const util = require('util');
        // const exec = util.promisify(require('child_process').exec);

        // async function ls() {
        // const { stdout, stderr } = await exec('cd app && ls');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);
        // }

        // ls();
    }
}