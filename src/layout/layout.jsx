import Footer from "../components/Footer";
import NavBar from "../components/NavBar";


export default function Layout({ children, noPadding }) {
  return (
    <div>
      <NavBar />
      <div className={`${noPadding ? "p-0" : "p-12"}`}>{children}</div>
      <Footer />
    </div>
  );
}
