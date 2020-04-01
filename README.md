# ESTIAM-Bank

## Installation using Docker

Download and install `Docker for Windows` or `Docker for Mac`.  
You have to be signed into your Docker account to download the images.

### Windows / OSX / Linux
If you're using Windows, make sure that you're using `Linux containers` (you can change this in settings).  
If you're using Mac, make sure that you allowed Docker to access your filesystem (see Preferences - File sharing tab)  

Open up the `Powershell` on Windows or a new terminal window on Mac/Linux, `cd` at root of the project and use

    docker-compose up
___
## How to update ?
To update your local git repository, make sure all your containers are **stopped** before pulling new commits, otherwise new dependencies won't be downloaded until you restart the containers, which will most likely crash the app. When your local repository is up-to-date, you can restart the whole stack using

    docker-compose up

## Note
The stack is ready when you see the following line in your console

    angular-client | ** Angular Live Development Server is listening on 0.0.0.0:4200, open your browser on http://localhost:4200/ **
    

| Service        | Running at             | 
|----------------|------------------------|
| angular-client | http://localhost:4200  |
| express-server | http://localhost:8080  |
| mongodb        | http://localhost:27017 |
