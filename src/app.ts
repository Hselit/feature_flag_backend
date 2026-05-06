import express, { Application } from 'express';
import { createServer, Server } from 'http';
import cors from 'cors';

import { organizationRoutes } from './organization/routes/organizationRoutes';
import { featureFlagRoutes } from './feature/routes/featureFlagRoutes';
import { userRoutes } from './user/routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

class App {

  private static server:Server;
  private static app:Application;

  private static async setupRoutes(){
    
    this.app.use(
      cors({
        origin: "http://localhost:5174",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      })
    );

    // Auth endpoints are inside userRoutes now
    this.app.use('/auth', userRoutes);
    this.app.use('/organizations', organizationRoutes);
    this.app.use('/feature-flags', featureFlagRoutes);
    // this.app.use('/users', userRoutes);

    this.app.use(errorHandler);
  }

  public static async startServer(port:number){
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    await this.setupRoutes();
    
    this.server = createServer(this.app);
    this.server.listen(port,()=>{
      console.info(`Server is running on http://localhost:${port}`);
    })
  }

}

export default App;