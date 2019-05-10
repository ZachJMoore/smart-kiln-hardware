There are different versions of thermocouple amplifiers and setups for the smart kiln. Described below is what each version number stands for and which string should be passed to the ThermoSensor constructor.

- "v1": This is a Max31855 board which communicates over spi with the raspberry pi. Wiring can be found in the main README. Part can be found <a href="https://www.amazon.com/gp/product/B00SK8NDAI/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">here</a>.

- "v2": This is a dual Max31855 setup which uses gpio 23 and 24 for chip select, otherwise the wiring is the same as v2 (chips share the same lanes).
