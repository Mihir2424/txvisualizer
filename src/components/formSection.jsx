/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { getQueryResult } from "../lib/getQueryResult";

const FormSection = ({ setWalletAddress, setData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data, "data");
    try {
      const res = await getQueryResult(data.walletAddress);
      console.log(res?.records, "response");
      setData(res?.records);
      setWalletAddress(data.walletAddress);
    } catch (error) {
      console.log(error, "error");
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        className="mainInput"
        {...register("walletAddress", { required: true })}
      />
      {errors.exampleRequired && <span>This field is required</span>}
      <button type="submit" className="formButton">
        Submit
      </button>
    </form>
  );
};

export default FormSection;
