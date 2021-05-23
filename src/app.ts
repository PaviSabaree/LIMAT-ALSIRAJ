import { DBConnection } from './config/constant.enum'
import * as express from 'express'
import * as mongodb from 'mongoose'
var cors = require('cors')
class App {
    public app: express.Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; controllers: any;}) {
        this.app = express()
        this.app.use(cors())
        this.port = appInit.port
        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {

            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
     
    }

    private template() {
        this.app.set('view engine', 'pug')
    }

    public listening() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }

    public dbConnection(){
        // Connecting to the database
        mongodb.connect(DBConnection.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
        console.log("Successfully connected to the database !!");
        this.listening();
        }).catch((err: any) => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
        });

    }

   
}

export default App