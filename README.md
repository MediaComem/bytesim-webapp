# ByteSim - Website ecodesign tool 🌱

🔗 Try it: https://mediacomem.github.io/bytesim-webapp/
## Project description
ByteSim is a web application that simulates the ecological footprint of a website.
From the import of a website mockup and the description of its content, ByteSim will create recommendations to reduce its ecological footprint.
### Figma plugin
For [Figma](https://www.figma.com/) users, you can use the plugin developed specifically for ByteSim. It allows you to import your model directly from Figma.

GitHub repo: https://github.com/MediaComem/bytesim

## Developpement

### How to test it locally or contribute
1. Make sure you have [Node.js](https://nodejs.org/en/) installed
2. Clone this repo (or fork it if you want to contribute), you will need to have [Git](https://git-scm.com/) installed
   ```
   git clone https://github.com/MediaComem/bytesim.git
   ```
3. Navigate to the project folder
   ```
   cd bytesim
   ```
4. Install the dependencies
    ```
    npm ci
    ```
5. Set the environment variables
    ```
    cp .env.example .env
    ```
    Then edit the `.env` file to set the correct values for the environment variables.

6. Run the project
    ```
    npm run start
    ```
7. Open your browser at http://localhost:3000

## Stack
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)
- [React Redux](https://react-redux.js.org/)
## Credits
This project was developed by the [Media Engineering Institute (MEI)](https://heig-vd.ch/rad/instituts/mei) of the [HEIG-VD](https://heig-vd.ch/) with the support of [Romande Énergie](https://www.romande-energie.ch/).

## License
This project is licensed under the Mozilla Public License 2.0 - see the LICENSE.md file for details