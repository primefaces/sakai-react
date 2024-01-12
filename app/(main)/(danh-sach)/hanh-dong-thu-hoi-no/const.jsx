export const actionTypes = [
  { name: 'Liên hệ khách hàng' },
  { name: 'Gửi thư khách hàng' },
  { name: 'Liên hệ người thân khách hàng' },
  { name: 'Xác minh khách hàng' },
  { name: 'Khởi kiện và thi hành án' },
  { name: 'Thông tin khác' },
]

export const actionNames = {
  'Liên hệ khách hàng': [
    { name: 'Gọi điện' },
    { name: 'Gửi SMS' },
    { name: 'Gửi Email' },
    { name: 'Gọi đến công ty' },
  ],
  'Gửi thư khách hàng': [
    { name: 'Gửi thông báo kiện' },
    { name: 'Gửi công văn công ty hỗ trợ' },
    { name: 'Gửi công văn tư pháp phường - UBND phường' },
  ],
  'Liên hệ người thân khách hàng': [
    { name: 'Gọi điện' },
    { name: 'Gửi SMS' },
    { name: 'Gửi Email' },
  ],
  'Xác minh khách hàng': [
    { name: 'Đến địa chỉ thường trú' },
    { name: 'Đến địa chỉ tạm trú' },
    { name: 'Đến công ty khách hàng' },
    { name: 'Đến địa chỉ khác' },
  ],
  'Khởi kiện và thi hành án': [{ name: 'Đã đánh giá khởi kiện' }],
  'Thông tin khác': [
    { name: 'Liên hệ đơn vị chịu nợ' },
    { name: 'Gửi email đơn vị chịu nợ' },
    { name: 'Khách hàng chết' },
    { name: 'Khách hàng đang thi hành án tù' },
    { name: 'Khách hàng không thừa nhận sử dụng thẻ' },
    { name: 'Hồ sơ có dấu hiệu giả mạo' },
    { name: 'Khách hàng đang ở nước ngoài' },
    { name: 'Khách hàng cơ cấu nợ' },
    { name: 'Trích tiền do nợ quá hạn' },
  ],
}

export const results = {
  'Gọi điện': [
    { name: 'Liên hệ được' },
    { name: 'Không liên hệ được' },
    { name: 'Hứa thanh toán' },
  ],
  'Gửi SMS': [{ name: 'Đã gửi SMS' }],
  'Gửi Email': [{ name: 'Đã gửi Email' }],
  'Gọi đến công ty': [{ name: 'Còn làm việc' }, { name: 'Đã nghỉ việc' }],
  'Gửi thông báo kiện': [
    { name: 'Gửi về địa chỉ thường trú' },
    { name: 'Gửi về địa chỉ tạm trú' },
    { name: 'Gửi về địa chỉ công ty' },
  ],
  'Gửi công văn công ty hỗ trợ': [{ name: 'Gửi về địa chỉ công ty' }],
  'Gửi công văn tư pháp phường - UBND phường': [
    { name: 'Gửi về địa chỉ thường trú' },
    { name: 'Gửi về địa chỉ tạm trú' },
  ],
  'Đến địa chỉ thường trú': [{ name: 'Còn cư trú' }, { name: 'Không còn cư trú' }],
  'Đến địa chỉ tạm trú': [{ name: 'Còn cư trú' }, { name: 'Không còn cư trú' }],
  'Đến công ty khách hàng': [{ name: 'Còn làm việc' }, { name: 'Đã nghỉ việc' }],
  'Đến địa chỉ khác': [{ name: 'Còn cư trú' }, { name: 'Không còn cư trú' }],
  'Đã đánh giá khởi kiện': [{ name: 'Đã đánh giá khởi kiện' }],
}
