export default function (date) {
  return `${new Date(date * 1000).getFullYear()}-${new Date(date * 1000).getMonth() + 1}-${new Date(date * 1000).getDate()}`;
}
