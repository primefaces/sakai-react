import React, { useState } from 'react'

import { Button } from 'primereact/button'

import styles from '../index.module.scss'

const EditLegalRecord = () => {
  const [file, setFile] = useState({})

  return (
    <div>
      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label>Hồ sơ:</label>
        </div>
        {Object.keys(file).length > 0 ? (
          <div className='flex align-items-center'>
            <a href='/' target='__blank'>
              {file[0].name}
            </a>
            <label className={styles.inputFileContainer} style={{ marginLeft: '12px' }}>
              <input type='file' onChange={e => setFile(e.target.files)} />
              <i className='pi pi-upload mr-2' style={{ fontSize: '1.25rem', color: '#ffffff' }}></i>
              <span style={{ color: '#ffffff' }}>Tải lên</span>
            </label>
            <div className={styles.deleteBtn} style={{ marginLeft: '12px', color: '#fff' }} onClick={() => setFile({})}>
              <i className='pi pi-trash mr-2' style={{ fontSize: '1.25rem', color: '#ffffff' }}></i>
              Xóa
            </div>
          </div>
        ) : (
          <div className='col-12 md:col-9 sm:col-8'>
            <label className={styles.inputFileContainer}>
              <input type='file' onChange={e => setFile(e.target.files)} />
              <i className='pi pi-upload mr-2' style={{ fontSize: '1.25rem', color: '#ffffff' }}></i>
              <span style={{ color: '#ffffff' }}>Tải lên</span>
            </label>
          </div>
        )}
      </div>

      <div className='flex justify-content-end'>
        <Button
          label='Hủy'
          outlined
          style={{ width: '90px', marginRight: '16px' }}
          onClick={() => window.history.back()}
        />
        <Button label='Lưu' style={{ width: '90px' }} />
      </div>
    </div>
  )
}

export default EditLegalRecord
