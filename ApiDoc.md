# Thetasofts Inbox Server - API Documentation

Backend service providing endpoints for managing contact form submissions and newsletter subscribers.

---

## Base URL

```text
http://localhost:4000
```
*(Port is configurable via `PORT` in `.env`, defaults to `3000`)*

---

## Authentication

All endpoints are protected by authentication middleware. Every request must include the authentication token configured in `AUTH_TOKEN`.

### Supported Headers

| Header | Format | Example |
|---|---|---|
| `Authorization` | `Bearer <AUTH_TOKEN>` or `<AUTH_TOKEN>` | `Bearer myauthtoken` |
| `x-auth-token` | `<AUTH_TOKEN>` | `myauthtoken` |

### Authentication Errors

- **`401 Unauthorized`** (Token missing):
  ```json
  {
    "message": "Access denied. No token provided."
  }
  ```

- **`403 Forbidden`** (Token mismatch):
  ```json
  {
    "message": "Invalid token."
  }
  ```

---

## Endpoints Quick Reference

| Method (Req Type) | Route | Payload / Body | Description |
|---|---|---|---|
| `GET` | `/contacts` | None | Get all contact inquiries |
| `GET` | `/contacts/unread` | None | Get all unread contact inquiries (`isRead: false`) |
| `GET` | `/contacts/read` | None | Get all read contact inquiries (`isRead: true`) |
| `PATCH` | `/contacts/:id/read` | None | Mark a contact inquiry as read |
| `PATCH` | `/contacts/:id/replyed` | None | Mark a contact inquiry as replied |
| `DELETE` | `/contacts/:id` | None | Delete a contact inquiry by ID |
| `GET` | `/subscribers` | None | Get all newsletter subscribers |
| `DELETE` | `/subscribers/:id` | None | Delete a subscriber by ID or email |

---

## Contact Endpoints

### 1. Get All Contacts

Retrieve a list of all contact form submissions.

- **Route:** `/contacts`
- **Request Type:** `GET`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  [
    {
      "_id": "67066914a1c6a2b34e8f1122",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "plan": "Enterprise",
      "projectType": "Web Development",
      "message": "Looking forward to working together.",
      "isRead": false,
      "isReplyed": false,
      "createdAt": "2026-10-09T09:15:00.000Z",
      "updatedAt": "2026-10-09T09:15:00.000Z"
    }
  ]
  ```

- **Error Response:** `500 Internal Server Error`
  ```json
  {
    "message": "Server error"
  }
  ```

---

### 2. Get Unread Contacts

Retrieve all contacts where `isRead` is `false`.

- **Route:** `/contacts/unread`
- **Request Type:** `GET`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  [
    {
      "_id": "67066914a1c6a2b34e8f1122",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "plan": "Enterprise",
      "projectType": "Web Development",
      "message": "Looking forward to working together.",
      "isRead": false,
      "isReplyed": false,
      "createdAt": "2026-10-09T09:15:00.000Z",
      "updatedAt": "2026-10-09T09:15:00.000Z"
    }
  ]
  ```

---

### 3. Get Read Contacts

Retrieve all contacts where `isRead` is `true`.

- **Route:** `/contacts/read`
- **Request Type:** `GET`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  [
    {
      "_id": "67066914a1c6a2b34e8f1122",
      "fullName": "John Smith",
      "email": "john@example.com",
      "phone": "+1987654321",
      "plan": "Startup",
      "projectType": "Mobile App",
      "message": "Need a consultation.",
      "isRead": true,
      "isReplyed": false,
      "createdAt": "2026-10-08T12:00:00.000Z",
      "updatedAt": "2026-10-09T08:30:00.000Z"
    }
  ]
  ```

---

### 4. Mark Contact as Read

Sets `isRead: true` for the specified contact.

- **Route:** `/contacts/:id/read`
- **Request Type:** `PATCH`
- **URL Parameters:**
  - `id` *(string, required)*: MongoDB ObjectId of the contact (e.g. `67066914a1c6a2b34e8f1122`)
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None (updates directly on the server)

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "67066914a1c6a2b34e8f1122",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "plan": "Enterprise",
    "projectType": "Web Development",
    "message": "Looking forward to working together.",
    "isRead": true,
    "isReplyed": false,
    "createdAt": "2026-10-09T09:15:00.000Z",
    "updatedAt": "2026-10-09T09:20:00.000Z"
  }
  ```

- **Error Responses:**
  - `404 Not Found`:
    ```json
    {
      "message": "Contact not found"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Server error"
    }
    ```

---

### 5. Mark Contact as Replied

Sets `isReplyed: true` for the specified contact.

- **Route:** `/contacts/:id/replyed`
- **Request Type:** `PATCH`
- **URL Parameters:**
  - `id` *(string, required)*: MongoDB ObjectId of the contact (e.g. `67066914a1c6a2b34e8f1122`)
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None (updates directly on the server)

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "67066914a1c6a2b34e8f1122",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "plan": "Enterprise",
    "projectType": "Web Development",
    "message": "Looking forward to working together.",
    "isRead": true,
    "isReplyed": true,
    "createdAt": "2026-10-09T09:15:00.000Z",
    "updatedAt": "2026-10-09T09:25:00.000Z"
  }
  ```

- **Error Responses:**
  - `404 Not Found`:
    ```json
    {
      "message": "Contact not found"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Server error"
    }
    ```

---

### 6. Delete Contact

Delete a contact form inquiry by its MongoDB `_id`.

- **Route:** `/contacts/:id`
- **Request Type:** `DELETE`
- **URL Parameters:**
  - `id` *(string, required)*: MongoDB ObjectId of the contact (e.g. `67066914a1c6a2b34e8f1122`)
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Contact deleted successfully",
    "contact": {
      "_id": "67066914a1c6a2b34e8f1122",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "plan": "Enterprise",
      "projectType": "Web Development",
      "message": "Looking forward to working together.",
      "isRead": true,
      "isReplyed": true,
      "createdAt": "2026-10-09T09:15:00.000Z",
      "updatedAt": "2026-10-09T09:25:00.000Z"
    }
  }
  ```

- **Error Responses:**
  - `404 Not Found`:
    ```json
    {
      "message": "Contact not found"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Server error"
    }
    ```

---

## Subscriber Endpoints

### 7. Get All Subscribers

Retrieve a list of all newsletter / email subscribers.

- **Route:** `/subscribers`
- **Request Type:** `GET`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  [
    {
      "_id": "670671a9a1c6a2b34e8f3344",
      "email": "subscriber@example.com",
      "subscribedAt": "2026-10-09T09:30:00.000Z",
      "isActive": true,
      "createdAt": "2026-10-09T09:30:00.000Z",
      "updatedAt": "2026-10-09T09:30:00.000Z"
    }
  ]
  ```

- **Error Response:** `500 Internal Server Error`
  ```json
  {
    "message": "Server error"
  }
  ```

---

### 8. Delete Subscriber

Delete a newsletter subscriber by their MongoDB `_id` or email address.

- **Route:** `/subscribers/:id`
- **Request Type:** `DELETE`
- **URL Parameters:**
  - `id` *(string, required)*: MongoDB ObjectId (e.g. `670671a9a1c6a2b34e8f3344`) or subscriber email address (e.g. `subscriber@example.com`)
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **Payload / Body:** None

#### Response

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Subscriber deleted successfully",
    "subscriber": {
      "_id": "670671a9a1c6a2b34e8f3344",
      "email": "subscriber@example.com",
      "subscribedAt": "2026-10-09T09:30:00.000Z",
      "isActive": true,
      "createdAt": "2026-10-09T09:30:00.000Z",
      "updatedAt": "2026-10-09T09:30:00.000Z"
    }
  }
  ```

- **Error Responses:**
  - `404 Not Found`:
    ```json
    {
      "message": "Subscriber not found"
    }
    ```
  - `500 Internal Server Error`:
    ```json
    {
      "message": "Server error"
    }
    ```

---

## Data Models Reference

### Contact Schema (`Contact`)

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `fullName` | `String` | Yes | - | Sender's full name |
| `email` | `String` | Yes | - | Sender's email address |
| `phone` | `String` | No | - | Contact phone number |
| `plan` | `String` | No | - | Selected service or pricing plan |
| `projectType` | `String` | No | - | Type of project requested |
| `message` | `String` | No | - | Inquiry or feedback message |
| `isRead` | `Boolean` | No | `false` | Whether inquiry has been read |
| `isReplyed` | `Boolean` | No | `false` | Whether inquiry has been replied to |
| `createdAt` | `Date` | Auto | - | Timestamp of creation |
| `updatedAt` | `Date` | Auto | - | Timestamp of last modification |

### Subscriber Schema (`Subscriber`)

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `email` | `String` | Yes (Unique) | - | Subscriber's email address |
| `subscribedAt`| `Date` | No | `Date.now`| Subscription timestamp |
| `isActive` | `Boolean` | No | `true` | Active subscription flag |
| `createdAt` | `Date` | Auto | - | Timestamp of creation |
| `updatedAt` | `Date` | Auto | - | Timestamp of last modification |
