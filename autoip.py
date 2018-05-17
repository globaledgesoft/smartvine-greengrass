import os

try:
    ip = os.popen('ip addr show wlan0').read().split("inet ")[1].split("/")[0]

    lines = file('config.ini', 'r').readlines()
    del lines[-1]

    file('config.ini', 'w').writelines(lines)

    with open('config.ini', 'a') as f:
        f.write("hostip = %s" % ip)
except:
    print("Device does not have IP Address")
    exit()
