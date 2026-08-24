import { Component } from 'manate/react/class-components'
import Session from './session.jsx'

import { pick } from 'lodash-es'
import classNames from 'classnames'
import {
  termControlHeight,
  statusMap
} from '../../common/constants.js'
import pixed from '../layout/pixed'
import { refs } from '../common/ref'

export default class Sessions extends Component {
  // Function to reload a tab using store.reloadTab
  reloadTab = (tab) => {
    const failures = window.store.autoReconnectAuthenticationFailures
    const authFailure = failures?.get(tab.id)
    if (authFailure) {
      failures.delete(tab.id)
      if (!this.props.config.autoReconnectOnAuthenticationFailure) {
        window.store.updateTab(tab.id, {
          status: statusMap.error
        })
        refs.get('term-' + tab.id)?.handleError({
          message: authFailure.message,
          from: tab.from || 'bookmarks',
          srcId: tab.srcId
        })
        return
      }
    }
    window.store.updateTab(tab.id, tab)
    window.store.reloadTab(tab.id)
  }

  // Function to delete tab using store.delTab
  delTab = (id) => {
    window.store.delTab(id)
  }

  // Function to edit tab properties using store.editItem
  editTab = (id, update) => {
    window.store.updateTab(id, update)
  }

  computeHeight = (height) => {
    const {
      tabsHeight
    } = this.props
    return height -
      tabsHeight -
      termControlHeight
  }

  computeSessionStyle = (batch) => {
    const style = this.props.styles[batch]
    return pixed(style)
  }

  renderSessions () {
    const {
      config,
      tabs,
      activeTabId,
      sizes
    } = this.props
    return tabs.map((tab) => {
      const { id, batch } = tab
      const { height, width } = sizes[batch]
      const currentBatchTabId = this.props['activeTabId' + batch]
      const cls = classNames(
        `session-wrap session-${id}`,
        {
          'session-current': id === activeTabId,
          'session-batch-active': id === currentBatchTabId
        }
      )
      const sessionWrapProps = {
        style: this.computeSessionStyle(batch),
        className: cls
      }
      const sessProps = {
        activeTabId,
        layout: this.props.layout,
        tab,
        width,
        height,
        ...pick(this.props, [
          'resolutions',
          'hideDelKeyTip',
          'fileOperation',
          'pinnedQuickCommandBar',
          'tabsHeight',
          'appPath',
          'leftSidePanelWidth',
          'pinned',
          'openedSideBar',
          'fullscreen'
        ]),
        config,
        ...pick(this, [
          'reloadTab',
          'computeHeight',
          'delTab',
          'editTab'
        ]),
        currentBatchTabId
      }
      return (
        <div {...sessionWrapProps} key={id}>
          <Session
            {...sessProps}
          />
        </div>
      )
    })
  }

  render () {
    const { layoutStyle, tabs } = this.props
    if (!tabs || !tabs.length) {
      return null
    }
    const sessProps = {
      style: layoutStyle,
      className: 'sessions'
    }
    return (
      <div
        {...sessProps}
      >
        {this.renderSessions()}
      </div>
    )
  }
}
