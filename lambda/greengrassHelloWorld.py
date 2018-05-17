import greengrasssdk
import platform
import logging
from threading import Timer
import time
import sys
import json

logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

client = greengrasssdk.client('iot-data')

def iiot_event_handler(event, context):
    logger.info("Received Message")
    logger.info(event)
    eventJson = json.loads(json.dumps(event))
    
    thingName = eventJson['thingName']
    if thingName == "Moisture":
        moistureValue = eventJson['value']
        if moistureValue > 400 :
            client.publish(topic='ggClient/rgblisten', payload=json.dumps(json.loads('{"thingName":"RGB_LED", "value":"ON"}')))
        else :
            client.publish(topic='ggClient/rgblisten', payload=json.dumps(json.loads('{"thingName":"RGB_LED", "value":"OFF"}')))
    else :
        temperatureValue = eventJson['value']
        if temperatureValue > 32 :
            client.publish(topic='ggClient/fanlisten', payload=json.dumps(json.loads('{"thingName":"FAN", "value":"ON"}')))
        else :
            client.publish(topic='ggClient/fanlisten', payload=json.dumps(json.loads('{"thingName":"FAN", "value":"OFF"}')))
