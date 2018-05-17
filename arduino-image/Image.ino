#include  <math.h>
#include  <Wire.h>
//#include  "I2Cdev.h"
//#include  "BMP280.h"

#include  <Digital_Light_TSL2561.h>

/**** Temperature Date  ******/
//I2Cdev I2C_M
//float temperature;
//BMP280 bmp280;
/*
const int B = 4275;    //Nominal B-Constant
const int R0 = 100000;  // Zero Power Resistance
const int temperature = A1;
*/
/*****************************/

/******* Moisture Date *********/
const int moist=A0;
//this is the threshold value for the light sensor
//to make the light sensor more sensitive, lower this value
int thresholdVal = 500;
/*******************************/

void setup(){
    pinMode(moist, INPUT); // set pin for button input
//    pinMode(temperature, INPUT);
    
    Wire.begin();
    Serial.begin(9600);
    Serial.println("waiting");
//    bmp280.init();
    delay(1000);
    TSL2561.init();
}

void loop(){
    int moistVal = analogRead(moist);    //Moisture Value
    int rgb, start = 0;
    Serial.print("Moisture Value is \t");
    Serial.print(moistVal);
    Serial.println("\n");
    /******Temperature Code *********/
/*
    int i = analogRead(temperature);    
    float R = 1023.0/i-1.0;
    R = R0*R;
    float tempVal = (1.0/(log(R/R0)/B+(1/298.15)))-273.15;  //Temperature in Celcius
    Serial.print("Temperature Value\t");
    Serial.print(tempVal);
    Serial.println("\n");

    temperature = bmp280.getTemperature();
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println("\n");
    /******************************/
    
    /******Light Code *********/
    Serial.print("The Light Value:\t");
    Serial.print(TSL2561.readVisibleLux());    
    Serial.println("\n"); 
    delay(1000);
    /**************************/
    delay(1000);
       
}
