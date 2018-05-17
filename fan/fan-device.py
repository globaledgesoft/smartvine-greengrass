import sys, signal
import logging
import json
import time
import serial, atexit
import re
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from threading import Timer
from gpio_96boards import GPIO
from urllib2 import Request, urlopen, URLError
from ConfigParser import SafeConfigParser

#Initiallizing config parser to load configurations
parser = SafeConfigParser()
parser.read('/home/linaro/latest/IIOT-Projects/config.ini')

#REST API url to start the screen transition for temperature
#and REST API url to update the flag state of the fan_screen_transition when ever the temperature back to normal
screenTransitionAPI = parser.get('resturls','screenTransitionAPI')
changeFanScreenTransitionStateAPI = parser.get('resturls','changeFanScreenTransitionStateAPI')

#Initializing logger
logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

gpio_f = GPIO.gpio_id('GPIO_G')
pins = (
    (gpio_f, 'out'),
)
with GPIO(pins) as gpio:

    # configuring certificates for making secure connection to the greengrass
    rootCAPath = parser.get('certsinfo', 'rootcapath')
    privateKeyPath = parser.get('certsinfo', 'fanprivatekeypath')
    certificatePath = parser.get('certsinfo', 'fancertificatepath')
    host = parser.get('hostinfo', 'hostip')
    host_port = parser.get('hostinfo', 'hostport')
    clientId = parser.get('deviceinfo', 'fanawsdeviceclientid')
    subscribeTopic = parser.get('mqttinfo', 'fansubscribe_topic')


    # This function handle keyboard interrupt 
    def signal_handler(signal, frame):
        gpio.digital_write(gpio_f, 0)
        sys.exit(0)

    # This function passes parameters(signals) to turn on or off the fan
    def change_device_state(val):
        gpio.digital_write(gpio_f, val)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGSEGV, signal_handler)

    # This function make REST call to invoke screen transition.
    def change_fan_state(fanJson):
        logger.info("Invoking this function changes the FAN state")
        newState = fanJson['value']
        if "ON" == newState :
            request = Request(screenTransitionAPI)
            response = urlopen(request)
            output = response.read()
            logger.info(output)
            change_device_state(1)
        else :
            request = Request(changeFanScreenTransitionStateAPI)
            response = urlopen(request)
            output = response.read()
            logger.info(output)
            change_device_state(0)
                
    # Function to process the MQTT message and takes necessary action 
    def handle_fan_message(awsIOTMQTTClient, userData, message):
        logger.info("Received Message")
        logger.info(message)
        fanJson = json.loads(message.payload)
        logger.info(fanJson['value'])
        change_fan_state(fanJson)

    # Initializing AWS IoT MQTT Client
    awsIOTMQTTClient = None
    awsIOTMQTTClient = AWSIoTMQTTClient(clientId)
    awsIOTMQTTClient.configureEndpoint(host, host_port)
    awsIOTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

    # Establishing connection to the AWS IoT MQTT 
    # and subscribe it to MQTT server (local greengrass service)
    awsIOTMQTTClient.connect()
    awsIOTMQTTClient.subscribe(subscribeTopic, 0, handle_fan_message)

    #To make the MQTT Subscription running indefinitely
    while True:
        time.sleep(1)

