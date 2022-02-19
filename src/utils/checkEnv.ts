export function checkEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_DEVELOPMENT_URL
  }
  return process.env.REACT_APP_PRODUCTION_URL
}
