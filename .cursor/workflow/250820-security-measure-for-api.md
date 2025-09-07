# Roles, business restrictions and security measures
    - Add user_level to JWT token payload.
    - Make sure to extract it in middleware and inject it to the request object.
    - In case of absent user_level, return 401 Unauthorized and a message.
    - Set a resource for user levels as follow:
        - 0: Guest
        - 1: Regular user
        - 8: Admin
        - 9: Master user (Business owner)
        - 10: Developer
        - From 3..8, we will decide what to set later on.    
- When listing business by id, make sure to check user level >= 8.
    - Only admins can see details about a business.
    - Only admins can retrieve users as FindAll.
    - when retrieving users by id, make sure to check if user_level in request is >= user level of records retrieved.
- For all Controllers. make sure to retrieve user entity with user roles list.
    - If user level is < 8, it will need clearance to do a certain action set in user roles.
    - If a named role is not set in roles, it will be considered default as false in is_allowed. 
- Confirm that the FindById, Update and Delete is always retrieving a record of the tenant_id in the request.
    - Refactor all controllers to use the tenant_id in the request.
- Controller level now is in charge of checking if the user has clearance to do an action by role and level.
    - Refactor any service and repository that is checking these arguments, and make sure it is set in the controller level.

# Take two on this matter
- Refactor all business logic from repository to controller as follow:
    - Create Business now return AuthorizationResponseDto only.
    - Update Business now return BusinessResponseDto, which cannot have ID exposed.
    - The Delete Business Route now is special.
        - It's no longer public, only acessable at developer level (for now).
    - Make sure to read all files related to bussiness to check if ID is not exposed.
        - To the Delete Business Route, keep the service and below logic as the same, use the tenant_id from the request in the "delete pattern", the "id" requested in the delete pattern is the tenant_id from the request.
    