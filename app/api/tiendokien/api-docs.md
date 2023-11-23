**/api/tiendokien**

**GET**
Get all data from TienDoKien_ThiHanhAn table.

**Example Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "ID": 1,
      "IDKhachHang": 10001,
      "SoTienKK": 1000000,
      "TrangThaiKK": "Đã ký",
      "TrangThaiTHA": "Đang thực hiện",
      "TrangThaiAP" : "Chưa phê duyệt",
      "Tinh_TP": "Hà Nội",
      "Quan_Huyen": "Quận Ba Đình",
      "id_to_trinh_dgkk": "1234",
      "ngay_tao_khoi_kien": "22/11/2023"
    },
    // more results
  ] 
}
```

**POST**
Create a new record in TienDoKien_ThiHanhAn table.

**Example Request:**

```json
POST /api/tiendokien
Content-Type: application/json

{
"body": {
  "IDKhachHang": "KH002", 
  "SoTienKK": 1500000,
  "TrangThaiKK": "Đã ký", 
  "TrangThaiTHA": "Đang thực hiện",
  "TrangThaiAP": "Chưa phê duyệt",
  "Tinh_TP": "TP Hồ Chí Minh",
  "Quan_Huyen": "Quận 1"  
}
}
```

**Example Response:**

```json
Status: 200 OK

{
  "body": "Inserted"   
}
```
**Error Responses:**

- 400 Bad Request - Invalid or missing IDKhachHang parameter
- 500 Internal Server Error - Database error

---

**/api/tiendokien/[id]**

**GET**
Get a single record from TienDoKien_ThiHanhAn table by id.

**Example Request:**
```json
GET /api/tiendokien/1
```

**Example Response:**
```json
{
  "id": 1, 
  "IDKhachHang": "KH001",
  "SoTienKK": 1000000,
  "TrangThaiKK": "Đã ký",
  "TrangThaiTHA": "Đang thực hiện",
  // other fields  
}
```

**Error Responses:**

- 400 Bad Request - Database error
- 404 Not Found - Record for given id not found

**PATCH**
Update a record in TienDoKien_ThiHanhAn table by id.

**Example Request:**

```json
PATCH /api/tiendokien/1

{
    "body": {
        "TrangThaiTHA": "Hoàn thành",
    }
}
```
Example Response:

```json
Status: 200 OK

{
  "message": "Tiến độ kiện đã được cập nhật" 
}
```

**Error Responses:**
- 400 Bad Request - Database error

**DELETE**
Delete a record from TienDoKien_ThiHanhAn table by id.

**Example Request:**

```json
DELETE /api/tiendokien/1
```
**Example Response:**

```json
Status: 200 OK

{
  "message": "Tiến độ kiện đã được xóa"
}
```

**Error Responses:**
- 400 Bad Request - Database error