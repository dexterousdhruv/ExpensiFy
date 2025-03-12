import icon from "./../assets/icon.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiCall } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";


// Define your schema using Zod
const formSchema = z.object({
  firstName: z.string().trim().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().trim().min(2, {
    message: "Must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const register = (userData: any) => {
    return apiCall("POST", `/auth/signup`, null, null, userData );
  };

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: register,
    onMutate: () => {},
    onSuccess: (res) => { 
      console.log(res?.data?.message)
      toast.success("Signup successful!")
      navigate("/sign-in")
    },
    onError: () => {
      toast.error(" Request failed! Please try again. 😞")
    },

  })

  async function onSubmit(values: FormValues) {
    registerUser(values)
  }

  return (
    <section>
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12 lg:container mx-auto lg:border-x-3 border-zinc-900">
        <aside className="relative h-32 block lg:order-first lg:col-span-5 lg:h-full xl:col-span-6 border-r-3 border-black lg:flex justify-center items-center ">

          <img
            alt=""
            src="https://i.pinimg.com/originals/d6/d8/9a/d6d89ac7a9291c54f20c39ff757c04e1.gif"
            className="absolute inset-0 h-full w-full object-cover lg:hidden"
          />
          
          <div className="relative hidden lg:block border-2 group border-zinc-900 aspect-square sm:w-[80%] max-w-[545px] ">
            <span className="neo-brutal transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <span className="absolute inset-0 bg-white"></span>
            <img src="/girl.png" alt="" className="relative mt-14 " />
          </div>
        </aside>

        <main className="max-xl:min-h-[calc(100vh_-_226px)] flex flex-col items-center justify-center py-8 lg:col-span-7 lg:py-12 xl:col-span-6 ">
          <hr className="h-1 mb-24 w-full text-zinc-900 bg-black hidden lg:block" />

          <div className="max-w-xl lg:max-w-3xl w-full ">
            <div className="px-8 sm:px-10  ">
              <div className="block text-blue-600" >
                <span className="sr-only">Home</span>
                <img src={icon} alt="logo" className="w-12"/>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl font-geist">
                Sign up to ExpensiFy
              </h1>

              <p className="mt-4 leading-relaxed text-gray-700 font-inter">
                Start your financial journey today.
              </p>


              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-5 mt-8 grid grid-cols-6 gap-6">

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-inter !text-black">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage className="text-[#FB2C36]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-inter !text-black">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage className="text-[#FB2C36]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-inter !text-black">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage className="text-[#FB2C36]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-inter !text-black">Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Password" className="bg-white" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#FB2C36]" />
                        </FormItem>
                      )}
                    />
                  </div>
                    
                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
              
                    <Button
                      disabled={isPending}
                      type="submit"
                      size={"lg"}
                      className=" max-sm:w-28 w-40 font-inter"
                    >
                      Submit
                    </Button>

                    <p className="mt-4 text-sm text-gray-500 sm:mt-0 font-rubik">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-gray-700 underline">
                        Sign in
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </Form>

              
            </div>
          </div>

          <hr className="h-1 mt-24 w-full text-zinc-900 bg-black hidden lg:block" />

        </main>
      </div>
    </section>
  );
};

export default Register;
