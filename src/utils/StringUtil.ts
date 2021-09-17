export function matchUrl (str) {
  let match2 = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/
  return match2.test(str)
}
