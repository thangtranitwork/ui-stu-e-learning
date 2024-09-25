import classNames from "classnames/bind"

import styles from './DefaultLayout.module.scss'
import Header from "../components/Header"

export default function DefaultLayout({children}) {
  const cx = classNames.bind(styles);
  return (
    <>
        <Header/>
        <main className={cx('content')}>
            {children}
        </main>
    </>
  )
}
