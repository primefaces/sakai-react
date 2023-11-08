/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEventListener, useMountEffect, useUnmountEffect } from 'primereact/hooks'
import React, { useContext, useEffect, useRef } from 'react'
import { classNames } from 'primereact/utils'
import { connect } from 'react-redux'
import { useRouter } from 'next/navigation'
import AppFooter from './AppFooter'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import AppConfig from './AppConfig'
import { LayoutContext } from './context/LayoutContext'
import { PrimeReactContext } from 'primereact/api'
import { usePathname, useSearchParams } from 'next/navigation'

const Layout = props => {
  const router = useRouter()
  if (Object.keys(props.user).length === 0) {
    router.push('/auth/login')
  }
  const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext)
  const { setRipple } = useContext(PrimeReactContext)
  const topbarRef = useRef(null)
  const sidebarRef = useRef(null)
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: event => {
      const isOutsideClicked = !(
        sidebarRef.current?.isSameNode(event.target) ||
        sidebarRef.current?.contains(event.target) ||
        topbarRef.current?.menubutton?.isSameNode(event.target) ||
        topbarRef.current?.menubutton?.contains(event.target)
      )

      if (isOutsideClicked) {
        hideMenu()
      }
    }
  })

  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    hideMenu()
    hideProfileMenu()
  }, [pathname, searchParams])

  const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: event => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenu?.contains(event.target) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target)
      )

      if (isOutsideClicked) {
        hideProfileMenu()
      }
    }
  })

  const hideMenu = () => {
    setLayoutState(prevLayoutState => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false
    }))
    unbindMenuOutsideClickListener()
    unblockBodyScroll()
  }

  const hideProfileMenu = () => {
    setLayoutState(prevLayoutState => ({
      ...prevLayoutState,
      profileSidebarVisible: false
    }))
    unbindProfileMenuOutsideClickListener()
  }

  const blockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll')
    } else {
      document.body.className += ' blocked-scroll'
    }
  }

  const unblockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll')
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      )
    }
  }

  useMountEffect(() => {
    setRipple(layoutConfig.ripple)
  })

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener()
    }

    layoutState.staticMenuMobileActive && blockBodyScroll()
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive])

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener()
    }
  }, [layoutState.profileSidebarVisible])

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener()
    unbindProfileMenuOutsideClickListener()
  })

  const containerClass = classNames('layout-wrapper', {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive,
    'p-input-filled': layoutConfig.inputStyle === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple
  })

  return (
    <React.Fragment>
      <div className={containerClass}>
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className='layout-sidebar'>
          <AppSidebar />
        </div>
        <div className='layout-main-container'>
          <div className='layout-main'>{props.children}</div>
          <AppFooter />
        </div>
        <AppConfig />
        <div className='layout-mask'></div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Layout)
