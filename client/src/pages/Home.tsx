import CustomBtn from "@/components/CustomBtn";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="relative sm:min-h-screen flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

        <Header />
        <div className="h-6 sm:h-20 lg:hidden"></div>
        <div className="container flex-grow mx-auto flex flex-col items-center justify-center gap-18 px-8 pb-16 lg:flex-row  lg:pr-0 lg:pb-0 lg:gap-0 2xl:max-w-[85rem]">
          <div className="sm:basis-[60%] flex-1 space-y-20 flex flex-col justify-center ">
            <h1 className=" text-center h-fit leading-15 text-4xl sm:text-[45px] font-bold font-inter sm:leading-relaxed lg:text-left xl:text-[55px] tracking-wide">
              Manage Your <br /> Expenses Easily With <br />
              <span className="border-b-8 border-[#02da87] mr-4">ExpensiFy</span>
              <img src="/notes.png" alt="" className="inline-block w-9 sm:w-12 xl:w-14" />
            </h1>

            <div className="mx-auto w-fit lg:mx-0">
              <Link to={"/register"}>
                <CustomBtn>Get Started</CustomBtn>
              </Link>
            </div>
          </div>

          <div>
            <div className="relative border-2 group border-zinc-900  aspect-square max-sm:max-w-[360px] sm:w-[80%] sm:mx-16 lg:w-fit max-lg:max-w-[450px]">
              <span className="neo-brutal transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <img src="/spend.webp" alt="" className="relative " />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Home;

/*
   return (
    <div className="min-h-screen flex flex-col">
      // Header 
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mr-2"></div>
            <span className="text-xl font-bold">ExpensiFy</span>
          </div>
          <Link
            href="/signin"
            className="bg-black text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
          >
            Sign In
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </header>

      // Main Content 
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
        // Left Column - Text Content 
        <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Manage Your
            <br />
            Expenses Easily With
            <br />
            ExpensiFy <span className="inline-block">💵</span>
          </h1>
          <div className="h-1 w-64 bg-green-400 my-6"></div>
          <div className="mt-8">
            <Link
              href="/get-started"
              className="bg-black text-white px-6 py-3 rounded-md inline-flex items-center text-lg font-medium"
            >
              Get Started &gt;
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="relative w-full max-w-md aspect-square border border-gray-200 shadow-lg">
            <div className="absolute inset-0 m-4">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Expense management illustration"
                width={400}
                height={400}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </main>

 
    </div>
  )
*/
