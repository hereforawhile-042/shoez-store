import { RxDownload, RxEnvelopeClosed, RxImage } from "react-icons/rx";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black h-9/12 md:h-auto flex md:flex-row flex-col md:items-center md:justify-evenly p-12">
      <div className="flex md:flex-row flex-col gap-6 md:gap-0 justify-between w-11/12">
        <div className="md:h-full items-center self-center md:flex">
          <Link to="/" className="text-3xl font-extrabold uppercase text-white">
            Shoez<span className="text-red-600">.</span>
          </Link>
        </div>
        <div className="text-white flex flex-col md:gap-4 items-center md:items-start">
          <span className="font-bold">Support</span>
          <span className="flex w-fit gap-1 items-center">
            <RxDownload className="w-5 h-7" />
            <span className="">29, kingsley Ajayi street, Ibadan.</span>
          </span>
          <span className="w-fit flex gap-1 flex-row items-center">
            <RxEnvelopeClosed className="w-5 h-6" />
            Jeremiahegemonye12@gmail.com
          </span>
          <span className="w-fit flex gap-1 flex-row items-center">
            <RxImage className="w-5 h-6" />
            +249161760462
          </span>
        </div>
        <div className="text-white flex flex-col md:gap-4 items-center md:items-start">
          <span className="font-bold">Account</span>
          <span>My Account</span>
          <span>Login/Register</span>
          <span>Cart</span>
          <span>Wishlist</span>
        </div>

        <div className="text-white flex flex-col items-center md:items-start md:gap-4">
          <span className="font-bold">Quick Link</span>
          <span>Contact</span>
          <span>FAQ</span>
          <span>Term Of Use</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
