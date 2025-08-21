# First take
- Create a constant GUID value called "developer_tenant_id" at .env, but keep out of .env.example.
- When running "npm run start:dev", make sure to use this value in the token generation and prompt it to dev to copy and use it.
    - add an expiration of 1 year to it.
- Make sure, wherever a tenant_id is needed, if the tenant_id is "developer_tenant_id", tenancy rules must be ignored.
    - Try to adapt this rules without changing too much code.