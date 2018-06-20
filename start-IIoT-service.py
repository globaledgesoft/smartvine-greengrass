#!/usr/bin/python

import os

os.system('sudo pm2 stop all')
os.system('sudo /greengrass/ggc/core/greengrassd start')
os.system('node get-gg-server-info.js')
os.chdir('qualcomm-iiot-agriculture')
os.system('pm2 start app.js')
os.chdir('../fan')
os.system('sudo pm2 start fan-device.py --interpreter="python"')
os.chdir('../temperature')
os.system('sudo pm2 start temp-device.py --interpreter="python"')
os.chdir('../rgb_led')
os.system('sudo pm2 start rgb-led-device.py --interpreter="python"')
os.chdir('../moisture')
os.system('sudo pm2 start light_moisture-device.py --interpreter="python"')

