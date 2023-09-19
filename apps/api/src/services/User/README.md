# User Service
All CRUD related to a `User` plus log in and log out.
User reigistration falls into the same endpoint for "create user". 

## Functionality overview
Here is a quick overview of the API endpoints exposed by this service.
  

### Create user (aka: registration)
`POST /users`

#### Request
```json
{
    "email": "test@test.com",
    "phone": "+13133076785",
    "password": "Password1",
    "firstName": "Tina",
    "lastName": "Belchor"
}
```
  

#### Response

```json
{
    "id": "abc-123",
    "phone": "+13133076785",
    "firstName": "Tina",
    "lastName": "Belchor",
    "groups": ["motorist"],
    "createdOn": "2023-01-01T20:00:00",
    "updateddOn": "2023-01-01T20:00:00",
}
```

  
  

### Update user
`PUT /users/me` to update the current user  
`PUT /users/:id` to update a specific user (must be an admin)

#### Request
All parameters are optional. Anything not passed in will remain unchanged.  
Only an admin can change a users group.

```json
{
    "email": "test@test.com",
    "phone": "+13133076785",
    "groups": [],
    "firstName": "Tina",
    "lastName": "Belchor"
}

```

  

#### Response
```json
{

    "id": "abc-123",
    "phone": "+13133076785",
    "firstName": "Tina",
    "lastName": "Belchor",
    "groups": ["motorist"],
    "createdOn": "2023-01-01T20:00:00",
    "updateddOn": "2023-01-01T20:00:00"
}
```

  
  

### Get a specific user
`GET /users/me` to get the current user
`GET /users/:id` to get a specific user (must be an admin)

#### Response

```json
{
    "id": "abc-123",
    "phone": "+13133076785",
    "firstName": "Tina",
    "lastName": "Belchor",
    "groups": ["motorist"],
    "createdOn": "2023-01-01T20:00:00",
    "updateddOn": "2023-01-01T20:00:00"
}
```


## Other supporting documentation
See the [Shared Type Definitions](../../libs/shared-types/api.d.ts) for TS types related to this service.