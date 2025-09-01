# N8N
- Make sure all necessary pre configs to use n8n inside this project are done.
- Review the files inside the `resources` folder to see the necessary configurations to use n8n inside this project.
    - This file will give you some context, so work with that to best generate the file
    - Make sure we're concise with routes at controllers to consume n8n.

# WAHA
- We need to configure all things to n8n use waha, including how to auth and stuff.
    - Use all the knowledge available to set whatsapp service to be used as n8n flow.
    - Make sure we have all routes necessary in integrated-services controller to consume waha.
    - Remember that n8n is dealling with waha by itself, so we need to configure all things to make it work.
- Create the best way possible for us to auth waha in the dev machine to test it.

# Guidelines of the project
We are now at the point of making the project work with n8n and waha. So let's make sure we have all the need to make the flow.
We have worked on some pre shape for the workflow, but let's do all we need to make it complete. focus on neat and simple approeaches, focus on minimal architecures.
- Try to work with the model we have set already, only add new features if are absolutely necessary.
- The goal is to make whatsapp intergrated, so work on everything we need to make it work.
- Primarily we are trying to achieve:
    - Receive messages from whatsapp
    - Send messages to whatsapp
    - Authenticate waha in the dev machine to test it.
    - Create a simple way to run the auth again at production.

# Tests
- After all that above is done, let's set the tests for this module.
- Make sure we are testing all the way on whatsapp, begining with auth and loggin out.

# Documentation
- Time to update documentation with all news in regard of the code.

# README
- Delete any other MD at the route in the folder with the README.md except GEMINI.md
- Let's rework this readme:
    - Include all techs installed on the project
    - Include all docker containers
    - Express the goal for the project.
    - Include all the commands to run the project and tests.
    - Include all features that the project provides.