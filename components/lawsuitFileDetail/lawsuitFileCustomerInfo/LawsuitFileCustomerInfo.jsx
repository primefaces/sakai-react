'use client'
import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { AutoComplete } from 'primereact/autocomplete'
import { Dropdown } from 'primereact/dropdown'

import { getListCustomer } from 'actions/customer/Customer'

import { provinces, districts } from 'utils/procinves-districts/provinces-districts'

import styles from './index.module.scss'

const LawsuitFileCustomerInfo = (props) => {
  const [customers, setCustomers] = useState([])
  const [selectedAutoValue, setSelectedAutoValue] = useState(null)
  const [autoFilteredValue, setAutoFilteredValue] = useState([])

  const [province, setProvince] = useState({})
  const [district, setDistrict] = useState({})

  const searchID = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...customers])
      } else {
        setAutoFilteredValue(
          customers.filter((customer) => {
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
        setAutoFilteredValue([...customers])
      } else {
        setAutoFilteredValue(
          customers.filter((customer) => {
            return customer.CCCD.toString().toLowerCase().startsWith(event.query.toLowerCase())
          })
        )
      }
    }, 250)
  }
  const getListCustomers = () => {
    getListCustomer('queryAll=true').then((res) => {
      setCustomers(res.results)
    })
  }

  useEffect(() => {
    getListCustomers()
  }, [])

  return (
    <div>
      <div className="font-bold text-xl mb-3">Thông tin khách hàng</div>
      <div className="grid ml-0">
        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Mã khách hàng</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText /> */}
            <AutoComplete
              placeholder="Search"
              id="dd"
              dropdown
              value={selectedAutoValue}
              onChange={(e) => {
                setSelectedAutoValue(e.value)
                if (typeof e.value === 'object') {
                  props.setForm({ ...props.form, IDKhachHang: e.value.IDKhachHang })
                }
              }}
              suggestions={autoFilteredValue}
              completeMethod={searchID}
              field="IDKhachHang"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Họ và tên</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText value={selectedAutoValue ? selectedAutoValue.Ho_ten : ''} disabled />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Căn cước công dân</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText /> */}
            <AutoComplete
              placeholder="Search"
              id="dd"
              dropdown
              value={selectedAutoValue}
              onChange={(e) => {
                setSelectedAutoValue(e.value)
                if (typeof e.value === 'object') {
                  props.setForm({ ...props.form, IDKhachHang: e.value.IDKhachHang })
                }
              }}
              suggestions={autoFilteredValue}
              completeMethod={searchCCCD}
              field="CCCD"
            />
          </div>
        </div>

        {/* <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Ngày sinh</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div> */}

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Địa chỉ thường trú</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText
              value={selectedAutoValue ? selectedAutoValue.DiaChiThuongTru : ''}
              disabled
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Địa chỉ tạm trú</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText value={selectedAutoValue ? selectedAutoValue.DiaChiTamTru : ''} disabled />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Tỉnh/Thành phố</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText /> */}
            <Dropdown
              value={province}
              onChange={(e) => {
                setProvince(e.value)
                props.setForm({ ...props.form, tinh_tp: e.value.name })
              }}
              options={provinces}
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        </div>

        <div className="col-12 xl:col-4 md:col-6 pl-0">
          <div className="mb-2">
            <label>Quận/Huyện</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText /> */}
            <Dropdown
              value={district}
              onChange={(e) => {
                setDistrict(e.value)
                props.setForm({ ...props.form, quan_huyen: e.value.name })
              }}
              options={districts[province.name]}
              optionLabel="name"
              placeholder="Select"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawsuitFileCustomerInfo
