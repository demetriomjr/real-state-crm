# Preparation
* The frontend project is set in <root>/client/ folder
* The goal is to generate a frontend project using React, Vite, and Material-UI
* All guidelines are set in <root>/.cursor/rules/*.md files. Read them before generating any code.

# Design choices
- We are developing a real state saas with focus in CRM logic and customer relationship management.
- We need to develop using guidelines for this format of sofware as the market is used to see.
- The base layout consists in a sidebar with a header and a content area.
- The color pallet is essencial and we are going to set them while generating the project.
- This project has no individial git repository, so we are going to use the root folder as the git repository.
- This is a mobile first project, so we are going to develop the project using mobile first principles. But make no mistake, the UI should adapt to desktop as well.
    - Make sure to use known principles for adapting mobile uis to desktop. 
    - Be carefull with viewport scalling and make sure to use the correct units for the UI.
    - In mobile viewports, the sidebar should be hidden and the header should be full width. Also header and footer are always fixed in both scenarios.
    - In desktop, the use has the option to collapse the sidebar.
    - In mobile, the sidebar shows on top of the content.
    - The content scales accordingly to the viewport height. But the width is mostly centered.

# Layout definitions
* Use only material design base components, but you can create composed components to be used in the project. That way we create reusable components.
* Use MUI standards for buttons styles.
* Use MUI standards for input styles.
* Be careful with border radius sizes since they tend to be inconsistent when scaling to larger viewports.
* Use MUI standards for typography.
* In any scenario, use mobile-like validations for forms.
    - Red outline when the field is invalid. Green outline when the field is valid.
    - Small text with the error message below the field.
    - Make sure this is real time responsive.
* Create the sidebar menu as we progress, following this layout:
    - Home
    <all entity modules>
    - Settings

# API definitions
* Always map the api endpoints from the /server/src/controllers/ folder before implementing the calls here.
* Use Axios for API calls.
* Use the same API endpoints as the backend.
* Map all DTOs from the backend to the frontend. Do it as simple as possible.
** IMPORTANT: Check if backend is running before testing**

# This spet in the project.
This context is the start of the project. Make sure you understood and consulted all rules necesary to start working. Feel free to ask for any clarification or help.
* Start by installing the project dependencies.
* Create the project structure using a Component based approach.
* Create the project using Vite CLI commands.
* Rename the project properly using .env
    - Create the .env file in the frontend folder if not exists.
* Start the development of the base components to instance the correct pages later.
    - Create the base components for the sidebar, header and footer.
    - Create the container for content the correct and more viable approach.
    - Create all the logic for hover, collapse/expand and it's effects.
    - Create the "current user" logic to show the user info in the header.
    - Create the mini menu for user actions.
* Start it all by creating the login page.
    - Create all components needed for the login page.
    - Imbue the API logic to the login page.
    - Create the logic to handle the login process.
* Create a register page.
    - Create all components needed for the register page.
    - Imbue the API logic to the register page.
    - Create the logic to handle the register process.
    - Make sure this is a public route in the /server/. if not you can change the middleware logic to allow it.
* Create a static logic to hadle JWT to be sent in the request header.
    - We are going to use JWT in all requests to the backend.
    - Make sure we have a reusable code to do that everywhere. That way if we need to change the logic, we can do it in one place.
    - Make sure we are storing the JWT and userSecret in the localStorage.
    - For information about the userSecret, check the backend logic.

# Styling
Even tho we are using Material-UI, some basic information can be stored in the theme.js file. This way we can populate standards all across the project.
* Create the theme.js file in the /client/src/ folder.
* things like custom colors, typography, width for buttons, icons and etc.


# Developing
After you have considered all that, start working on it, create all i've asked for and then locally build to test compílor errors.
Later, docker compose build both server and client and then run it.