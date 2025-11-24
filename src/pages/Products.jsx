import { useMemo, useState, useEffect } from "react";
import Layout from "@/layout/layout";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import supabase from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { FilterIcon, Loader2 } from "lucide-react";

export default function ProductGrid() {
  const ItemPerPage = 6;
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProduct, setFiltered] = useState([]);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedGender, setSelectedGender] = useState(undefined);
  const [selectedBrand, setSelectedBrand] = useState(undefined);

  const [priceRange, setPriceRange] = useState([12000, 800000]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map Supabase fields to component expected fields if necessary
      const mappedProducts = data.map((p) => ({
        ...p,
        shortDescription: p.short_description,
        // Ensure sizes is an array
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const brandList = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const TYPES = ["all", "sneakers", "loafers", "heels", "sandals"];
  const GENDERS = ["any", "male", "female", "unisex"];

  const dataSource = filteredProduct.length ? filteredProduct : products;

  const start = (page - 1) * ItemPerPage;
  const end = start + ItemPerPage;

  const items = useMemo(() => {
    return dataSource.slice(start, end);
  }, [start, end, dataSource]);

  const filterItem = (value) => {
    if (TYPES.includes(value)) {
      setSelectedType(value);
    } else if (GENDERS.includes(value)) {
      setSelectedGender(value);
    } else if (brandList.includes(value)) {
      setSelectedBrand(value);
    }
  };

  const RangeFilter = () => {
    const next = products.filter((p) => {
      const typeOk =
        !selectedType || selectedType === "all"
          ? true
          : p.type === selectedType;
      const genderOk =
        !selectedGender || selectedGender === "any"
          ? true
          : p.gender === selectedGender;
      const brandOk =
        !selectedBrand || selectedBrand === "all"
          ? true
          : p.brand === selectedBrand;
      const priceOk = p.price >= priceRange[0] && p.price <= priceRange[1];
      return typeOk && genderOk && brandOk && priceOk;
    });

    setFiltered(next);
    setPage(1);
  };

  const clearAll = () => {
    setSelectedType(undefined);
    setSelectedGender(undefined);
    setSelectedBrand(undefined);
    setPriceRange([12000, 800000]);
    setFiltered([]);
    setPage(1);
  };

  const totalCount = dataSource.length;
  const endShown = Math.min(end, totalCount);

  return (
    <Layout noPadding={true}>
      <main className="md:px-12 px-6 border-t pt-5">
        <header className="mb-4">
          <p className="text-xs text-neutral-500">Home / Shop</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3"></div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl md:h-[80vh] border border-neutral-200 p-4">
            <h2 className="text-sm font-semibold flex justify-between text-neutral-900">
              Filters
              <span>
                <FilterIcon className="w-5 h-4" />
              </span>
            </h2>

            <div className="mt-4 space-y-6">
              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-600">
                  Shoe Type
                </label>
                <Select onValueChange={filterItem}>
                  <SelectTrigger className="w-full rounded-xl bg-neutral-100">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sneakers">Sneakers</SelectItem>
                    <SelectItem value="loafers">Loafers</SelectItem>
                    <SelectItem value="heels">Heels</SelectItem>
                    <SelectItem value="sandals">Sandals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-600">
                  Gender
                </label>
                <Select onValueChange={filterItem}>
                  <SelectTrigger className="w-full rounded-xl bg-neutral-100">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-600">
                  Brand
                </label>
                <Select onValueChange={filterItem}>
                  <SelectTrigger className="w-full rounded-xl bg-neutral-100">
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {brandList.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  Price Range
                </label>
                <span className="flex text-sm mb-1 justify-between">
                  {priceRange[0]} <span>{priceRange[1]}</span>
                </span>
                <Slider
                  min={10000}
                  max={1000000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              <Button className={"w-full"} onClick={RangeFilter}>
                Apply
              </Button>
              <Button
                className={"w-full"}
                variant={"destructive"}
                onClick={clearAll}
              >
                Clear Filter
              </Button>
            </div>
          </aside>

          <section className="h-fit">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-sm text-neutral-600">
                <span className="hidden sm:inline">Showing</span>
                <strong>
                  {totalCount === 0 ? 0 : start + 1}-
                  {totalCount === 0 ? 0 : endShown}
                </strong>
                <span>of {products.length} products</span>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-neutral-600">
                  Sort
                </label>
                <Select>
                  <SelectTrigger
                    id="sort"
                    className="w-40 rounded-xl bg-neutral-100"
                  >
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name_asc">Name: A → Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={32} />
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
                <p className="text-sm text-neutral-600">No products found.</p>
              </div>
            ) : (
              <ul
                className="md:grid items-center flex-col jus gap-4 flex sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
                role="list"
              >
                {items.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              Product={dataSource}
              itemPerPage={ItemPerPage}
              page={page}
              setPage={setPage}
            />
          </section>
        </div>
      </main>
    </Layout>
  );
}
