
# Feature: Prepare payment details

## 1. User goal
Pet Owners need to view their selected pet service and its price before making a payment.

## 2. Scope
Included:
- Allow pet owners to retrieve payment details for a selected pet service.
- Use mock service data and prices stored on the server.
- Return the service details in JSON format.
- Return an error if the service does not exist.
- No login is required for this classroom endpoint.

Not included:
- Charging real money.
- Connecting to a real payment gateway.
- Creating new database tables.
- Creating new EJS pages.

## 3. Request
- HTTP method: GET
- URL: /payments/prepare/:serviceId
- Input: serviceId from the URL route parameter.
- The system uses this value to look up the selected service from the server-side catalogue.

## 4. Service catalogue
| Service ID | Service Name | Price (SGD) |
|------------|--------------|-------------|
| 1 | Vaccination | 35 |
| 2 | Pet Grooming | 50 |
| 3 | Boarding | 80 |

- Service IDs and prices are numbers.
- Service names are strings.
- The server uses the catalogue price.
- Only the serviceId is accepted as input for this endpoint.
- The system must not accept a payment amount supplied by the client.

## 5. Successful response
- HTTP status: 200
- Response format: JSON
- The response must contain exactly five fields and no additional properties:
  - serviceId: number
  - serviceName: string
  - amount: number
  - currency: string, value "sgd"
  - status: string, value "READY_FOR_PAYMENT"

Example for service ID 1:

{
  "serviceId": 1,
  "serviceName": "Vaccination",
  "amount": 35,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}

## 6. Unsuccessful response
- If the requested service does not exist, return HTTP 404.
- Return this JSON response:

{
  "error": "Service not found"
}


## 7. Acceptance criteria


AC1	Service 1 returns Vaccination, S$35
AC2	Service 2 returns Pet Grooming, S$50
AC3	Service 3 returns Boarding, S$80
AC4	Service 999 returns HTTP 404
AC5	Successful JSON has exactly five fields with the correct types and values


## 8. Open questions
- Should the system return HTTP 400 for malformed service IDs, such as "abc"?
- No additional requirements will be implemented until they are clarified and approved.
