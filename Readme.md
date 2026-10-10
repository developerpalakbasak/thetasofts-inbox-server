# Thetasofts Inbox API — Frontend Integration Guide

Welcome to the **Thetasofts Inbox API** documentation. This service powers the administrative inbox dashboard for managing client contact inquiries and newsletter subscribers.

This guide provides frontend developers with complete route specifications, authentication requirements, request/response schemas, TypeScript types, and ready-to-use API integration snippets.

---

## Table of Contents
1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [API Route Summary](#api-route-summary)
4. [Detailed Route Specifications](#detailed-route-specifications)
   - [1. Get All Contacts](#1-get-all-contacts)
   - [2. Get Unread Contacts](#2-get-unread-contacts)
   - [3. Get Read Contacts](#3-get-read-contacts)
   - [4. Mark Contact as Read](#4-mark-contact-as-read)
   - [5. Mark Contact as Replied](#5-mark-contact-as-replied)
   - [6. Delete Contact](#6-delete-contact)
   - [7. Get All Subscribers](#7-get-all-subscribers)
   - [8. Delete Subscriber](#8-delete-subscriber)
5. [TypeScript Interfaces & Data Models](#typescript-interfaces--data-models)
6. [Frontend Integration Example (Axios / Fetch)](#frontend-integration-example)
7. [Error Handling & HTTP Status Codes](#error-handling--http-status-codes)
8. [Running the Backend Locally](#running-the-backend-locally)

---

## Base Configuration

- **Base URL (Local Development):** `http://localhost:3000` *(or `http://localhost:4000` if configured via `.env`)*
- **CORS:** Enabled for all incoming origins (`cors()`).
- **Content-Type:** `application/json`

---

## Authentication

Every endpoint in this service is protected by authentication middleware. Frontend clients **must** send the secret token defined in the backend `.env` (`AUTH_TOKEN`).

### Supported Request Headers
You can supply the token using either standard `Authorization` or `x-auth-token`:

| Header Name | Format | Example |
|---|---|---|
| `Authorization` | `Bearer <AUTH_TOKEN>` or `<AUTH_TOKEN>` | `Authorization: Bearer myauthtoken` |
| `x-auth-token` | `<AUTH_TOKEN>` | `x-auth-token: myauthtoken` |

> ⚠️ **Important:** In your frontend app, store this token in an environment variable (e.g., `NEXT_PUBLIC_API_AUTH_TOKEN` or `VITE_API_AUTH_TOKEN`).

---

## API Route Summary

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/contacts` | None | Fetch all contact form submissions |
| `GET` | `/contacts/unread` | None | Fetch only unread contact inquiries (`isRead === false`) |
| `GET` | `/contacts/read` | None | Fetch only read contact inquiries (`isRead === true`) |
| `PATCH` | `/contacts/:id/read` | None | Mark a contact inquiry as read (`isRead: true`) |
| `PATCH` | `/contacts/:id/replyed` | None | Mark a contact inquiry as replied (`isReplyed: true`) |
| `DELETE` | `/contacts/:id` | None | Delete a contact inquiry by ID |
| `GET` | `/subscribers` | None | Fetch all newsletter subscribers |
| `DELETE` | `/subscribers/:id` | None | Delete a subscriber by ID or email |

---

## Detailed Route Specifications

### 1. Get All Contacts
Fetches the entire list of contact submissions stored in the database.

- **Method:** `GET`
- **Route:** `/contacts`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL / Query Params:** None
- **Request Body:** None

#### Response: `200 OK`
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

### 2. Get Unread Contacts
Fetches only contact inquiries where `isRead` is `false`. Useful for the primary inbox list and unread badge counters.

- **Method:** `GET`
- **Route:** `/contacts/unread`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL / Query Params:** None
- **Request Body:** None

#### Response: `200 OK`
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
Fetches contact inquiries where `isRead` is `true`. Useful for archived or previously reviewed inquiries.

- **Method:** `GET`
- **Route:** `/contacts/read`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL / Query Params:** None
- **Request Body:** None

#### Response: `200 OK`
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
Updates a contact's status to read (`isRead: true`).

- **Method:** `PATCH`
- **Route:** `/contacts/:id/read`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL Parameters:**
  - `id` *(string, required)*: The 24-character MongoDB `_id` of the contact.
- **Request Body:** None *(The server sets `isRead: true` directly without requiring a payload)*

#### Response: `200 OK`
Returns the updated contact object:
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

#### Error Responses
- `404 Not Found`:
  ```json
  { "message": "Contact not found" }
  ```

---

### 5. Mark Contact as Replied
Updates a contact's status to replied (`isReplyed: true`).

> 💡 **Notice Schema Spelling:** Note that the backend database property and endpoint use the exact spelling `isReplyed` (with an `e`), not `isReplied`.

- **Method:** `PATCH`
- **Route:** `/contacts/:id/replyed`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL Parameters:**
  - `id` *(string, required)*: The 24-character MongoDB `_id` of the contact.
- **Request Body:** None *(The server sets `isReplyed: true` directly without requiring a payload)*

#### Response: `200 OK`
Returns the updated contact object:
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

#### Error Responses
- `404 Not Found`:
  ```json
  { "message": "Contact not found" }
  ```

---

### 6. Delete Contact
Deletes a specific contact inquiry by its unique identifier.

- **Method:** `DELETE`
- **Route:** `/contacts/:id`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL Parameters:**
  - `id` *(string, required)*: The 24-character MongoDB `_id` of the contact.
- **Request Body:** None

#### Response: `200 OK`
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

#### Error Responses
- `404 Not Found`:
  ```json
  { "message": "Contact not found" }
  ```
- `500 Internal Server Error`:
  ```json
  { "message": "Server error" }
  ```

---

### 7. Get All Subscribers
Fetches the list of all registered email subscribers.

- **Method:** `GET`
- **Route:** `/subscribers`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL / Query Params:** None
- **Request Body:** None

#### Response: `200 OK`
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

---

### 8. Delete Subscriber
Deletes a subscriber by their MongoDB `_id` or email address.

- **Method:** `DELETE`
- **Route:** `/subscribers/:id`
- **Headers:**
  - `Authorization: Bearer <AUTH_TOKEN>`
- **URL Parameters:**
  - `id` *(string, required)*: MongoDB ObjectId or email address of the subscriber.
- **Request Body:** None

#### Response: `200 OK`
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

#### Error Responses
- `404 Not Found`:
  ```json
  { "message": "Subscriber not found" }
  ```
- `500 Internal Server Error`:
  ```json
  { "message": "Server error" }
  ```

---

## TypeScript Interfaces & Data Models

Frontend developers can copy and paste these types directly into their codebase (e.g., `src/types/api.ts`):

```typescript
export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  plan?: string;
  projectType?: string;
  message?: string;
  isRead: boolean;
  isReplyed: boolean; // Note backend spelling: 'isReplyed'
  createdAt: string;  // ISO 8601 Date String
  updatedAt: string;  // ISO 8601 Date String
}

export interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string; // ISO 8601 Date String
  isActive: boolean;
  createdAt: string;    // ISO 8601 Date String
  updatedAt: string;    // ISO 8601 Date String
}

export interface ApiErrorResponse {
  message: string;
}

export interface DeleteContactResponse {
  message: string;
  contact: Contact;
}

export interface DeleteSubscriberResponse {
  message: string;
  subscriber: Subscriber;
}
```

---

## Frontend Integration Example

Here is a recommended API client setup using `axios` or native `fetch` that you can drop into your frontend project.

### Option A: Using Axios (`src/services/api.ts`)

```typescript
import axios from 'axios';
import { Contact, Subscriber, DeleteContactResponse, DeleteSubscriberResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});

export const inboxApi = {
  // Contacts
  getAllContacts: async (): Promise<Contact[]> => {
    const { data } = await apiClient.get<Contact[]>('/contacts');
    return data;
  },

  getUnreadContacts: async (): Promise<Contact[]> => {
    const { data } = await apiClient.get<Contact[]>('/contacts/unread');
    return data;
  },

  getReadContacts: async (): Promise<Contact[]> => {
    const { data } = await apiClient.get<Contact[]>('/contacts/read');
    return data;
  },

  markContactAsRead: async (id: string): Promise<Contact> => {
    const { data } = await apiClient.patch<Contact>(`/contacts/${id}/read`);
    return data;
  },

  markContactAsReplied: async (id: string): Promise<Contact> => {
    const { data } = await apiClient.patch<Contact>(`/contacts/${id}/replyed`);
    return data;
  },

  deleteContact: async (id: string): Promise<DeleteContactResponse> => {
    const { data } = await apiClient.delete<DeleteContactResponse>(`/contacts/${id}`);
    return data;
  },

  // Subscribers
  getAllSubscribers: async (): Promise<Subscriber[]> => {
    const { data } = await apiClient.get<Subscriber[]>('/subscribers');
    return data;
  },

  deleteSubscriber: async (idOrEmail: string): Promise<DeleteSubscriberResponse> => {
    const { data } = await apiClient.delete<DeleteSubscriberResponse>(`/subscribers/${idOrEmail}`);
    return data;
  }
};
```

### Option B: Using Native Fetch

```typescript
import { Contact, Subscriber, DeleteContactResponse, DeleteSubscriberResponse } from '../types/api';

const BASE_URL = 'http://localhost:3000';
const AUTH_TOKEN = 'your-secret-token';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const inboxApi = {
  getAllContacts: () => request<Contact[]>('/contacts'),
  getUnreadContacts: () => request<Contact[]>('/contacts/unread'),
  getReadContacts: () => request<Contact[]>('/contacts/read'),
  markContactAsRead: (id: string) => request<Contact>(`/contacts/${id}/read`, { method: 'PATCH' }),
  markContactAsReplied: (id: string) => request<Contact>(`/contacts/${id}/replyed`, { method: 'PATCH' }),
  deleteContact: (id: string) => request<DeleteContactResponse>(`/contacts/${id}`, { method: 'DELETE' }),
  getAllSubscribers: () => request<Subscriber[]>('/subscribers'),
  deleteSubscriber: (idOrEmail: string) => request<DeleteSubscriberResponse>(`/subscribers/${idOrEmail}`, { method: 'DELETE' }),
};
```

---

## Error Handling & HTTP Status Codes

All error responses return a JSON object with a `message` property:

```json
{
  "message": "Description of the error"
}
```

| Status Code | Meaning | Cause | Frontend Action |
|---|---|---|---|
| `200 OK` | Success | Request succeeded. | Render the retrieved or updated data. |
| `401 Unauthorized` | Missing Token | No `Authorization` or `x-auth-token` header provided. | Verify token is configured in frontend environment variables. |
| `403 Forbidden` | Invalid Token | Token provided does not match backend `AUTH_TOKEN`. | Prompt developer to sync token with backend `.env`. |
| `404 Not Found` | Resource Missing | Contact ID does not exist in the database. | Display notification (e.g. "Item not found") and refresh list. |
| `500 Server Error` | Database/Server Issue | MongoDB connection issue or unexpected server exception. | Display generic toast: "Server error, please try again later". |

---

## Running the Backend Locally

If you need to run this backend API alongside your frontend:

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `env.sample`):
   ```env
   PORT=3000
   AUTH_TOKEN=myauthtoken
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/inbox
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000` (or your configured port).
