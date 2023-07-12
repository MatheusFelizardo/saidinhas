## About
Project created to study frontend and backend in integration with <a href="https://github.com/MatheusFelizardo/saidinhas-backend">this back-end repo</a>.

On this project I used nuxt 3.5 (vue), pinia (state management), tailwind, axios and nuxt/pwa to create the app.

I also deployed in Google Cloud for private use.

## Requirements
- node (tested in the version 18.16)

## How to setup
 - create a .env file with the variable API_BASE_URL with the backend server url (usually is localhost:8000, please check the port in the backend project after setup and run php artisan serve)
 - run: npm install or yarn install
 - run: npm run dev or yarn dev

## Updates

- ~~feature: login (after finish it in the backend).~~ Done 21/06/23
- ~~refactoring: adding animations and adjusting layout to configuration menu~~ Done 26/06/23
- ~~feature: creating toasts plugin using classe~~ Done 26/06/23
- ~~bug: fix bug when refresh dashboard page~~ Done 26/06/23
- ~~bug: fix bug on toast plugin after build~~ Done 26/06/23
- ~~feature: skeleton to login page~~ Done 26/06/23
- ~~refact: skeleton to login page and adding some animations~~ Done 28/06/23
- ~~feature: add menu with (click on logo to show 'Configuration' and 'Logout')~~ Finished 09/07/2023
  - ~~configuration to be possible change main currency~~ Done 09/07/2023
  - ~~configuration to be possible update the personal infos, profile picture and password~~ Done 25/06/23
- ~~design: update app layout in the <a href="https://www.figma.com/file/dP628egpEkXbEthbFm7qkD/Saidinhas?type=design&node-id=0%3A1&mode=design&t=MLTJEsOo89STpNWC-1" target="_blank">figma</a>~~ Done 28/06/23
- ~~refact: updating to add, edit and delete expense and adding animations~~ Done 28/06/23
- ~~feature: dashboard to filter by month;~~ Done 03/07/2023 and 04/07/2023
- feature: design and add category for expenses
- feature: design and add filters (by category, low to high and high to low)
- feature: chart comparing the expenses in the last 3 months
- ~~bug: if the user edit the form and then update the profile image, the previous updates are lost.~~ Done 12/07/2023
- ~~feature: delete user~~ Done 26/06/23
- ~~bug: after update the value and save, the screen shows the old value while saving~~ Done 03/07/2023
- ~~bug: amount not accepting cents~~ Done 09/07/2023
- ~~bug: going from /expenses page to /expense/{month} the filter doens't work~~ Done 12/07/2023

<br/>
<p>Check the <a href="https://github.com/MatheusFelizardo/saidinhas-backend">back-end repo</a></p>
