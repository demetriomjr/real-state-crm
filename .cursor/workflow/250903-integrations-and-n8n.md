# Script Folder
- Clean up everything about /scripts folder.

# Whatsapp WAHA integration
- Now we are only consumingo WAHA via n8n integration, therefore we don't need integrate it here on our app anymore.
- Remove all code related to WAHA integration.
- At database level, only Whatsapp session is the table that should be kept.

# Integrated services
- We are going to rework this section, renaming this controller to `Webhooks`
- Make sure all logic is set to work around this concept. Webhooks will be responsible for handling all incoming requests from n8n.
- Now n8n is our service for receiving third party services, therefore we don't need to integrate them here on our app anymore. We only consume n8n.
- This controller will grasp the path `/webhooks`.
- The only hook we have right now is `whatsapp`.

#N8N Routes
- Create a local variable to set n8n url as `localhost:5678`.
- All routes starts with `/webhook` before any path below.
- Path `/whatsapp/session` is a POST that creates a session if not exists, starts it if exists.
    - receives the body as follows:
        ```
        {
            "session_id": "GUID",
            "tenant_id": "GUID",
        }
        ```
    - It will Auth and send as response a QR code to validate the session if not yet.
- Path `/whatsapp/auth` is a POST that receives `session_id: UUID` for a existing one, and do the business to receive the QR code for phone validation.
- Path `/whatsapp/session/start` is a POST that receives `session_id: UUID` for a existing one, and do the business to start the session. This is necessary for whatsapp to start the session at Meta's servers, before auth and receive messages.
    - To consume this route, make sure the session exists before in database at our app level, before calling n8n.
- Path `/whatsapp/sendMessage` is a POST that receives the following body:
    ```
    {
        "session_id": "GUID",
        "contact": "string", (numbers only)
        "message": "string",
    }
    ```
- Create a `N8N-Whatsapp` service to deal with all logic above. This service has no controller, repository or validator. It only exists to consume n8n routes about whatsapp. We are using Axios to consume n8n routes.

#Chat route
- We need to make sure that we are properly sending messages to n8n when needed.
- When sending messages via chat, we need to persist in database first, then send to n8n, in order to be sent via whatsapp.
- When receiving messages via webhook from n8n, no data will be persisted in database in n8n level, so we need to persist it here on our app.
- Make sure to check the whole pipeline i described above and rewrite the code to fit the new structure as suitable.
- Make sure to consume new service `N8N-Whatsapp` to send messages to n8n.

# New webhook controller
- On the whatsapp webhook, we need to make sure we are consuming some types of possible incomes:
    -- Incoming message:
    ```
    {
        "id": "evt_01aaaaaaaaaaaaaaaaaaaaaaaa",
        "timestamp": 1634567890123,
        "session": "default", //session name in our database
        "metadata": {
            "user.id": "123",
            "user.email": "email@example.com"
        },
        "engine": "WEBJS",
        "event": "message",
        "payload": {
            "id": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "timestamp": 1666943582,
            "from": "11111111111@c.us", //contact phone number
            "fromMe": true,
            "source": "api",
            "to": "11111111111@c.us",
            "participant": "string",
            "body": "string",
            "hasMedia": true,
            "media": {
            "url": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga",
            "mimetype": "audio/jpeg",
            "filename": "example.pdf",
            "s3": {
                "Bucket": "my-bucket",
                "Key": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
            },
            "error": null
            },
            "ack": -1,
            "ackName": "string",
            "author": "string",
            "location": {
            "description": "string",
            "latitude": "string",
            "longitude": "string"
            },
            "vCards": [
            "string"
            ],
            "_data": {},
            "replyTo": {
            "id": "AAAAAAAAAAAAAAAAAAAA",
            "participant": "11111111111@c.us",
            "body": "Hello!", //text message
            "_data": {}
            }
        },
        "me": {
            "id": "11111111111@c.us",
            "lid": "123123@lid",
            "pushName": "string" //contact name
        },
        "environment": {
            "version": "YYYY.MM.BUILD",
            "engine": "WEBJS",
            "tier": "PLUS",
            "browser": "/usr/path/to/bin/google-chrome"
        }
    }
    ```
    - I'll rename the necessary data from above to relation with our database entities:
        - "session" -> "session_name" in WhatsappSession entity
        - "from" -> "contact_phone" in Chat entity
        - "body" -> "message_content" in Message entity
        - "pushName" -> "contact_name" in Chat entity
    - Make sure to read all of this above to create necessary logic to add data.
    - This webhook does not process any data, so we need to make sure we create all data necessary to process it.
    - For session, make sure we are able to find WhatsappSession in database by name in repository, because we are going to need to use it's id to create the chat entity.
        - if for any reason the Session does not exists, log on ILogger and ignore the data.
    - With now the Session ID, let's check if there's a Chat entity with the same contact_phone.
        - If doesn't exists, create it using `pushName` as contact_name to create it. Also, at database we only save the phone number, so we need to convert the phone number from the `from` address we receive.
        - If the route `sse-chat/subscribe` is being consumed and contains the `chatId` of the chat entity, we need to send a message to the client with the new message received.