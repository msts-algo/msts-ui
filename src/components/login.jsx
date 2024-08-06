import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },      
      } = useForm();

      const navigate = useNavigate();

    const validate = async(data, e) => {
        const {email_id, token} = data
        if(data !== undefined) {
            const response = await fetch("http://quant9.ddns.net:5007/login",
                        {
                            method: "POST",
                            headers: {
                                'Content-type':'application/json', 
                                'Accept':'application/json'
                            },
                            body: JSON.stringify({
                                "email_id" : email_id,
                                "token": token
                            }
                        )});
            const resp_json = await response.json()
            if(response.status === 200) {
                localStorage.setItem('token', resp_json['token']);
                navigate('/msdi')
            } else {
                navigate('/login');
            }
        }
      };


    return (
            <div>
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col" onSubmit={handleSubmit(validate)} style={{ width: "100%" }}>
                <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2 p-4">
                            <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="currenyPair">
                                        Email ID
                                    </label>
                                    <input type="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("email_id", { required: true })} />
                                    </div>
                                    <div class="mb-4">
                                        <label class="block text-gray-700 text-sm font-bold mb-2" for="noOfCandles">
                                            Token
                                        </label>
                                    <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("token", { required: true })} />
                                    </div>
                                </div>
                            </div>
                        <div className="w-full flex justify-end">
                            <input className="bg-socman-yellow hover:bg-socman-yellow text-black font-bold py-2 px-4 rounded" type="submit" />
                        </div>
                </form>
            </div>
            );       
};

export default Login;