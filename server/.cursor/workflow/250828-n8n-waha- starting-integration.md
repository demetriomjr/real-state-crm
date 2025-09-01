# N8N
Lets begin working on AI feedback system for chat, alongside with whatsapp integration, both running on n8n on local docker.
The objective here is to set up a chat system, integrating whatsapp as it's main stream of outstream messaging system.
Putting simple, a chat system within the crm will use whatsapp to communicate with the customer. For the customer POV, they will receive normal messages from the chat system, and will be able to reply to the chat system using whatsapp.
As for the crm user, it's a normal chat system, with a few extra features.
We are gonna set another separate instance of Postgress to use as main database for N8n. That's how we are going to both save the chat and propagate the context to the AI feedback system.
The feedback system in this picture is responsable for following the messages and suggest/generate feedback to the crm user.
Remember that the goal of this CRM is to create a tool that the user can use to reach, engage and convert customers. The whole ai assistant is engineering around that idea.

## 1. Setting up
- Let's begin by setting up the n8n instance and new database in local docker.
    - Make sure to configure all start-up variables in the .env file.
    - Setup the new dabase in docker to hold both chat and feedback system log and history.
    - Setup all new database related variables in the .env file.
    - Run the docker compose file to start the n8n instance and new database.
    - Configure everything in the n8n instance to developer start creating fluxograms around the chat and feedback system.
    - The new database might be arealdy set inside n8n.
- Let's set the new database using prisma.
    - Create an entity called "Chat" at `srv/Domain/Chat/` as follows:
        - Implement IAudit interface and it's fields.
        - person_id: UUID [foreign key to Person.id]
        - contact_name: string
        - contact_phone: string
        - user_observations: string
        - last_message_at: DateTime
    - Create an entity called "Message" at `srv/Domain/Chat/` as follows:
        - Implement IAudit interface and it's fields.
        - chat_id: UUID [foreign key to Chat.id]
        - user_id: UUID [foreign key to User.id]
        - message_id: string
        - message_direction: string [enum: "received", "sent"]
        - message_type: string [enum: "text", "image", "audio", "video", "file"]
        - message_content: string
    - Create an entity called "Feedback" at `srv/Domain/Chat/` as follows:
        - Implement IAudit interface and it's fields.
        - chat_id: UUID [foreign key to Chat.id]
        - user_id: UUID [foreign key to User.id]
        - feedback_type: string [enum: "positive", "negative", "neutral"]
        - generation_type: string [enum: "user_prompt", "ai_suggestion"]
        - user_prompt: string
        - feedback_content: string
    
    - Create schemas at the local prisma folder.
        - Make sure to keep both databases separated in different schemas.
        - You can come up with your own organization.
    - Run prima's CLI to create the schemas at database.
    - Create the new DBContext at `srv/Infrastructure/Database/` as follows:
        - We currently have a DBContext for the main database that needs to be renamed and have the files that uses it, updated.
        - Now that we have two databases, we need to name them properly. The second database is not necessary exclusive for N8N, but a way to share chats with N8N without sharing other data.
    - Create all the repository logic for Chat.
        - Remember, following the principle of master-detail relationships, Chat is the master, and Message and Feedback are the details.
    
# Setting up accessibility and propagation of data
## Chat
Chat is a special entity, since messages can be sent both from the crm or the cellphone's whatsapp. Because of that, we need to make sure we are always registering messages as they are received. Because of that we need to system a hook system that will be responsible for registering messages as they are received. Remember that whatsapp uses SSE to send messages, so we need to make sure we are always registering messages as they are received, we need to listen to all messages, including ones that are sent from the system number at the fone, to keep consistency.

## Webhook and data consystency
We are going to use a webhook route to receive messages from whatsapp. This route will be responsible for receiving messages from whatsapp and registering them in the database.

- Create a controller named `IntegratedServicesController` at `srv/Api/Controllers/` as follows:
    - Create the webhook route that we will register in the whatsapp webhook.
    - Implement here all the logic for a WAHA message, since it's the service what will integrate with n8n to receive messages.
    - This controller uses diverses services for each integration.
- Create a controller named `ChatController` at `srv/Api/Controllers/` as follows:
    - This controller is responsable to create all the routes for chats related to the system.
    - This is not a whatsapp related controller.
    - This controller deals with static RESFUL routes for the API system in the CRM.
    - It has regular logic for resful routes and all it's routes. Make DELETE only acessible for Developer of user_level 10.
    - It has custom routes for messages:
        - GET /:chat_id/messages: If empty, returns all messages with pagination for better performance. a "last_message_datetime" parameter can be passed in the query to get only messages after that datetime.
        - POST /:chat_id/messages: The user may pass an array of messages to be created.
        - No PUT or DELETE routes are needed for messages. We are going to assume edited messages by the id in the properties of the object structure as json. In this case, is important to know from the documentation of the API that this DTO will have an optional "id" property, that will be used to update the message. DELETE is out of scope for now.
- Create a controller named `SSEChatController` at `srv/Api/Controllers/` as follows:
    - This is a subscription controller, that will be used to subscribe to the SSE route for the chat.
    - It only has the subscribe and unsubscribe routes.
    - Instanciate a list of subscribers, that will be used to keep track of the users that are subscribed to the chat.
    - Use a custom local Typescript structure to keep track of the subscribers.
    - Remember to keep the last_message_at field updated everytime the user interacts with the chat.
    - Create the event that automatically closes the SSE connection after 5 minutes of inactivity.
    - The user.id is the key used to subscribe to the SSE route.
    - Only one chat at time can be subscribed to each user.
    - Let's set a timeout of 5 minutes to close any uninteracted SSE connection.
        - Create all the logic necessary to handle the SSE connection.
        - This 5 minutes value is a variable that can be changed in the .env file.
    - Make sure we are reseting the last interation inside this evet everytime the user interacts with the chat, so we can keep the context alive.
    - Configure all event handlers necessary to pass the income messages to the subscribers.
    - Make sure the IntegratedServicesController uses the SSEChatController to subscribe to the SSE route for the chat. What i mean is, if there's a subscription alive for that chat, it should send the message to the user via event.
        - The best way to deal with this is a "rabbitMQ-alike" local, small cache, where we keep the messages awainting to be sent and remove them from the cache once it is.
        - In this case, the IntegratedServicesController is only responsable to stage the message in the cache. However, the IntegratedServicesController also can access the current subscribers list to see if there's indeed the need to stage the message, otherwise only deal with persistency in the database.
        - Staging a message in SSE layer does not mean that the database logic is not needed. ALL messages must be persisted in the database.
- Create a service named `WhatsappService` at `srv/Application/Services/` as follows:
    - This service is reponsable to deal with all the logic related to whatsapp, from internal and external sources.
    - Create the method that deals with receiving messages from whatsapp.
        - First we need to make sure the message is not already registered in the database. because of that, we set the message_id everytime we create a new register in database for messages.
        - If it is, just check if the content is the same, if not, update it, otherwise, just ignore it.
        - If it's a new message, we need to create a new register in the database.
        - For received messages, the user_id is the system number at the fone.
        - Don't forget to update the last_message_at field in the chat.
        - If no chat exists yet, we need to create a new one.
        - If the customer is the one who started the chat, we need to keep the user_id as empty, since a new user must be set later.
        - If the CRM has any logic whatsoever to notify any subscribed user to any internal SSE route, we need to pass the message to the service.
    - Create a method that deals with sending messages to whatsapp.
        - This method deals with the logic that the user will use to send messages to whatsapp.
    - This controller is only acessed by the `IntegratedServicesController` and the `ChatController` for it's custom logic. The reason being is that the user can only send messages through the chat system in the CRM, and not directly via whatsapp api.
- Create a service named `ChatService` at `srv/Application/Services/` as follows:
    - This service is responsable to deal with all the logic related to chats, and also dealing with sending the messages via whatsapp.
    - Every create or update uses `WhatsappService` to propagate the message to the whatsapp service.
    - Uses all commom service methods.
- Create a validator for this service at `srv/Application/Validators`.
    - Validate if message is not empty.
- Create a reposiory for this service at `srv/Infrastructure/Repositories/` using already know structure used in the project at other repositories.
- Do not create DTOs for IntegratedServicesController, since this will be handled by the service structure locally using common javascript objects.
- At Application level create DTOs for chat Service.
    - Create and update can be the same request DTO. the repository method will be correctly called based on the id property.
    - Create, Update and Delete have no response DTO. they only return their status of response.
    - Make sure to correcly structure the response DTO for the GET / with pagination. Also do the same for the GET /:chat_id/messages.
- The WhatsappService will be responsable to convert the data received from the webhook to the correct DTO for the chat Service.

- A base sense of what is going on here, since is too cluchy of information, the subcritption is responsable for giving the live sense of the chat, while the restful routes are a way to import the messages without being in need to be live.
When a chat starts, if the front-end wants to load old messages in the chat start, it has to do it by route, while the SSE will only deliver new messages.

- Now, let's work on the feedback system:
    - Create the Controller, Service, Repository and Validator for the feedback system using only Create, Show and List.
    - We won't update the feedback, but we can create logic to ignore later. Same is worth for deleting, we won't!We can use this data to improve the AI feedback system later.
    - Create the Request DTO as follows:
        - chat_id: UUID 
        - user_id: UUID 
        - user_prompt: string?
        - message_ids: string[]?
    - Create the Response DTO as follows:
        - id: UUID
        - chat_id: UUID 
        - user_id: UUID
        - feedback_type: string [enum: "positive", "negative", "neutral"]
        - feedback_content: string
        - created_at: DateTime
    - user_prompt is optional, because the AI can generate the feedback without the user prompt.
    - in case message_ids is empty, consider only the last message in the chat.
    - Create a table in the database that holds users prompts and feedbacks. This will give us the chance to create a rate system to improve the AI feedback system.
    - Make sure we are mapping all data properly to and from it's dtos