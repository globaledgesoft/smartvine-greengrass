import sys
import logging
import json
import time
import serial
import re
import sqlite3
import temperature
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from threading import Timer
from ConfigParser import SafeConfigParser

# Initializing Logger
logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# Initializing config parser to read configurations.
parser = SafeConfigParser()
parser.read('/home/linaro/latest/IIOT-Projects/config.ini')

# Loading configuration and establishing database connection
conn = sqlite3.connect(parser.get('database', 'dbpath'))

# Configuring certificates for making secure connection to the greengrass
Temperature_rootCAPath = parser.get('certsinfo', 'rootcapath')
Temperature_privateKeyPath = parser.get('certsinfo', 'temperatureprivatekeypath')
Temperature_certificatePath = parser.get('certsinfo', 'temperaturecertificatepath')
Temperature_host = parser.get('hostinfo', 'hostip')
Temperature_host_port = parser.get('hostinfo', 'hostport')
Temperature_clientId = parser.get('deviceinfo', 'temperatureawsdeviceclientid')
publishTopic = parser.get('mqttinfo', 'temperaturepublish_topic')

# Initialising AWS IoT MQTT Client 
awsIOTMQTTTemperatureClient = None
awsIOTMQTTTemperatureClient = AWSIoTMQTTClient(Temperature_clientId)
awsIOTMQTTTemperatureClient.configureEndpoint(Temperature_host, Temperature_host_port)
awsIOTMQTTTemperatureClient.configureCredentials(Temperature_rootCAPath, Temperature_privateKeyPath, Temperature_certificatePath)

# Establishing connection to the AWS IoT MQTT (Local Greengrass Service)
awsIOTMQTTTemperatureClient.connect()

# Storing temperature value into database (SQLite DB)
def temperature_db(temperatureValue):
    timeNow = time.time()
    millis = int(round(timeNow * 1000))
    timeData = time.localtime(timeNow)
    if(timeData.tm_min % 2 == 0):
        cur = conn.cursor();
        cur.execute("select * from temperature_sensor where year="+str(timeData.tm_year)+" and month="+str(timeData.tm_mon)+" and day="+str(timeData.tm_mday)+" and hour="+str(timeData.tm_hour)+" and minute="+str(timeData.tm_min))
        rows = cur.fetchall()
        if(len(rows) == 0):
	       conn.execute("INSERT INTO temperature_sensor (year, month, day, hour, minute, reported_time, value)  VALUES ("+str(timeData.tm_year)+", "+str(timeData.tm_mon)+", "+str(timeData.tm_mday)+", "+str(timeData.tm_hour)+", "+str(timeData.tm_min)+","+str(millis)+", "+str(temperatureValue)+")")
        # save the changes
	conn.commit()

# Reading Temperature value and publishing it to MQTT server (local greengrass service)
def read_temperature_value():
    logger.info("Invoking this function will read the Temperature_Moisture Value")
    try:
        while True:
            temperatureValue = temperature.getTemperature()
            logger.info(temperatureValue)
	    temperature_db(temperatureValue)
            temperatureJson = json.dumps(json.loads('{"thingName":"Temperature", "value":'+str(temperatureValue)+'}'))
            awsIOTMQTTTemperatureClient.publish(publishTopic, temperatureJson, 0)
	    time.sleep(1)

    except KeyboardInterrupt:
        print("CTRL-C!! Exiting...")
        
read_temperature_value()
