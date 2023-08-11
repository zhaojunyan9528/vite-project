export const getTime = (): string => {
  const hours = new Date().getHours()
  if (hours <= 9) {
    return '早上'
  } else if (hours <= 12) {
    return '上午'
  } else if (hours <= 16) {
    return '下午'
  } else {
    return '晚上'
  }
}
