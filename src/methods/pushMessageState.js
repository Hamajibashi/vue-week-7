import eventBus from '@/methods/eventBus'

export default function (response, title = '更新') {
  if (response.data.success) {
    eventBus.emit('push-message', {
      style: 'success',
      title: `${title}成功`
    })
  } else {
    const message = typeof response.data.message === 'string' ? [response.data.message] : response.data.message
    eventBus.emit('push-message', {
      style: 'danger',
      title: `${title}失敗`,
      content: message.join('、')
    })
  }
}
