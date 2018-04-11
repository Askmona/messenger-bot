# User

## Properties

### id
User's unique ID  
**Type:** Int

### first_name
User's first name  
**Type:** String

### last_name
User's last name  
**Type:** String

### profile_pic
User's profile picture  
**Type:** String

### locale
User's language  
**Type:** String

### timezone
UTC +timezone  
**Type:** Int

### gender
User's gender  
**Type:** String

## Methods

### fullname
Returns first_name + last_name with a white space between

### update
Update the user's informations in the database

### send
Sends a message

| Parameter                      | Type              | Description          |
|:-------------------------------|:------------------|:---------------------|
| value                          | String, Number, Object | Any value       |
| options / callback             | Object / Function | Optional             |
| callback                       | Function          | Optional             |