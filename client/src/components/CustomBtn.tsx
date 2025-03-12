import React from "react";

type Props = {
  children: React.ReactNode
};

const CustomBtn = ({children}: Props) => {
  return (
    <button
      className="relative bottom-0 flex justify-center items-center gap-2 border border-[#000] rounded-lg text-[#FFF] font-semibold tracking-wider font-geist bg-[#000] px-7 py-4 z-10 overflow-hidden ease-in-out duration-200 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0  isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
    >
      <span className="truncate ease-in-out duration-100 ">
        {children}
      </span>
      <svg
        className="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:duration-0 ease-in-out duration-200"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z"></path>
      </svg>
    </button>
  );
};

export default CustomBtn;
