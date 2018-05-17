import sys, signal, atexit
import logging
import json
import time
import serial
import re
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from threading import Timer
from gpio_96boards import GPIO
from urllib2 import Request, urlopen, URLError
from ConfigParser import SafeConfigParser

#Initializing config parser to load configurations.
parser = SafeConfigParser()
parser.read('/home/linaro/latest/IIOT-Projects/config.ini')

# REST API url to start the screen transition for moisture
# and REST API url to update the flag state of the drought_screen_transition whenever the mosture back to normal
highMoistureScreenTransitionAPI = parser.get('resturls', 'highMoistureScreenTransitionAPI')
droughtScreenTransitionAPI = parser.get('resturls', 'droughtScreenTransitionAPI')

#Initializing logger
logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

gpio_c = GPIO.gpio_id('GPIO_K')
gpio_d = GPIO.gpio_id('GPIO_L')

pins = (
    (gpio_c, 'out'),
    (gpio_d, 'out')
)

green = 0
red = 0
blue = 0

with GPIO(pins) as gpio:

    screenTransit = False

    # configuring certificates for making secure connection to the greengrass
    rootCAPath = parser.get('certsinfo', 'rootcapath')
    privateKeyPath = parser.get('certsinfo', 'rgbprivatekeypath')
    certificatePath = parser.get('certsinfo', 'rgbcertificatepath')
    host = parser.get('hostinfo', 'hostip')
    host_port = parser.get('hostinfo', 'hostport')
    clientId = parser.get('deviceinfo', 'rgbawsdeviceclientid')
    subscribeTopic = parser.get('mqttinfo', 'rgbsubscribe_topic')

    # This function handle keyboard interrupt
    def signal_handler(signal, frame):
        sendColor(0, 0, 0)
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGSEGV, signal_handler)

    # This function make REST call to invoke screen transition
    def change_rgb_led_state(rgbJson):
        logger.info("Invoking this function changes the LED state")
        newState = rgbJson['value']
        global screenTransit
        if "ON" == newState :
            if screenTransit == False:
                request = Request(highMoistureScreenTransitionAPI)
                response = urlopen(request)
                output = response.read()
                logger.info(output)
                screenTransit = True
                sendColor(255, 0, 0)
                screenTransit = False
        else :
            if screenTransit == False:
                request = Request(droughtScreenTransitionAPI)
                response = urlopen(request)
                output = response.read()
                logger.info(output)
                screenTransit = True
                sendColor(0, 255, 0)
                screenTransit = False

    def sendRGB(rgb_value, gpio):
        temp = 0
        for i in range(0, 8):
            temp = rgb_value & 0x80
            if(temp): 
                gpio.digital_write(gpio_d, GPIO.HIGH)
            else:
                gpio.digital_write(gpio_d, GPIO.LOW)

            rgb_value = rgb_value << 1

            gpio.digital_write(gpio_c, GPIO.HIGH)
            time.sleep(1/1000)
            gpio.digital_write(gpio_c, GPIO.LOW)
            time.sleep(1/1000)

        
    def sendStartStop(gpio):
        for i in range(0, 32):
            gpio.digital_write(gpio_d, GPIO.LOW)
            gpio.digital_write(gpio_c, GPIO.HIGH)
            time.sleep(1/1000)
            gpio.digital_write(gpio_c, GPIO.LOW)
            time.sleep(1/1000)

    def sendColor(red, green, blue):
        prefix = 0xc0
        if ((red & 0x40) == 0):
            prefix |= 0x1
        if ((red & 0x80) == 0):
            prefix |= 0x2
        if ((green & 0x40) == 0):
            prefix |= 0x4
        if ((green & 0x80) == 0):
            prefix |= 0x8
        if ((blue & 0x40) == 0):
            prefix |= 0x10
        if ((blue & 0x80) == 0):
            prefix |= 0x20
    
        sendStartStop(gpio)
        sendRGB(prefix, gpio)
        sendRGB(blue, gpio)
        sendRGB(green, gpio)
        sendRGB(red, gpio)
        sendStartStop(gpio)

    # Function to process the MQTT message and take neccessary action
    def handle_rgb_message(awsIOTMQTTClient, userData, message):
        logger.info("Received Message")
        logger.info(message)
        rgbJson = json.loads(message.payload)
        logger.info(rgbJson['value'])
        change_rgb_led_state(rgbJson)

    # Initialising AWS IoT MQTT Client
    awsIOTMQTTClient = None
    awsIOTMQTTClient = AWSIoTMQTTClient(clientId)
    awsIOTMQTTClient.configureEndpoint(host, host_port)
    awsIOTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

    # Establishing connection to the AWS IoT MQTT
    # and subscribe it to MQTT server (local greengrass service)
    awsIOTMQTTClient.connect()
    awsIOTMQTTClient.subscribe(subscribeTopic, 0, handle_rgb_message)

    # To make the MQTT Subscription running indefinitely
    while True:
        time.sleep(1)
