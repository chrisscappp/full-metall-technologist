declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

type EmptyObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in any] : never
}
