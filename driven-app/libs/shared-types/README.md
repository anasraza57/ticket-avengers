# Shared TS Types

This library contains all the types that are shared between the different apps (UI and API) as a way to make sure that consumers and producers are always in sync.



## How to use this library

You can use this lib by importing `@drive-app/shared-types/<path-to-type>`.  
Below is an example of how to use the types in the `api` types.

```ts
import { RestApi } from '@drive-app/shared-types/api';

const payload: RestApi.User.LoginRequest = {
    email: '',
    phone: '',
    password: ''
}
const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
}); 

const loginResult: RestApi.User.LoginResponse = await response.json();
```




