# Identity Reconciliation

Identity Reconciliation is a process of resolving different customer records to create a single view of each customer.

We are considering **`email`** and **`phoneNumber`** to identify the customer and do reconciliation on them.

### Technology Used

---

-   Database : poostgresql
-   Backend : Node.js,Express.js
-   ORM: Sequalize

---

## How to run the Application

To run the code please clone the repository and move to identity_reconciliation and install the necessary node_modules

```
cd identity_reconciliation
npm i
```

---

# Set up Database

create .env file and add the necessary data relate to local postgres database.

```
NODE_ENV=development
DB_USERNAME1=${your database username}
DB_PASSWORD1=${Your database password}
DB_DATABASE1=${Your database name}
DB_HOST1=${Your database host name}
DB_PORT1=${Your database port number}
PORT=3000

```

### To create Table in DataBase

```
npm run identity:migrate
```

### To run the application

```
npm run dev
```

### Api and payload to be used for identity

API:

```
http://localhost:3000/identify
```

Production APi:

```
https://identity-reconciliation-q3sx.onrender.com/identify
```

PAYLOAD:

```
{
    "email": "aman@gmail.com",
    "phoneNumber": "123456"
}
```

## Use Cases

### Case 1:

When we send a data with no records in databse , then we will create a new data.

#### Input:

```
{
    "email": "aman@gmail.com",
    "phone" : "12345"
}
```

### Output:

```
{
    "contact": {
        "primaryContatctId": 1,
        "emails": [
            "a@gmail.com"
        ],
        "phoneNumbers": [
            "12345"
        ],
        "secondaryContactIds": []
    }
}

```

### Case 2:

If a customer placed an order with
email=lorraine@hillvalley.edu & phoneNumber=123456
and later came back to place another order with
email=mcfly@hillvalley.edu & phoneNumber=123456 ,
database will have the following rows:

## Database:

```
{
	id                   1
  phoneNumber          "123456"
  email                "lorraine@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-01 00:00:00.374+00
  updatedAt            2023-04-01 00:00:00.374+00
  deletedAt            null
},
{
	id                   23
  phoneNumber          "123456"
  email                "mcfly@hillvalley.edu"
  linkedId             1
  linkPrecedence       "secondary"
  createdAt            2023-04-20 05:30:00.11+00
  updatedAt            2023-04-20 05:30:00.11+00
  deletedAt            null
}
```

## Request:

```
{
	"email": "mcfly@hillvalley.edu",
	"phoneNumber": "123456"
}
```

## Response:

```
{
		"contact":{
			"primaryContatctId": 1,
			"emails": ["lorraine@hillvalley.edu","mcfly@hillvalley.edu"]
			"phoneNumbers": ["123456"]
			"secondaryContactIds": [23,24]
		}
}

```

Case 3:

When we have Two different primary linkPrecedence and we request for data with email of first data and phoneNumber of second data then we get the data we change the second primary to secondary.

## Databases:

```
{
	id                   11
  phoneNumber          "919191"
  email                "george@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-11 00:00:00.374+00
  updatedAt            2023-04-11 00:00:00.374+00
  deletedAt            null
},
{
	id                   27
  phoneNumber          "717171"
  email                "biffsucks@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-21 05:30:00.11+00
  updatedAt            2023-04-21 05:30:00.11+00
  deletedAt            null
}
```

## Request:

```
{
"email":"george@hillvalley.edu",
"phoneNumber": "717171"
}

```

## Response:

```
{
		"contact":{
			"primaryContatctId": 11,
			"emails": ["george@hillvalley.edu","biffsucks@hillvalley.edu"]
			"phoneNumbers": ["919191","717171"]
			"secondaryContactIds": [27,28]
		}
	}
```

> **_NOTE_**: Apart from the above use cases the code also handles the multiple cases of merging and matching the data in different levels(Tertiary)
