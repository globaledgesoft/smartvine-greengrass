# Qualcomm IIOT Agriculture
This application has several components such as temperature, moisture, light sensors connected to a Qualcomm 410c Dragonboard running AWS greengrass. Instead of pushing all the sensor data to cloud and taking necessary action. The lambda function which running inside the greengrass module inside the 410c board will take necessary action which helps in lot of data, cost saving and ensure that immediate action has been taken. We can deploy the lambda function to a greengrass module running inside 410c board remotely. 

## Getting Started
These instructions will get you a copy of the project up and running on your 410c board. 

### Prerequisites
Assuming your 410c board has following things installed and configured
* Linaro OS
* NodeJS
* SQLite3
* Python

Note : Installation doc for all the above packages has been shared separately.

Create a folder named "executables" in your home path. (Execute the following command in your terminal from your home folder path)

```
$> mkdir executables
```
Once it is created, move to the newly created executables folder.

```
$> cd executables
```
Copy the given tar ball to that executables folder and extract it (remove the tar file if you want) using the following command.

```
$> tar -xvf IIOT-Projects.tar.gz
```
Move to the extracted folder and it will be your project's home folder

```
$> cd IIOT-Projects
```
Create a empty folder for SQLite3 db file.

```
$> mkdir sqlite-db
```
Don't create any file inside the sqlite-db folder. The file will be created automatically once you start the application.

### Configuring this application
Let's start configuring the applications. 

* Configuring fan device

step 1: Assuming you have created the fan device in the AWS IOT cloud with necessary policies attached and downloaded the security certificates. Refer the User Guide which is shared separately.

step 2: Inside fan device folder there will be

    a) certs directory, please place the certificates related to fan in that folder and note down the absolute path of the file which will be configured inside the config.ini file as explained in the next step.
    
    b) config.ini file which have 5 sections 
    
        i) In the certsinfo section configure the absolute path of the certificates with privatekeypath and certificatepath variable. The rootcapath file will be created dynamically once the application is up and running so, for that configure the project root path with file name gg-CA.crt for eg. ~/executables/IIOT-Projects/gg-CA.crt (replace ~ with the actual folder path). 
        
        ii) In the resturls section, change the IP in the url with the IP of the 410c board. 
        
        iii) In the deviceinfo section change the Fan name with the client id (IOT device name) which you have created in Amazon AWS IOT portal. 
        
        iv) In the hostinfo section change the value of hostip with IP of the 410c board and leave the hostport untouched. 
        
        v) In the mqttinfo section is the topic where the fan has to listen for the event. In case changing please note down the name.
        
    c) fan-device.py is the executable file - There is no change in that.

* Configuring temperature device

step 1: Assuming you have created the temperature device in the AWS IOT cloud with necessary policies attached and downloaded the security certificates. Refer the User Guide which is shared separately.

step 2: Inside temperature device folder there will be

    a) certs directory, please place the certificates related to temperature in that folder and note down the absolute path of the file which will be configured inside the config.ini file as explained in the next step.
    
    b) config.ini file which have 5 sections 
    
        i) In the database section configure the absolute path of the db file. eg. ~/executables/IIOT-Projects/sqlite-db/data.db (replace ~ with the actual folder path). 
        
        ii) In the certsinfo section configure the absolute path of the certificates with privatekeypath  and certificatepath variable. The rootcapath file will be created dynamically once the application is up and running so, for that configure the project root path with file name gg-CA.crt for eg. ~/executables/IIOT-Projects/gg-CA.crt (replace ~ with the actual folder path).
        
        iii) In the deviceinfo section change the Temperature name with the client id (IOT device name) which you have created in Amazon AWS IOT portal. 
        
        iv) In the hostinfo section change the value of hostip with IP of the 410c board and leave the hostport untouched. 
        
        v) In the mqttinfo section is the topic where the temperature device has to publish the event. In case changing please note down the name.
        
    c) temp-device.py is the executable file - There is no change in that.
    
    d) temperature.py is the one which actually reads the value from the board - There is no change in that.
    
    
* Configuring rgb_led device

step 1: Assuming you have created the rgb_led device in the AWS IOT cloud with necessary policies attached and downloaded the security certificates. Refer the User Guide which is shared separately.

step 2: Inside rgb_led device folder there will be

    a) certs directory, please place the certificates related to rgb_led in that folder and note down the absolute path of the file which will be configured inside the config.ini file as explained in the next step.
    
    b) config.ini file which have 5 sections 
    
        i) In the certsinfo section configure the absolute path of the certificates with privatekeypath  and certificatepath variable. The rootcapath file will be created dynamically once the application is up and running so, for that configure the project root path with file name gg-CA.crt for eg. ~/executables/IIOT-Projects/gg-CA.crt (replace ~ with the actual folder path). 
        
        ii) In the resturls section, change the IP in the url with the IP of the 410c board. 
        
        iii) In the deviceinfo section change the RGB_LED name with the client id (IOT device name) which you have created in Amazon AWS IOT portal. 
        
        iv) In the hostinfo section change the value of hostip with IP of the 410c board and leave the hostport untouched. 
        
        v) In the mqttinfo section is the topic where the RGB_LED has to listen for the event. In case changing please note down the name.
        
    c) rgb-led-device.py is the executable file - There is no change in that.
    
    
* Configuring moisture device

step 1: Assuming you have created the moisture device in the AWS IOT cloud with necessary policies attached and downloaded the security certificates. Refer the User Guide which is shared separately.

step 2: Inside moisture device folder there will be

    a) certs directory, please place the certificates related to moisture in that folder and note down the absolulte path of the file which will be configured inside the config.ini file as explained in the next step.
    
    b) config.ini file which  have 6 sections 
    
        i) In the database section configure the absolute path of the db file. eg. ~/executables/IIOT-Projects/sqlite-db/data.db (replace ~ with the actual folder path). 
        
        ii) In the resturls section, change the IP in the url with the IP of the 410c board. 
        
        iii) In the certsinfo section configure the absolute path of the certificates with privatekeypath  and certificatepath variable. The rootcapath file will be created dynamically once the application is up and running so, for that configure the project root path with file name gg-CA.crt for eg. ~/executables/IIOT-Projects/gg-CA.crt (replace ~ with the actual folder path).
        
        iv) In the deviceinfo section change the Moisture name with the client id (IOT device name) which you have created in Amazon AWS IOT portal. 
        
        v) In the hostinfo section, change the value of the hostip with IP of the 410c board and leave the hostport untouched. 
        
        vi) in the mqttinfo  section is the topic where the moisture has to publish the events. In case changing please not down the name.
    
    c) light_moisture-device.py is the executable file - There is no change in that.
    
* Configuring get-gg-server-info.js

Executing this file will get the greengrass server (running locally) information and a ssl security certificate require for all the devices to communicate with the greengrass server running in the local network. Need to configure with one of the devices certificates for eg. moisture.

    1) Open that file and in the options section there will be variable called "key". Just configure the absolute path of the moisture device's private key file found in the path ~/executables/IIOT-Projects/moisture/certs/Moisture.private.key (replace ~ with the actual folder path).
    
    2) With the cert variable configure the absolute path of the moisture device's cert file found in the path ~/executables/IIOT-Projects/moisture/certs/Moisture.cert.pem (replace ~ with the actual folder path).
    
    3) With the ca variable configure the absolute path of the root-CA.crt file found in the path ~/executables/IIOT-Projects/root-cA.crt (replace ~ with the actual folder path).
    
* Configuring the web application

Inside the IIOT-Projects folder there will be web application with folder name qualcomm-iiot-agriculture. Move to that folder, there will be a configuration folder named config will be there. Inside the config folder, edit the config.js file. Need to change the db configuration. In the dbConfig section, there will be connection information with the variable name filename. Configure the absolute path of the database file ~/executables/IIOT-Projects/sqlite-db/data.db (replace ~ with the actual folder path) and leave the rest of the configuration as it is.

### Start the application
To start the application launch the following script to start (found in the project's root path).

Note : Before starting the application ensure that greengrass service is up and running

```
$> ./start-application.sh
```
Enter the linux user password if it requires.

### Verification
To verify all the application is running fine execute the following command.

```
$> pm2 list
```
This will list the status of the web application.

┌──────────┬────┬──────┬──────┬────────┬─────────┬────────┬─────┬───────────┬────────┬──────────┐
│ App name │ id │ mode │ pid  │ status │ restart │ uptime │ cpu │ mem       │ user   │ watching │
├──────────┼────┼──────┼──────┼────────┼─────────┼────────┼─────┼───────────┼────────┼──────────┤
│ app      │ 0  │ fork │ 3234 │ online │ 0       │ 29s    │ 0%  │ 76.8 MB   │ linaro │ disabled │
└──────────┴────┴──────┴──────┴────────┴─────────┴────────┴─────┴───────────┴────────┴──────────┘

If the status shows online then the web application is working fine.

To verify the device applications is working fine add sudo to the same command since, it requires root access.

```
$> sudo pm2 list
```
This will list the status of the device applications.
┌───────────────────────┬────┬──────┬──────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name              │ id │ mode │ pid  │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├───────────────────────┼────┼──────┼──────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ fan-device            │ 0  │ fork │ 4145 │ online │ 15      │ 0s     │ 99% │ 11.8 MB   │ root │ disabled │
│ light_moisture-device │ 3  │ fork │ 4148 │ online │ 15      │ 0s     │ 47% │ 6.6 MB    │ root │ disabled │
│ rgb-led-device        │ 2  │ fork │ 4147 │ online │ 15      │ 0s     │ 84% │ 10.6 MB   │ root │ disabled │
│ temp-device           │ 1  │ fork │ 4146 │ online │ 15      │ 0s     │ 95% │ 11.7 MB   │ root │ disabled │
└───────────────────────┴────┴──────┴──────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘

### Stop the application
To stop the application execute the following script to stop (found in the project's root path).

```
$> ./stop-application.sh
```