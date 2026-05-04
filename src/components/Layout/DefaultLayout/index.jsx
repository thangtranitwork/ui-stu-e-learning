import Header from "../components/Header"
import Footer from "../components/Footer";

export default function DefaultLayout({children}) {
  return (
    <>
        <Header/>
        <main className="min-h-screen pt-20">
            {children}
        </main>
        <Footer/>
    </>
  )
}
