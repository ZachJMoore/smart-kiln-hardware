There are different versions of relays and setups for the smart kiln. Described below is what each stands for and which string should be passed to the Relay constructor.

- "v1": This is a single solid state relay which closes on HIGH from:
gpio 27
Part can be found <a href="https://www.amazon.com/gp/product/B0753XW76H/ref=oh_aui_detailpage_o00_s01?ie=UTF8&psc=1">here</a>.

- "v2": This is a 8 channel relay board which closes on HIGH from:
gpio 5,
gpio 6,
gpio 13,
gpio 19,
gpio 26,
gpio 17,
gpio 27,
gpio 22.
Part can be found <a href="https://www.amazon.com/gp/product/B00KTELP3I/ref=oh_aui_search_asin_title?ie=UTF8&psc=1">here</a>.
Kilns should not be wired directly to this. This is more of an intermediate board to trigger better external relays.


- "v3": These are just defined outputs for triggering relays on HIGH. 3.3v is the trigger voltage:
gpio 6,
gpio 13,
gpio 19,
gpio 26,