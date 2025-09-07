# Validators
- we didn't create validators for anything later than the user entity. Let's work on that.
    - Create validators for all entities at all.
    - In person, validate the document_number and document_type, tenant_id and full_name length.
    - In address, validate the address_line_1, city, state, country, zip_code, district are not empty.
    - In contact, validate the contact_type and contact_value. Create regex for each type and use them to validate. Remember that phone has different formats in different countries.
    - In document, validate the document_type and document_number are not empty.
    - I've stated some values in [a...a] in other md files under this directory, so you could set expected values for those fields. Make sure we are using them. It's validator job to make sure these values are correct.

# Database cascade effect to be added
- address and contact need a special rule:
    - Upon creation, check if that person entity already has any in their arrays. if not, is_primary must be true. otherwise set it to false.

# Customer refactor
- fidelized_by can be null.

# Person refactor
    - In update DTOs, let's create arrays to delete records from the arrays.
        - example: addresses_to_delete, contacts_to_delete, documents_to_delete.
    - Make sure we are properly handling the arrays in the service.

# Repository refactor
    - Leads and Customers repositories must start transaction when creating or updating.
    This will keep consistency in case of an error.

# FindAll interface
- Now findAll can accept filters. They will come as query params.
- Make sure to pass the query to the service, where it will be mapped to the entities filters and passed to the repository.
- Services accepts the request query, and convert it to the entities filters, so repositories can only accept entities filters.
- At repository level, we can ignore empty or null filters.
- Pagination can be resized too here. not max value set for now.
- no query is mandatory whatsoever.

# Create tests for new entities.
- Create tests for all new entities.
    - Make sure to test addresses, contacts, documents, in both leads and customers.
    - The syntax must be as follow:
    ```
    data: {
        "addresses": [], //accepted
        "addresses": null, //accepted
        //no array passed is also accepted
        "addresses": "not an array", //not accepted
        "addresses": {}, //not accepted
        "addresses": 1, // or any other type of value (bool, string, number, etc.) not accepted
        "addresses": ["foo"] //not accepted
    }
    ```
    - the objects inside the arrays must contain all required fields following their types.
    - if field filled with string but is another type, it can try to convert.
    - in case of not converting, log error and return error 400.

# User entity
    - Create or update entity also should use transactions because of it's mater/detail relationship.

# Documentation
- For those expected values i mentioned in #Validators, make sure to document them in the swagger.