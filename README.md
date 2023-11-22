# Installation

```bash
cd umanu_qr
npm i
```

# Enviroment variables

* **PORT** - port for listening
* **DB_URI** - Postgres connection string
* **QR_BASE_URL** - base service URL for links creation
* **SECRET** - secret key for QR encription/decription

# Running developer mode

```bash
npm run dev
```

## Generating QR-codes

Method: POST

URL: /generate

This endpoint accepts JSON in the body of a POST request with specific fields and generates a QR code based on the provided data. It returns a link to a web page containing the generated QR code.

Example request:

```json
{
    "phone": "+77071234567",
    "locks": ["94a2e513-68a5-49ca-88b5-991276fcce41"],
    "valid_from": 1700653032,
    "valid_to": 1700739430
}
```

Request Fields:

* **phone** (string): The phone number for which the QR code is generated.
* **locks** (array of strings): An array of strings representing UMANU controllers identificators.
* **valid_from** (integer): The starting time of QR code validity in Unix timestamp format.
* **valid_to** (integer): The expiration time of QR code validity in Unix timestamp format.

Example Response on Success:

```json
{
    "success": true,
    "link": "http://192.168.76.71:3000/ae3fd5ac-c1c4-4efc-a990-31605c801c72"
}
```

Response Fields:

* **success** (boolean): Indicates the success of the operation. A value of true denotes successful QR code generation.
* **link** (string): The link to the web page containing the generated QR code. Users can use this link to obtain the QR code.