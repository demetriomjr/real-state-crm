# Tests
- Remove Majestic completly. Including custom files and UI.
- Remove majestic enviroment variables from .env.
    - Be careful with the .env file, please read it's content before removing anything.
    - In case of an accidental removal, you will have the context to restore it.
- Remove anything related to custom bearer token and its GUID from .env.
- Remove the prompt custom lines for the developer bearer token/tenant_id.
- Remove custom logic in services, contrller and repositories about the developer tenant_id.
- In tests, we are going to inject a random UUID for tenant_id from now on.
- Continue to write log files as json the same way it does right now.
- Give package.json a good clear.

# Middleware rework
- Now to generate JWT payload, we use `tenant_id`, `user_id` and `user_level` 
- The same rule applies when middleware is injecting, now doing for all three.
- Modify all the files needed to make this work.
- Make sure to check all the files that are using the JWT token to make sure it is working as expected.
- Make sure to log any unauthorized request using the logger.

# Security of tenancy
- We now check if the tenant_id is valid in the database.
    - This check will be ignored in development if tenant_id is null or an empty guid.
    - Even in development, if the tenant_id is not null, we will assume that is part of the test.
- In production, if the tenant_id is not valid, the request will return a 401 Unauthorized.
- Clean up every other method that checks about test tenant_id guid that used to be in env.
- In summary, the tenancy test should work as follows:
    - At middleware level, extract the tenant_id and user_level and inject them in the request.
        - If production enviroment, both must exists. otherwise return 401 Unauthorized in this level.
        - In development level, they can be ignored if user_level is 10.
    - At controller level, we check user level, we check user clearance using user_roles for user with an user level < 8.
        - If user is level 8 and above, is an admin, therefore is allowed to do anything.
        - Otherwise, if the user has no role or is a guest, return 401 Unauthorized.
    - Service level has no checks, nor does Repository levels.
    - Its important to note here that, all clearance happens in controller level.
    - Service level now is only in charge of business logic.
- Make sure there rules are applied to all created so far.

# /index landingpage
- Lets do some clean up.
- Keep the header, footer and the under header text.
- Keep the "Go to documentation" button.
- Remove everything else (place the button outside below the uderheader text).

# Leads and Customers
- Create the entity Address under `Domain/People` as follow:
    - Implement IAuditBase interface and it's properties.
    - address_line_1: string
    - address_line_2: string
    - city: string
    - state: string
    - country: string
    - zip_code: string
    - district: string
    - person_id: Person
    - is_primary: boolean
- Create the entity Contact under `Domain/People` as follow:
    - Implement IAuditBase interface and it's properties.
    - contact_type: string ["email", "phone", "whatsapp", "cellphone"]
    - contact_value: string
    - person_id: Person
    - is_primary: boolean
- Create the entity Document under `Domain/People` as follow:
    - Implement IAuditBase interface and it's properties.
    - document_type: string
    - document_number: string
    - person_id: Person
    - is_primary: boolean
- Create the entity Person under `Domain/People` as follow:
    - Implement IAudit interface and it's properties.
    - full_name: string
    - document_type: string
    - document_number: string
    - other_documents: Document[]
    - contacts: Contact[]
    - addresses: Address[]
- Create the entity Lead under `Domain/Leads` as follow:
    - Implement IAuditBase interface and it's properties.
    - person_id: string
    - lead_type: string ["customer", "prospect"]
    - lead_status: string ["new", "contacted", "qualified", "won", "lost"]
    - lead_temperature: string ["hot", "warm", "cold"]
    - lead_origin: string ["website", "email", "phone", "whatsapp", "cellphone", "other"]
    - lead_description: blob
    - lead_notes: string[]
    - first_contacted_by: UUID
- Create the entity Customer under `Domain/Customers` as follow:
    - Implement IAuditBase interface and it's properties.
    - person_id: string
    - customer_type: string ["individual", "company"]
    - customer_status: string ["active", "inactive"]
    - fidelized_by: UUID


# Services arrangement
- The services here are going to be `Leads` and `Customers`.
    - Person is an utility entity, with the purpose of being resourcefull with possible duplicated data.
    - To avoid this scenarios, we keep the main person info in it's own entity, which is fechted alogside with the other entities.
- Controllers, services and repositories are going to be created as usual, but only for leads and customers:
    - Here is important to notice, when consuming lead or customers, the response is all data from the lead, plus non-array data from the person.
    - The same works for creating or updating both, the necessary person data is in the request dto.
    - Create both paths with that in mind.
    - Person cannot be accesed directly, only through lead or customer, yet anyways.
    - Make sure all dto's have all necessary fields.
    - All arrays in people are not mandatory quite yet.
    - Make sure to create option list for the routes with predicated data and expose it following standards.
    - Make sure to document all the routes with swagger.
- This paths are gonna have special routes.
    - person entity's array can be updated through the body. If an `id` is set in the object, it will be updated, otherwise it will be added.
    - all these arrays can be created upon entity creation, in both leads and customers.
    - An error must be return if an lead or customer is trying to be created with a document_number that already exists in the database.
