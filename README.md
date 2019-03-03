# Smart Kiln Hardware

This is the new complete hardware application for the Smart Kiln project which supersedes <a href="https://github.com/ZachJMoore/smart-kiln-standalone" target="_blank">this</a> repository used for handling the logic behind firing a kiln, and <a href="https://github.com/ZachJMoore/smart-kiln-standalone-ui" target="_blank">this</a> repository used for the UI.

### Getting Started

Make sure to edit the server/.env to match your environment.

In the root directory run the following commands in separate terminal windows:

```
$ mv server/.env.example server/.env
$ npm run server
```

```
$ npm run client
```


## Hardware Setup

#### Parts:
- <a href="https://www.amazon.com/gp/product/B07BC6WH7V/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1">Raspberry Pi</a>
- <a href="https://www.amazon.com/gp/product/B0153R2A9I/ref=oh_aui_search_detailpage?ie=UTF8&psc=1">7" Touchscreen</a>
- <a href="https://www.amazon.com/gp/product/B06XWN9Q99/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1">SD Card</a>
- <a href="https://www.amazon.com/gp/product/B0753XW76H/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">Solid State Relay</a>
- <a href="https://www.amazon.com/gp/product/B00SK8NDAI/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">Thermocouple Amplifier</a>
- <a href="http://www.theceramicshop.com/product/10885/Type-K-Thermocouple-8B/">Ceramic type-k Thermocouple</a>

### Wiring:

#### soldered parts
![simple-wiring](https://github.com/ZachJMoore/smart-kiln-hardware/blob/master/simple-wiring.png?raw=true)

The thermocouple are screwed directly to the amp. Neutral/ground coming back from the kiln elements can then also be screwed into the relay to programmatically close the circuit

### Software Setup

https://raspberrypi.stackexchange.com/questions/93311/switch-between-wifi-client-and-access-point-without-reboot/93312#93312

Dependencies: node, SPI, ZeroConf, systemd-networkd helper tools, systemd-networkd setup, forever && forever-service

##### Node for PiZW:
```
    $ curl -o node-v9.7.1-linux-armv6l.tar.gz https://nodejs.org/dist/v9.7.1/node-v9.7.1-linux-armv6l.tar.gz && tar -xzf node-v9.7.1-linux-armv6l.tar.gz && sudo cp -r node-v9.7.1-linux-armv6l/* /usr/local/
```

##### Node for Pi3B+:
```
    $ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
```

##### SPI:
```
    $ sudo raspi-config -> Interfacing Options -> SPI
```
or in /boot/config.txt append the following line:
```
    dtparam=spi=on
```

##### ZeroConf
```
    $ sudo apt-get install libavahi-compat-libdnssd-dev
```

##### systemd-networkd helper tools
```
    $ sudo apt install rng-tools
```

##### systemd-networkd setup
```
    $ sudo yarn setup
```


##### forever && forever-service
```
    $ npm install -g forever
    & npm install -g forever-service
```