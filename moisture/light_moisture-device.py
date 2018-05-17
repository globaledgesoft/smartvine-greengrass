import sys
import logging
import json
import time
import serial
import re
import sqlite3
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from threading import Timer
from urllib2 import Request, urlopen, URLError
from ConfigParser import SafeConfigParser

#Initializing config parser to load configuration values.
parser = SafeConfigParser()
parser.read('/home/linaro/latest/IIOT-Projects/config.ini')

#REST API Urls to start screen transition for high UV light condition
#and update the light screen transition flag to false when light value become normal
urlLightDetected = parser.get('resturls','urlLightDetected')
urlLowLightDetected = parser.get('resturls','urlLowLightDetected')

#Initializing logger
logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# Loading configuration and establishing database connection
conn = sqlite3.connect(parser.get('database', 'dbpath'))

rootCAPath = parser.get('certsinfo', 'rootcapath')
privateKeyPath = parser.get('certsinfo', 'moistureprivatekeypath')
certificatePath = parser.get('certsinfo', 'moisturecertificatepath')
host = parser.get('hostinfo', 'hostip')
host_port = parser.get('hostinfo', 'hostport')
clientId = parser.get('deviceinfo', 'moistureawsdeviceclientid')
publishTopic = parser.get('mqttinfo', 'moisturepublish_topic')

# Initialising AWS IoT MQTT Client
awsIOTMQTTClient = None
awsIOTMQTTClient = AWSIoTMQTTClient(clientId)
awsIOTMQTTClient.configureEndpoint(host, host_port)
awsIOTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# Establishing connection to the AWS IoT MQTT (local greengrass service)
awsIOTMQTTClient.connect()

# Reading values via Arduino serial port
ard = serial.Serial('/dev/tty96B0', 9600)
moisture = "Moisture"
light = "The Light"

# Storing Moisture value into database (SQLite DB)
def moisture_db(moistureValue):
    timeNow = time.time()
    millis = int(round(time.time() * 1000))
    timeData = time.localtime(timeNow)
    if(timeData.tm_min % 2 == 0):
        cur = conn.cursor();
        cur.execute("select * from moisture_sensor where year="+str(timeData.tm_year)+" and month="+str(timeData.tm_mon)+" and day="+str(timeData.tm_mday)+" and hour="+str(timeData.tm_hour)+" and minute="+str(timeData.tm_min))
        rows = cur.fetchall()
        if(len(rows) == 0):
            conn.execute("INSERT INTO moisture_sensor (year, month, day, hour, minute, reported_time, value) VALUES ("+str(timeData.tm_year)+", "+str(timeData.tm_mon)+", "+str(timeData.tm_mday)+", "+str(timeData.tm_hour)+", "+str(timeData.tm_min)+", "+str(millis)+", "+str(moistureValue)+")")
            # save the changes
            conn.commit()

# Storing Light value into database (SQLite DB)
def light_db(lightValue):
    timeNow = time.time()
    millis = int(round(time.time() * 1000))
    timeData = time.localtime(timeNow)
    if(timeData.tm_min % 2 == 0):
        cur = conn.cursor();
        cur.execute("select * from light_sensor where year="+str(timeData.tm_year)+" and month="+str(timeData.tm_mon)+" and day="+str(timeData.tm_mday)+" and hour="+str(timeData.tm_hour)+" and minute="+str(timeData.tm_min))
        rows = cur.fetchall()
        if(len(rows) == 0):
            conn.execute("INSERT INTO light_sensor (year, month, day, hour, minute, reported_time, value) VALUES ("+str(timeData.tm_year)+", "+str(timeData.tm_mon)+", "+str(timeData.tm_mday)+", "+str(timeData.tm_hour)+", "+str(timeData.tm_min)+", "+str(millis)+", "+str(lightValue)+")")
            # save the changes
            conn.commit()

# Reading Moisture value and publishing it to MQTT server (local greengrass service)
def read_moisture_light_value():
    logger.info("Invoking this function will read the Moisture and Light Value");
    try:
        while True:
            ardOut = ard.readline()
            if moisture in ardOut:
                moistureValue = [int(s) for s in re.findall(r'\b\d+\b', ardOut)][0]
                logger.info(moistureValue)
                moisture_db(moistureValue)
                moistureJson = json.dumps(json.loads('{"thingName":"Moisture", "value":'+str(moistureValue)+'}'))
		awsIOTMQTTClient.publish(publishTopic, moistureJson, 0)
            if light in ardOut:
                lightValue = [int(s) for s in re.findall(r'\b\d+\b', ardOut)][0]
                logger.info(lightValue)
                light_db(lightValue)
                if lightValue > 1000:
                    request = Request(urlLightDetected)
                    response = urlopen(request)
                    output = response.read()
                    logger.info(output)
                else:
                    request = Request(urlLowLightDetected)
                    response = urlopen(request)
                    output = response.read()
                    logger.info(output)

    
    except KeyboardInterrupt:
        print("CTRL-C!! Exiting...")
        
read_moisture_light_value()
