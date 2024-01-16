'use client'
import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { AutoComplete } from 'primereact/autocomplete'

import styles from './index.module.scss'

const DebtRecoverySearch = (props) => {
  const [selectedAutoValue, setSelectedAutoValue] = useState(null)
  const [autoFilteredValue, setAutoFilteredValue] = useState([])
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

  const applySearch = () => {
    if (selectedAutoValue && selectedAutoValue.IDKhachHang) {
      props.handleSearch(`IDKhachHang=${selectedAutoValue.IDKhachHang}`)
    } else {
      props.handleSearch(`queryAll=true`)
    }
  }

  return (
    <div>
      <div className="grid">
        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="IDKhachHang">Mã khách hàng</label>
          </div>
          <div className={styles.inputContainer}>
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
            <label htmlFor="IDKhachHang">Căn cước công dân</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText
              id="IDKhachHang"
              type="text"
              value={selectedAutoValue ? selectedAutoValue.CCCD : ''}
            /> */}
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
            <label htmlFor="HoTen">Họ và tên</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText
              id="HoTen"
              type="text"
              value={selectedAutoValue ? selectedAutoValue.Ho_ten : ''}
              disabled
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Số điện thoại</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText
              id="HoTen"
              type="text"
              value={selectedAutoValue ? selectedAutoValue.SDT : ''}
              disabled
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Tiến độ kiện - THA</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" disabled />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6">
          <div className="mb-2">
            <label htmlFor="HoTen">Nhân viên phụ trách</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText id="HoTen" type="text" disabled />
          </div>
        </div>
      </div>
      <div className="flex justify-content-center md:justify-content-end mt-4">
        <Button
          label="Xóa"
          outlined
          style={{ width: '93px', marginRight: '16px' }}
          onClick={() => {
            setSelectedAutoValue(null)
          }}
        />
        <Button label="Tìm kiếm" onClick={() => applySearch()} />
      </div>
    </div>
  )
}

export default DebtRecoverySearch
