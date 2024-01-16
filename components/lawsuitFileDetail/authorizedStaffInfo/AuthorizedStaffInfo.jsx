'use client'
import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { AutoComplete } from 'primereact/autocomplete'

import { getListStaff } from 'actions/staff/Staff'

import styles from './index.module.scss'

const AuthorizedStaffInfo = (props) => {
  const [staffs, setStaffs] = useState([])
  const [selectedAutoValue, setSelectedAutoValue] = useState(null)
  const [autoFilteredValue, setAutoFilteredValue] = useState([])

  const searchName = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...staffs])
      } else {
        setAutoFilteredValue(
          staffs.filter((staff) => {
            return staff.HoTen.toLowerCase().startsWith(event.query.toLowerCase())
          })
        )
      }
    }, 250)
  }

  const searchCCCD = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...staffs])
      } else {
        setAutoFilteredValue(
          staffs.filter((staff) => {
            return staff.CCCD.toLowerCase().startsWith(event.query.toLowerCase())
          })
        )
      }
    }, 250)
  }

  const getStaffList = () => {
    getListStaff('queryAll=true').then((res) => {
      setStaffs(res.results)
    })
  }

  useEffect(() => {
    getStaffList()
  }, [])

  return (
    <div>
      <div className="font-bold text-xl mb-3 mt-3">Thông tin người được ủy quyền</div>
      <div className="grid ml-0">
        <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>Người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText disabled /> */}
            {props.isCreateNew ? (
              <AutoComplete
                placeholder="Search"
                id="dd"
                dropdown
                value={selectedAutoValue}
                onChange={(e) => {
                  setSelectedAutoValue(e.value)
                  if (typeof e.value === 'object') {
                    props.setForm({ ...props.form, id_nguoi_duoc_uq: e.value.MaNhanVien })
                  }
                }}
                suggestions={autoFilteredValue}
                completeMethod={searchName}
                field="HoTen"
              />
            ) : (
              <InputText disabled value={props.data.NhanVien?.HoTen} />
            )}
          </div>
        </div>

        <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>CCCD người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            {/* <InputText disabled /> */}
            {props.isCreateNew ? (
              <AutoComplete
                placeholder="Search"
                id="dd"
                dropdown
                value={selectedAutoValue}
                onChange={(e) => {
                  setSelectedAutoValue(e.value)
                  if (typeof e.value === 'object') {
                    props.setForm({ ...props.form, id_nguoi_duoc_uq: e.value.MaNhanVien })
                  }
                }}
                suggestions={autoFilteredValue}
                completeMethod={searchCCCD}
                field="CCCD"
              />
            ) : (
              <InputText disabled value={props.data.NhanVien?.CCCD} />
            )}
          </div>
        </div>

        {/* <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>Ngày cấp CCCD người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText disabled />
          </div>
        </div>

        <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>Nơi cấp CCCD người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText disabled />
          </div>
        </div> */}

        <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>Chức danh người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            {props.isCreateNew ? (
              <InputText disabled value={selectedAutoValue ? selectedAutoValue.ChucDanh : ''} />
            ) : (
              <InputText disabled value={props.data.NhanVien?.ChucDanh} />
            )}
          </div>
        </div>

        <div className="col-12 xl:col-4 lg:col-6 pl-0">
          <div className="mb-2">
            <label>Số điện thoại người được UQ</label>
          </div>
          <div className={styles.inputContainer}>
            {props.isCreateNew ? (
              <InputText disabled value={selectedAutoValue ? selectedAutoValue.SDT : ''} />
            ) : (
              <InputText disabled value={props.data.NhanVien?.SDT} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorizedStaffInfo
