'use client'
import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { AutoComplete } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'

import { provinces, districts } from 'utils/procinves-districts/provinces-districts'

import styles from './index.module.scss'

const LawsuitSearch = (props) => {
  const [selectedAutoValue, setSelectedAutoValue] = useState(null)
  const [autoFilteredValue, setAutoFilteredValue] = useState([])
  const [province, setProvince] = useState({})
  const [district, setDistrict] = useState({})

  const searchID = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...props.customers])
      } else {
        setAutoFilteredValue(
          props.customers.filter((customer) => {
            return customer.IDKhachHang.toString()
              .toLowerCase()
              .startsWith(event.query.toLowerCase())
          })
        )
      }
    }, 250)
  }

  const searchCCCD = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...props.customers])
      } else {
        setAutoFilteredValue(
          props.customers.filter((customer) => {
            return customer.CCCD.toString().toLowerCase().startsWith(event.query.toLowerCase())
          })
        )
      }
    }, 250)
  }

  return (
    <div>
      <div className="grid">
        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="IDKhachHang">Mã khách hàng</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText id='IDKhachHang' type='text' /> */}
            <AutoComplete
              placeholder="Search"
              id="dd"
              dropdown
              value={selectedAutoValue}
              onChange={(e) => setSelectedAutoValue(e.value)}
              suggestions={autoFilteredValue}
              completeMethod={searchID}
              field="IDKhachHang"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Họ và tên</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText
              id="HoTen"
              type="text"
              value={selectedAutoValue ? selectedAutoValue.Ho_ten : ''}
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="IDKhachHang">Căn cước công dân</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText id="IDKhachHang" type="text" /> */}
            <AutoComplete
              placeholder="Search"
              id="dd"
              dropdown
              value={selectedAutoValue}
              onChange={(e) => {
                setSelectedAutoValue(e.value)
              }}
              suggestions={autoFilteredValue}
              completeMethod={searchCCCD}
              field="CCCD"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Tỉnh/Thành phố</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText id="HoTen" type="text" /> */}
            <Dropdown
              value={province}
              onChange={(e) => setProvince(e.value)}
              options={provinces}
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Quận/Huyện</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText id="HoTen" type="text" /> */}
            <Dropdown
              value={district}
              onChange={(e) => setDistrict(e.value)}
              options={districts[province.name]}
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Người được ủy quyền</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Biên lai</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Số quyết định bản án</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Trạng thái khởi kiện</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Trạng thái thi hành án</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Trạng thái án phí</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Số tiền đóng tạm ứng án phí</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Từ ngày</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Đến ngày</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" />
          </div>
        </div>
      </div>
      <div className="flex justify-content-center md:justify-content-end mt-2">
        <Button label="Xóa" outlined style={{ width: '93px', marginRight: '16px' }} />
        <Button label="Áp dụng" />
      </div>
    </div>
  )
}

export default LawsuitSearch
