import { RxArrowLeft, RxArrowRight } from "react-icons/rx";
import { Button } from "./ui/button";

const Pagination = ({ Product, itemPerPage, page, setPage }) => {
  const NumberOfPages = Math.ceil(Product.length / itemPerPage);

  const PageChange = (num) => {
    if (num < 1 || num > NumberOfPages) return;
    setPage(num);
  };

  // Function to generate pages with ellipsis
  const getPages = () => {
    const pages = [];
    const maxVisible = 5; // how many numbers to show in the middle

    if (NumberOfPages <= maxVisible) {
      for (let i = 1; i <= NumberOfPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", NumberOfPages);
      } else if (page >= NumberOfPages - 2) {
        pages.push(1, "...", NumberOfPages - 3, NumberOfPages - 2, NumberOfPages - 1, NumberOfPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", NumberOfPages);
      }
    }

    return pages;
  };

  return (
    <div className="justify-center p-6 flex mb-5">
      <div className="flex flex-row justify-evenly w-9/12 shadow-sm border-neutral-400 border-1 rounded-md p-4 ">
        <Button 
          onClick={() => PageChange(page - 1)} 
          disabled={page === 1}
        >
          <RxArrowLeft /> Prev
        </Button>

        {getPages().map((num, index) => (
          <Button
            key={index}
            className={`${
              page === num ? "bg-white text-black" : "bg-black text-white"
            } cursor-pointer p-2 w-10 h-9 flex items-center`}
            onClick={() => typeof num === "number" && PageChange(num)}
            disabled={num === "..."}
          >
            {num}
          </Button>
        ))}

        <Button 
          onClick={() => PageChange(page + 1)} 
          disabled={page === NumberOfPages}
        >
          Next <RxArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
