import { Button } from "@/components/ui/button";
import Layout from "@/layout/layout";
import Autoplay from "embla-carousel-autoplay";
import supabase from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import caro1 from "../assets/images/Gemini_Generated_Image_nw3wvznw3wvznw3w (1).png";
import caro2 from "../assets/images/Gemini_Generated_Image_iqkl6xiqkl6xiqkl.png";
import caro4 from "../assets/images/Gemini_Generated_Image_nw3wvznw3wvznw3w (2).png";
import caro5 from "../assets/images/Gemini_Generated_Image_nw3wvznw3wvznw3w.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Homepage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      const mappedProducts = data.map((p) => ({
        ...p,
        shortDescription: p.short_description,
      }));

      setNewArrivals(mappedProducts);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Layout noPadding={true}>
      <section className="flex flex-col bg-neutral-50 md:p-10 p-6 md:flex-row items-start md:h-auto md:pt-16 border border-t h-screen justify-between w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center md:gap-8 gap-5 w-full md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-linear-to-br bg-clip-text from-neutral-900 via-neutral-700 to-black leading-snug tracking-tight">
            Grab Up to 50% Off On Selected Shoes
          </h2>

          <p className="text-md w-full text-neutral-600 md:w-9/12 mx-auto md:mx-0">
            Step into comfort and style. From sneakers to casuals, our new
            arrivals are designed to keep you moving with ease.
          </p>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <Button
              className="px-12 py-5 text-base rounded-full bg-neutral-900 hover:bg-neutral-700 text-white transition transform hover:scale-105 active:scale-95"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </Button>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex md:gap-2 md:flex-row flex-col gap-1 md:h-20"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center md:border-r md:border-gray-400 md:p-5 md:gap-0.5 gap-2"
            >
              <span className="text-3xl tracking-wide font-semibold">200+</span>
              <span className="text-gray-500 text-sm font-light">
                International Brands
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center flex-col md:border-r md:border-gray-400 md:p-5 md:gap-0.5 gap-2"
            >
              <span className="text-3xl tracking-wide font-semibold">
                1000+
              </span>
              <span className="text-gray-500 text-sm font-light">
                High Quality Products
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-center flex-col items-center md:p-5 md:gap-0.5 gap-2"
            >
              <span className="text-3xl tracking-wide font-semibold">
                20,000+
              </span>
              <span className="text-gray-500 text-sm font-light">
                Happy Customers
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full md:w-1/2 mt-8 md:mt-0"
        >
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent className="rounded-2xl">
              {[caro2, caro4, caro1, caro5].map((img, idx) => (
                <CarouselItem key={idx}>
                  <img
                    src={img}
                    alt="Sneaker"
                    className="w-full h-[300px] md:h-[420px] object-cover rounded-2xl shadow-md"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </section>

      <section className="flex md:flex-row flex-col justify-center px-6 items-center py-6 place-items-center w-full">
        <div className="w-full flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl text-center font-extrabold"
          >
            NEW ARRIVALS
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full"
          >
            {newArrivals.length === 0 ? (
              <p className="text-center w-full text-gray-500 col-span-full">
                Loading new arrivals...
              </p>
            ) : (
              newArrivals.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>
          <div className="p-2 w-full flex justify-center">
            <Button
              variant={"outline"}
              className={
                "w-2/12 font-semibold rounded-3xl p-5 hover:bg-black hover:text-white border transition-all duration-300"
              }
              onClick={() => navigate("/products")}
            >
              View All
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
