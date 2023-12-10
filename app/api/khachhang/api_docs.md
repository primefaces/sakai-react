- [khachhang](#khachhang)
  - [GET /api/khachhang?offset=10\&limit=10](#get-apikhachhangoffset10limit10)
  - [GET /api/khachhang/:id](#get-apikhachhangid)
  - [POST /api/khachhang](#post-apikhachhang)
  - [DELETE /api/khachhang/:id](#delete-apikhachhangid)
  - [PUT /api/khachhang/:id](#put-apikhachhangid)
  - [PATCH /api/khachhang/:id](#patch-apikhachhangid)


# khachhang
## GET /api/khachhang?offset=10&limit=10

Retrieves employee data from the database.

**Query Parameters**

- **offset** (optional) - Offset for pagination (default is 0)
- **limit** (optional) - Number of records per page (default is 20)

**Response**

- 500 Internal Server Error: When database query fails
- 200 OK: No error
- Returns JSON object with:
  - count (number): Total number of employee records
  - next (string|null): Next page URL (null if no more pages)
  - previous (string|null): Previous page URL (null if no previous page)
  - results (array): Array of employee objects sorted by IDKhachHang

**Example**

```json
GET /api/khachhang?offset=0&limit=2

{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
    {
        "IDKhachHang": 1,
        "Ho_ten": "John Doe",
        // etc
    },
    {
        "IDKhachHang": 2,
        "Ho_ten": "Jane Doe",
        // etc
    }
    ]
}
```

---

## GET /api/khachhang/:id

Retrieves a specific employee record by ID.

**Path Parameters**

- **id** (required): Employee ID to fetch

**Response**

- 200 OK: Returns requested employee object
- 400 Bad Request: If invalid ID is passed
- 500 Internal Server Error: If database query fails

**JSON contains**

- count (number): Number of results (1 for single object)
- results (object): Employee data

```json
GET /api/khachhang/10001

{
  "count": 1,
  "results": {
    "IDKhachHang": 10001,
    "Ho_ten": "John Doe",
    // etc
  }
}
```
---
## POST /api/khachhang

Create a new employee record in the database.

**Request Body**
- Employee object containing all fields
- **"IDKhachHang"**: Employee ID is **required**
- Request body must have more than one field. 
```json
{
  "body": 
  {
    "IDKhachHang": 10001,
    "HoTen": "John Doe",
    "SDT": "0123456789",
    "Email": "demo@gmail.com",
    "CCCD": "123456789",
    "DiaChiThuongTru": "",
    "DiaChiTamTru": "",
    "TenCongTy": "",
    "DiaChiCongTy": ""
  }
  
}
```

**Response**
- 200 Created: When new employee record is inserted
- 400 Bad Request: If invalid data is passed
- 500 Internal Server Error: If insert query fails
---

## DELETE /api/khachhang/:id

Deletes an employee record from the database.

**Query Parameters**

- **id** (required): Employee ID to delete

**Response**

- 200 OK: When employee record is deleted successfully
  - Returns JSON object:
    - message: 'Record deleted successfully'
- 400 Bad Request: When ma_nv is invalid or missing
- 500 Internal Server Error: When delete query fails

**Example**

```json
DELETE /api/khachhang/10001

{
  "message": "Record deleted successfully"
}
Return status 200
```
---
## PUT /api/khachhang/:id
Update an employee record by ID with new data.

**Path Parameters**
- **id** (required): Employee ID to update

**Request Body**
- JSON object containing fields to update. It's somewhat like this:
  ```json
  {
    "body": 
    {
      "HoTen": "", 
      "SDT": "", 
      "CCCD": "", 
      "Email": "",
      "DiaChiThuongTru": "",
      "DiaChiTamTru": "",
      "TenCongTy": "",
      "DiaChiCongTy": ""
    }
  }
  ```
Example:
```json
PUT /api/khachhang/10001

{
    "body": 
    {
        "HoTen": "Jane Doe",
        "SDT": "01234567",
        "CCCD": "123456789",
        // etc
    }
}

Returns 200 OK and message: "Updated" on success
```

---
## PATCH /api/khachhang/:id

Update an employee record by ID with one new data.

**Path Parameters**
- **id** (required): Employee ID to update

**Request Body**
- JSON object containing fields to update. It's somewhat like this:
  ```json
  {
    "body": 
    {
      "HoTen": "", 
      "SDT": "", 
      "CCCD": "", 
      "ChucDanh": "", 
      "PhongBan": ""
    }
  }
  ```

>**Note:** **PATCH** will be used when you need to update one value. If you need to update more than one, consider using **PUT**.
