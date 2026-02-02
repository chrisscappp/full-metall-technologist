declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

type EmptyObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in any] : never
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  __TAURI__?: any;
}
