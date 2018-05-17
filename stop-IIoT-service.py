#!/usr/bin/python

import os

os.system('sudo pm2 stop all')
os.system('pm2 stop all')
os.system('sudo /greengrass/ggc/core/greengrassd stop')
