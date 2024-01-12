'use client'
import React, { useState, useEffect, useRef } from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

import DebtRecoverySearch from '@/components/debtRecoveryActions/search/debt-recovery-search'
import ActionTable from '@/components/debtRecoveryActions/action-table/action-table'

import {
  getListActions,
  addDebtRecoveryResult,
  updateDebtRecoveryResult,
} from 'actions/ket-qua-thu-hoi-no/Ket-qua-thu-hoi-no'

import { getDebtRecoveryResult } from 'actions/ket-qua-thu-hoi-no/Ket-qua-thu-hoi-no'

import { getListCustomer } from 'actions/customer/Customer'

import { actionNames, actionTypes, results } from './const'

const DebtRecoveryActions = () => {
  const [checkedList, setCheckedList] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [errorForm, setErrorForm] = useState({})
  const [IDKhachHang, setIDKhachHang] = useState('')
  const [CCCD, setCCCD] = useState('')
  const [actionName, setActionName] = useState({})
  const [actionType, setActionType] = useState({})
  const [result, setResult] = useState({})
  const [note, setNote] = useState('')
  const [data, setData] = useState([])
  const [addedError, setAddedError] = useState(false)
  const [actionData, setActionData] = useState({})
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const toast = useRef(null)

  const getActions = () => {
    getListActions(query).then((res) => {
      setData(res.results)
    })
  }

  const getListCustomers = () => {
    getListCustomer('queryAll=true').then((res) => {
      setCustomers(res.results)
    })
  }

  const handleSearch = (query) => {
    setQuery(query)
    getDebtRecoveryResult(query).then((res) => {
      if (res && res.count > 0) {
        setData(res.results)
      } else {
        setData([])
      }
    })
  }

  const onCancel = () => {
    setIDKhachHang('')
    setCCCD('')
    setActionType({})
    setActionName({})
    setResult({})
    setNote('')
    setAddedError(false)
    setShowDialog(false)
  }

  const onCancelUpdate = () => {
    setShowUpdateDialog(false)
  }

  const informAddSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Thêm thành công',
      life: 3000,
    })
  }

  const informUpdateSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Cập nhật thành công',
      life: 3000,
    })
  }

  const handleAdd = () => {
    const form = {
      IDKhachHang: IDKhachHang,
      ten_hanh_dong: actionName.name,
      loai_hanh_dong: actionType.name,
      ket_qua: result.name,
      ghi_chu: note,
    }

    addDebtRecoveryResult({ body: form }).then((res) => {
      if (res && res.body === 'Inserted') {
        getActions()
        setShowDialog(false)
        setIDKhachHang('')
        setCCCD('')
        setActionType({})
        setActionName({})
        setResult({})
        setNote('')
        informAddSuccessfully()
      } else if (
        res &&
        res.response.data.error === 'Debt recovery action of this IDKhachHang has already exist'
      ) {
        setAddedError(true)
      }
    })
  }

  const getTime = () => {
    const date = new Date()
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${hour}:${minute}:${second}+00`
  }

  const handleUpdate = () => {
    const id = actionData.ma_ket_qua_hd
    const time = getTime()
    const body = {
      IDKhachHang: actionData.IDKhachHang,
      loai_hanh_dong: actionData.loai_hanh_dong,
      ten_hanh_dong: actionData.ten_hanh_dong,
      ket_qua: actionData.ket_qua,
      ghi_chu: actionData.ghi_chu,
      last_edited_at: time,
    }
    updateDebtRecoveryResult(id, { body: body }).then((res) => {
      if (res && res.body === 'Updated') {
        getActions()
        setShowUpdateDialog(false)
        informUpdateSuccessfully()
      }
    })
  }

  useEffect(() => {
    getActions()
    getListCustomers()
  }, [])

  return (
    <div className="card">
      <Toast ref={toast} />

      <div>
        <Accordion>
          <AccordionTab header="Tìm kiếm">
            <DebtRecoverySearch handleSearch={handleSearch} customers={customers} query={query} />
          </AccordionTab>
        </Accordion>
      </div>

      <div>
        <Dialog
          header="Thêm hành động thu hồi nợ"
          visible={showDialog}
          onHide={() => onCancel()}
          style={{ width: '400px' }}
          modal
        >
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="ma_nv">
                Mã khách hàng <span style={{ color: 'red' }}>*</span>
              </label>
              <InputText
                id="ma_nv"
                type="text"
                placeholder="Mã khách hàng"
                value={IDKhachHang}
                onChange={(e) => {
                  setIDKhachHang(e.target.value)
                  setAddedError(false)
                }}
                className={errorForm.MaNhanVienError ? 'p-invalid' : ''}
              />
            </div>
            {addedError && (
              <div style={{ color: 'red', marginBottom: '12px' }}>
                Khách hàng này đã được thêm hành động thu hồi nợ
              </div>
            )}

            <div className="field">
              <label htmlFor="CCCD">
                Căn cước công dân <span style={{ color: 'red' }}>*</span>
              </label>
              <InputText
                id="CCCD"
                type="text"
                placeholder="Căn cước công dân"
                value={CCCD}
                onChange={(e) => setCCCD(e.target.value)}
                className={errorForm.CCCDError ? 'p-invalid' : ''}
              />
            </div>

            <div className="field">
              <label htmlFor="Email">
                Loại hành động <span style={{ color: 'red' }}>*</span>
              </label>
              <Dropdown
                value={actionType}
                onChange={(e) => setActionType(e.value)}
                options={actionTypes}
                optionLabel="name"
                placeholder="Chọn loại hành động"
                className={errorForm.HoTenError ? 'p-invalid' : ''}
              />
            </div>

            <div className="field">
              <label htmlFor="HoTen">
                Tên hành động <span style={{ color: 'red' }}>*</span>
              </label>
              <Dropdown
                value={actionName}
                onChange={(e) => setActionName(e.value)}
                options={actionNames[actionType.name]}
                optionLabel="name"
                placeholder="Chọn tên hành động"
              />
            </div>

            <div className="field">
              <label htmlFor="SDT">Kết quả</label>
              {/* <InputText
                id="SDT"
                type="text"
                placeholder="Kết quả"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className={errorForm.SDTError ? 'p-invalid' : ''}
              /> */}
              <Dropdown
                value={result}
                onChange={(e) => setResult(e.value)}
                options={results[actionName.name]}
                optionLabel="name"
                placeholder="Chọn kết quả"
              />
            </div>

            <div className="field">
              <label htmlFor="SDT">Ghi chú</label>
              <InputTextarea
                id="SDT"
                type="text"
                placeholder="Ghi chú"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={errorForm.SDTError ? 'p-invalid' : ''}
              />
            </div>

            <div>
              <div className="flex justify-content-center mt-5">
                <Button
                  label="Hủy"
                  severity="primary"
                  outlined
                  style={{ width: '80px', height: '36px' }}
                  onClick={() => onCancel()}
                />
                <Button
                  label="Thêm"
                  style={{ width: '80px', height: '36px', marginLeft: '16px' }}
                  onClick={() => handleAdd()}
                />
              </div>
            </div>
          </div>
        </Dialog>

        <Dialog
          header="Cập nhật"
          visible={showUpdateDialog}
          onHide={() => setShowUpdateDialog(false)}
          style={{ width: '400px' }}
          modal
        >
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="ma_nv">
                Mã khách hàng <span style={{ color: 'red' }}>*</span>
              </label>
              <InputText
                id="ma_nv"
                type="text"
                value={actionData.IDKhachHang}
                className={errorForm.MaNhanVienError ? 'p-invalid' : ''}
                disabled
              />
            </div>

            <div className="field">
              <label htmlFor="CCCD">
                Căn cước công dân <span style={{ color: 'red' }}>*</span>
              </label>
              <InputText
                id="CCCD"
                type="text"
                placeholder="Căn cước công dân"
                value={actionData.KhachHang?.CCCD}
                className={errorForm.CCCDError ? 'p-invalid' : ''}
                disabled
              />
            </div>

            <div className="field">
              <label htmlFor="Email">
                Loại hành động <span style={{ color: 'red' }}>*</span>
              </label>
              <Dropdown
                value={{ name: actionData.loai_hanh_dong }}
                onChange={(e) => setActionData({ ...actionData, loai_hanh_dong: e.value.name })}
                options={actionTypes}
                optionLabel="name"
                placeholder="Chọn loại hành động"
                className={errorForm.HoTenError ? 'p-invalid' : ''}
              />
            </div>

            <div className="field">
              <label htmlFor="HoTen">
                Tên hành động <span style={{ color: 'red' }}>*</span>
              </label>
              <Dropdown
                value={{ name: actionData.ten_hanh_dong }}
                onChange={(e) => setActionData({ ...actionData, ten_hanh_dong: e.value.name })}
                options={actionNames[actionData.loai_hanh_dong]}
                optionLabel="name"
                placeholder="Chọn tên hành động"
              />
            </div>

            <div className="field">
              <label htmlFor="SDT">Kết quả</label>
              {/* <InputText
                id="SDT"
                type="text"
                placeholder="Kết quả"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className={errorForm.SDTError ? 'p-invalid' : ''}
              /> */}
              <Dropdown
                value={{ name: actionData.ket_qua }}
                onChange={(e) => setActionData({ ...actionData, ket_qua: e.value.name })}
                options={results[actionData.ten_hanh_dong]}
                optionLabel="name"
                placeholder="Chọn kết quả"
              />
            </div>

            <div className="field">
              <label htmlFor="SDT">Ghi chú</label>
              <InputTextarea
                id="SDT"
                type="text"
                placeholder="Ghi chú"
                rows={4}
                value={actionData.ghi_chu}
                onChange={(e) => setActionData({ ...actionData, ghi_chu: e.target.value })}
                className={errorForm.SDTError ? 'p-invalid' : ''}
              />
            </div>

            <div>
              <div className="flex justify-content-center mt-5">
                <Button
                  label="Hủy"
                  severity="primary"
                  outlined
                  style={{ width: '80px', height: '36px' }}
                  onClick={() => onCancelUpdate()}
                />
                <Button
                  label="Cập nhật"
                  style={{ width: '96px', height: '36px', marginLeft: '16px' }}
                  onClick={() => handleUpdate()}
                />
              </div>
            </div>
          </div>
        </Dialog>

        <div className="flex justify-content-between align-items-center mt-3 mb-3">
          <div className="font-bold text-xl mt-4 mb-2">Lịch sử hành động thu hồi nợ</div>
          {/* {checkedList.length > 0 && (
            <Button label="Xóa" style={{ height: '37px', width: '74px' }} />
          )} */}
          <Button
            label="Thêm"
            style={{ height: '36px', width: '100px' }}
            onClick={() => setShowDialog(true)}
          />
        </div>
        <div>
          <ActionTable
            data={data}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            setShowUpdateDialog={setShowUpdateDialog}
            setActionData={setActionData}
          />
        </div>
      </div>
    </div>
  )
}

export default DebtRecoveryActions
