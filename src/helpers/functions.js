export const getClockTime = (time) => {
  let hours = "00"
  let minutes = "00"
  let seconds = "00"
  if (time < 60) {
    seconds = time
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 60 && time < 3600) {
    minutes = Math.floor(time / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - minutes * 60) % 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 3600) {
    hours = Math.floor(time / 3600)
    hours = hours < 10 ? `0${hours}` : hours
    minutes = Math.floor((time - hours * 3600) / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - hours * 3600 - minutes * 60) / 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  }
  return `${hours}:${minutes}:${seconds}`
}
