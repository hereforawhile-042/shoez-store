import Layout from "@/layout/layout";
import { useContext } from "react";
import { FavouriteContext } from "../context/Contexts";
import ProductCard from "../components/ProductCard";
import { RxTrash } from "react-icons/rx";

const FavouritePage = () => {
  const { favourite } = useContext(FavouriteContext);

  return (
    <Layout noPadding={true}>
      <div className="px-12 py-10 border-t">
        <h2 className="text-center font-bold text-2xl">Favourite Product(s)</h2>
        <div className="flex items-between flex-row justify-center gap-20 p-8">
          {favourite.length == 0 && (
            <span className="text-center w-full p-15">
              No product to display
            </span>
          )}
          {favourite.map((fav) => (
            <ProductCard product={fav} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FavouritePage;
