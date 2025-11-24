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

import { motion } from "framer-motion";

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
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <Carousel
            className="w-full h-full"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent className="h-full ml-0">
              {[caro2, caro4, caro1, caro5].map((img, idx) => (
                <CarouselItem key={idx} className="pl-0 h-full">
                  <img
                    src={img}
                    alt="Sneaker"
                    className="w-full h-full object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Grab Up to 50% Off <br className="hidden md:block" /> On Selected
              Shoes
            </h2>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">
              Step into comfort and style. From sneakers to casuals, our new
              arrivals are designed to keep you moving with ease.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                className="px-8 py-6 text-lg rounded-full bg-white text-black hover:bg-gray-100 transition transform hover:scale-105 active:scale-95 font-bold"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 md:gap-16 text-white"
          >
            <motion.div variants={itemVariants} className="text-center">
              <span className="block text-2xl md:text-3xl font-bold">200+</span>
              <span className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">
                Brands
              </span>
            </motion.div>
            <div className="w-px h-10 bg-gray-500/50" />
            <motion.div variants={itemVariants} className="text-center">
              <span className="block text-2xl md:text-3xl font-bold">
                1000+
              </span>
              <span className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">
                Products
              </span>
            </motion.div>
            <div className="w-px h-10 bg-gray-500/50" />
            <motion.div variants={itemVariants} className="text-center">
              <span className="block text-2xl md:text-3xl font-bold">20k+</span>
              <span className="text-xs md:text-sm text-gray-300 uppercase tracking-wider">
                Customers
              </span>
            </motion.div>
          </motion.div>
        </div>
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
