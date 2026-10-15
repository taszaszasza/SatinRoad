The project was evaluated using Lighthouse for its sustainability. Due to non-routing structure of the application, the snapshot option was used for this purpose (the Shop view). The aim was to keep data transfer, CPU load, and server energy as low as possible.

Audit Scores: 
- Performance 1/1 passed
- Accessibility 10/11 passed
- Best Practices: 3/4 passed
- SEO: 4/6 passed

Based on the report, there is improvement needed in the following areas:
- Image aspect ratios: It was flagged that the avatar images had different ratios than their containers, which means they were not pre-cropped before inserting them into the containers. In order to improve it, I can handle it in the backend before passing them to the containers.

- Color Contrast: Due to the color scheme of the application, the contrast ratio test was failed. The possible improvement would be changing the color codes in my CSS files to increase the contrast and ensure better accessibility for all users.

- HTML Meta Tags: While writing the code I missed adjusting the tag to describe the contents of the page, leaving it the default Bun + React. The simple fix is to adjust this line and add alt tags to the decorative images to ensure accessibility.

A few functionalities of the logic were tested by Unit Testing. I chose Test Last method for this purpose. While writing the tests, I used both FACT and THEORIES to check accuracy of my code. Thanks to testing, I confirmed that the loyalty discount is applied in correct cases (every 11th purchase), police raid mechanism was triggered correctly (only if 0 was generated on Random between 0-99, so with 1% chance), that the buyer is not able to purchase their own product, or any inactive listings, if the listing has a valid name and price. I also used a simple stub to test if a banned user is able to make a deal. The failed tests led me to correct the previously written code.
