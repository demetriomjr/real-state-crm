*** IMPORTANT ***
* Use windows powershell commands pattern.
* always run eslint to check for errors.
* only dockerbuild the containers related to the app you worked on (all of them), and not the whole container chain.
* This is a fix context, so we need to be very careful with any changes we make.
* Feel free to ask questions to fill up gaps in any context i provide here.
***

1. Business and main page fixes ✅ COMPLETED
* In main page, the user's name on header is not being shown. Make sure we are loading the user's full name on the /users/:id route. We set this at service level in backend and the dto response comes as one object. ✅ FIXED
* Business page is not loading because when i registered and auto logged in, it probabily didn't store userSecret and JWT. The message i get when click on sidebar is that "missing tenant_id and user_level". Let's clarify this:
    - On front end we store userSecret and JWT in localStorage. userSecret is generated at login, saved as cache in server and it's used so we don't share ID's related to database(sensitive data). At controller level, we get user data, such as user_level and user_role[]. If user level is < 8, it will need clearance to do a certain action set in user roles. This roles are not set yet.
    - Each level of the application is responsable for a portion of the workload as described above.
    - We should return messages as "user not authorized" when user level is < 8 to the backend, and only return error logs when the user is level 10 (developer).
- Make sure we analyse the userflow, authflow and loginflow, middlewares as well and find anywhere on which this example is not being followed.
- On page load unclearances, we should pop a alert informing the user that he is not authorized to access the page and return to home.

2. Unstored login and business page fixes ✅ COMPLETED
* something was messed up and refreshing the page is causing log off. It's supposed to stay logged in. Only if the browser is closed, it should log off. ✅ FIXED
* trying to load the business page is still returning "missing tenant_id or user_level". Check the logic i described in n1 again. Make sure we are analysing both front and back ends. ✅ FIXED
* there's a user with the username "demetrio", make him a user_level 10 (developer). just use powershell to do that. ✅ COMPLETED
* on login page, username input shows emails as "cookies". it will stop sugesting emails if we HTML encode the input to tell it that types of data it can accept. Make sure to not do anything fancy here, just use regular html stuff. ✅ FIXED

3. Sidebar menu and business page fixes
* When collapsed, the sidebar menu is not showing the icons. Make sure to show them. It desappears when collapsed.
* business page is unloading the whole app. Try to debug it here via chrome devtools.

4. Business edit page
* To clarify what Person table is in database, it is a "fragment" of a whole entity. it's a manner of not repeating data in the database. Because of that, any level in application does not know about this, for it, a Lead is a single object, same for business, customer, user and etc.
    - Use that information to set this format everywhere in the backend where person is used. Only repository and infra level knows about "person entity". Domain also knows because it's used in infra level.
    - All DTOs use a single object to hold all information. 
    - Make sure we have that cleared out in the backend.
* In business page frontend, We don't need a "view" mode. we can always load a "detail" page in edit mode. We need two buttons at the bottom of the main container: "Save" and "Cancel". Make sure the component is reusable.
* Make sure we only use tabs here below the main data. In business case, we show all busines main data, and the lists we can set below this container in a tabview kinda mode.
* We are missing pretty much all i18n in this page. Make sure to add it.
    - Make sure to create i18n translations in the backend for "options" of the inputs.
    - Give a good look a the backend for possible i18n options translations and make sure to implement the logic that will handle it.
* /businesses/:id is the only response DTO for now that we are going to return "created_at". all other audit fields must not exists in ANY response DTO for the API. anything in the IAudit interface must only exists in the backend, saved the "business" edit frontend page that shows it as "Date of business creation", not as audit mode, but as a fun fact about the account.
* Use color coding for "edit buttons". you can use a tone of red for cancel and a tone of green for save.
* Let's improve the layout of this page:
    - The data content must be inside a scrollable container.
    - The container that holds buttons to save and cancel must be fixed at the bottom of the page. Make sure that if the pages does't fill the viewport height, the buttons container stays close to the data container.
    - If the container enables vertical scroll, make sure to show a scrollbar. in this case, the button container must be sticky to the bottom of the page.
* Business domain no longer exists. Delete it from anywhere in the backend and business page frontend.
* Don't forget to run lint for errors before docker build.
* Only compose container that needed code changes. in this case will be both, but in the future in this chat, make sure we are only composing the containers we changed.

5. Business edit page fixes
*** IMPORTANT: CONSIDER ALL INFORMATION UNDER THIS EDIT NUMBER. IN PREVIOUS YOU IGNORED INFORMATION OVER WORKING TOO LONG ON THER MATTERS. NO INFORMATION MUST BE IGNORED. REVIEW MANY TIMES THIS ITEM IF NEEDED TO ENSURE NOTHING WAS LEFT BEHIND. ***
- All labels are missing i18n. analyze all potential UI components that might use i18n tags and make sure we have them all in the json file. Also make sure we are loading them with the page.
- Business status can be encapsulated with Business information in a row container to be side by side.
- "PERSON" IS NOT A SEPARATED DATA FROM BUSINESS IN FRONTEND LEVEL. IT MUST BECOME ONE SINGLE OBJECT IN APPLICATION LEVEL IN THE BACKEND AND CARRY ON THE SAME ALL THE WAY TO FRONTEND. AS EXPLAINED ABOVE ON WHAT IS PERSON TABLE AND HOW IT WORKS. MAKE SURE YOU REVIEW THAT EXPLANATION ABOVE ONCE AGAIN AND DON'T MAKE THE SAME MISTAKE.
- Business page is not loading in "edit" mode. in this app no "view" mode will be set in pages that loads main data.
    - Because business has lists, it's reasoable that they have an "edit" option, but not the main object data. This logic is incorrect and i explained it above.
- In this app itself, we have a "content container", this guy can enable scroll bar, but not the outisde containers. Because of that, business page's buttons to save or cancel are not sticky in the viewport. right now i have 2 vertical scrollbars. one is the browsers and the othe is the main containers.
* Find a way to make sure the double vertical scrollbar never happens.
* Every edit page we create from now on will have a button panel just like this and we need to find a way to work as described.
- Work carefully in every detail i mentioned and consider the header of Importance i tagged at the beginning of this file.

6. Logic overhaul and design choices
* In frontend business page, fullName is being shown in a separated container from businessInfo. As stated before, this is supposed to be together.
    - Created at and Updated at from the person fragment is being responded in the DTO. as i mentioned before. IAudit from any table should not be returned in the API. Think about that and refactor anywhere that it's happening.
    - update app and client containers ignoring cache, because some changes are not reflecting due to docker cache.
- Make "content container" in the main app component fixed with the viewport height. I don't want any more scrollbars in the browser, only inside the main containers.
- Edit container should have fixed buttons container at the bottom, but it's not really working. perhaps we need to wrap it outside of the data container and make this "data container" scrollable, but the outside parent container (that holds the button container) should be fixed.
    - Reflect on that and take your time to really think about a profesional solution on this one. Consider analyzing the whole layout inside the page before deciding how to structure it.
- Tooltip edit and delete buttons in the list. These tooltips should be i18n tags as well.
- Domain input is still being shown in the page. Remove it. Make sure domain property doesn't exists anymore anywhere in front and back ends.
    - Make sure to remove anything related to it also from i18n json files.

7. More refactorings
- I asked you to move the fullName input to the businessInfo container. Not that whole person container. Forget the created at updated at fields.
*** BACKEND ***
** Response DTOs **
- Make sure no Response DTO is return any of the IAudit interface fields, only ID. ID is not showable in interface components.
- Also make sure we are not returning foreign ids (person_id etc) in the Response DTOs. Consider the following. If i hold the ID for business, in database i have the person_id, and since is sensitive data, i don't want to return it in the Response DTOs. When updating. it's repository level responsibility to retrieve the original business data, and then use it's person_id to update the person data. The same are for detail tables, like addresses, contacts, documents and etc. The person_id inside them should not be returned. Because of that, custom DTOs must be created for list items as such. You need to scan the whole project to find anywhere these examples are not being followed and fix it one by one.
- Response DTOs must return the whole data without depending from other entities. No domain entity must be used to compose a DTO EVER!
    ** In business-response.dto.ts for example, i don't see all the information that is being shown in the frontend, which means that somewhere you are composing a return that is not this DTO. DTOs are the template for API reponses, make sure we are following this rule.
- I said that the only response dto that will return created_at is the business-response.dto.ts. because we will show it as "Date of business creation", not as audit mode, but as a fun fact about the account. This is the only exception so far. Make sure to follow this rule.
- in business frontend page, we have a editable input called business.subscription. This is a stakeholder data and not a internal business data. Make sure to not return it in the Response DTOs. You can show the subscrition level in a read only field as it was before tho.
- The created at and subscrition container you had inside the page before is not being shown. check if you deleted or if it's nested inside the somwhere else and fix this issue.
- The Content container is still now flexed at vh and the browser is still showing a scrollbar. Fix this issue.