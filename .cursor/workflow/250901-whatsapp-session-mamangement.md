# Waha API consuming.
Now that Waha is running in docker, we can set some ways to consume it's API. let's create some architecure to consume WAHA via our NestJS application.
We are going to create all this integration via n8n. The n8n need to integrate our database to persist data using our api.
Make sure this part of the API in Nest is only available for our n8n instance. They will always be at root since we are deving in devops.
We already have some logic to create chat. Now we need a way to add whatsapp integrations to our application.
    - Create Models in domain, repository, service, controller, validator, etc for a new entity called WhatsappSession.
    - Create all Nest routes in controller.
    - Context for WhatsappSessions:
        - tenant_id is necessary, since our app is multi-tenant.
        - Session name in waha is the Session ID in database. Dont forget to implement IAudit interface in WhatsappSession entity.
        - Every time we create a session, we need to return the data, along with the QR code to auth the session.
        - The app sets waha hook by it self.
    - Make sure to set all needed routes from WAHA in this to consume via n8n.
    - Follow all guidelines for n8n integration.
    - Rework @waha-n8n-flow.json to fit this new integration.
- This routes of whatsappsession will be managed by the user in front end dashboard.
- Every created session needs to return an qrcode to validate. Make sure we are set with how long does the qr code lasts so we can send a new one if needed.
- Make sure to create all tests for it. try to rework some existing ones as well.
- Make sure we are using WAHA models to shape our dtos as well, speciially if a user input is needed.

# Integration and n8n autonomy
- Make sure to set all needed routes from WAHA in this to consume via n8n.
- Check all services and controllers, repositories to check if all we need are there.
- Make sure we have all n8n routes in this integration.
- It's important that n8n manages messages and sessions, while we manage only chats, webhooks and integrations.
- Create both ways of authing a number in waha, which are qr code and phone number sms.
- Make sure n8n is running all needed routes in WAHA. I see that after creating, we need to run the session. Make sure it's all covered and all possible errors are handled.
- Also cover all other possible needs to make it work.


# WAHA
- Right now we are only MPV implementing the sessions management and text messages. Other funcionalities can be implemented later.
- Make sure to consult all needed work in WAHA to complete a task in n8n. Such as:
    - The complete process before requesting a qr/auth code.
    - The complete process before trying to send a message.
    - Also make sure we are set to receive messages.
    - Make sure webhooks are implemented when sessions are created and also test them before returning a response to user.
- WAHA also has a chats management. Make sure we are set to deal with it inside our own chat management system. We need keep up compatibility with both.