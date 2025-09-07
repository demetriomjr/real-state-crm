# Business Endpoints Setup
- Create the controller for Business at `Application/Controllers/` based on entity at `Domain/Business/`
    - Follow restful design patterns, as we did at User controller.
    - Use openAPI swagger to document the endpoints.
- Create the DTOs for Business at `Application/DTOs/Business/` based on entity at `Domain/Business/`
    - Conceal id, since it's the sensitive tenant_id for it's tenancy.
    - BusinessCreateDto must also contain a default user upon creation, which is the user that created the business, adn it's owner.
        - Service must extract user and business from request.
        - Start transaction at this point.
        - Try create the business, if fails, rollback transaction and return error.
        - If business is created, try create the user, if fails, rollback transaction and return error.
            - user's tenant_id must be the business's id.
        - If both are created, commit transaction and return success with authed JWT token.
            - use the AuthorizationService to create the token.
- In documentation, make explicit that the business is created with a default user, which is the user that created the business, and cannot be created without it.
        - "Master User" is created with a user_level of 9, and cannot be deleted.
            - Make sure to unauthorize user deletion if level is 9 at user endpoints.
- Add swagger documentation to the business endpoints.

# Context for understanding (Dedicated to the agent)
- Business is the tenant, the company, or if you may, the owner's business.
- From this point on, fill free to feed the BusinessResponse with Business Data.