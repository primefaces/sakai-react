# nhanvien

## GET /api/nhanvien

Retrieves employee data from the database.

**Query Parameters**

- **queryAll** (required): Set to true to return all employee records or false to not run any queries.

**Response**

- 200 OK: When queryAll=false
- 400 Bad Request: When queryAll is invalid
- 500 Internal Server Error: When database query fails
- 200 OK: When queryAll=true
  - Returns JSON object with:
    - count (number): Total number of employee records
    - next (string|null): Next page URL (null if no more pages)
    - previous (string|null): Previous page URL (null if no previous page)
    - results (array): Array of employee objects sorted by MaNhanVien

**Example**

```json
GET /api/nhanvien?queryAll=true

{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
    {
        "MaNhanVien": 1,
        "TenNhanVien": "John Doe",
    },
    {
        "MaNhanVien": 2,
        "TenNhanVien": "Jane Doe",

    }
    ]
}
```

This endpoint allows retrieving paginated employee data from the database by specifying queryAll=true. Results are sorted by employee id and metadata like total count, next/previous page is included.

---

## PATCH /api/nhanvien

Updates an employee record in the database.

**Query Parameters**

- **ma_nv** (required): Employee ID to update

**Body**

Pass an object with the employee fields to update

**Response**

- 204 No Content: When employee record is updated successfully
- 400 Bad Request: When invalid parameters are passed
- 500 Internal Server Error: When update query fails

**Example**

```json
PATCH /api/nhanvien?ma_nv=10001

{
  "TenNhanVien": "Jane Doe",
  "ChucVu": "Manager"
}
```

This endpoint allows updating an employee record by passing the employee ID in the query parameter ma_nv and an object containing the fields to update in the request body.

It validates:

- At least ma_nv is provided
- ma_nv is a valid integer
- Request body contains fields to update

If validation passes, it runs an update query and returns 204 No Content on success.

---

## POST /api/nhanvien

Method not allowed. Use to create new employee records.

**Response**
405 Method Not Allowed

**JSON object**:

- error: 'Method Not Allowed'
- message: 'The requested method is not allowed for the resource.'

This endpoint returns a 405 status code to indicate the POST method is not supported for creating new employee records. The /api/nhanvien resource only supports GET and PATCH methods.

To add new employees, a different endpoint should be used that properly handles validation, required parameters, etc.

---

## PUT /api/nhanvien

Creates a new employee record in the database.

**Query Parameters**

- **ma_nv** (required): Employee ID to create

**Body**
Pass employee object with required fields to insert

**Response**

- 201 Created: When new employee record is inserted successfully
- 400 Bad Request: When invalid parameters are passed
- 500 Internal Server Error: When insert query fails

**Example**

```json
PUT api/nhanvien?ma_nv=20001&ten_nv=Pham Van Bang&sdt=1234567890&role=Staff

{
  "status": 201,
  "statusText": "Created"
}
```

---

## DELETE /api/nhanvien

Deletes an employee record from the database.

**Query Parameters**

- **ma_nv** (required): Employee ID to delete

**Response**

- 200 OK: When employee record is deleted successfully
  - Returns JSON object:
    - message: 'Record deleted successfully'
- 400 Bad Request: When ma_nv is invalid or missing
- 500 Internal Server Error: When delete query fails

**Example**

```json
DELETE /api/nhanvien?ma_nv=10001

{
  "message": "Record deleted successfully"
}
```

This endpoint allows deleting an employee record by passing the employee ID in the query parameter ma_nv.

It validates:

- ma_nv is provided
- ma_nv is a valid integer

If valid, it runs a delete query and returns 200 OK on success.
