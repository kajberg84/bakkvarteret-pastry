# :cake: Yummy pastries api

## Features

------

This package provides tools for:

* Create, update user
* Adding/removing friends
* Adding favorite pastry
* Upload and store pastry
* Filter for user and pastry service
* Pagination for user and pastry service
* Selection for user and pastry service
* Webhook for subsription on image upload
* JWT security with assymetric key
* Error and exception handling

--------

## :cookie: Usage

1. Create account(Model below)
2. Login account.
3. Upload images with information(Model below)
4. View, update, delete images

--------

Examples

    Filter:
    https://bakkvarteret-user.herokuapp.com/user?lastname=Berg

    Pagination:  
    https://bakkvarteret-user.herokuapp.com/user?skip=1&limit=3>

    Select: 
    https://bakkvarteret-user.herokuapp.com/user?fields=(firstname, lastname)

    All these can combine anyway you like in both user or pastry service
    https://bakkvarteret-user.herokuapp.com/user?firstname=tjur&lastname=Berg&skip=1&limit=2?fields=(firstname)
------

## :doughnut: Webhook

How to subsribe to webhook:

1. Login
2. Add to body(Model for webhook, see below)
3. Post to: <https://bakkvarteret-pastry.herokuapp.com/api/webhook/create>  
4. Information about posted pastry will get sent to given url.

    Right now there are one event you can register too.
    "newPastry" that will send the body of a created pastry to given callbackurl(see model below).

----

## Test Api

1. The api are deployed on heroku.
2. Import "Pastry-api.postman-collection.json"
3. Login using email: kossa@kossa.com // password: kossakossa (Should be preset values)
4. This will generate JWT that will be added as a global collection variable
5. Now all is ready to try out the api collection

----

## :ice_cream: Models for post

## User model

    firstname: string
    lastname: string
    password: string
    email: string
    avatar?: string

## Pastry model

    description?: string
    rating: number
    category: string
    store: string
    name: string
    pictures: pictureUrl

## Hook model

    event: string
    callbackUrl: string
    secret: string    

## Author

Kaj Berg, kb223aw@student.lnu.se
