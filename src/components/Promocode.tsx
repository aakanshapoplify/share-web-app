import classes from "./styles/eventCard.module.css";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";


interface Props {
  isDisable: boolean;
  promo_code:any;
  handlePromocode: (data: string,type:string) => void;
}

const PromCode = ({ handlePromocode, isDisable,promo_code }: Props) => {
  const [promocode, setPromocode] = useState(promo_code?.value ?? "");

  useEffect(()=>{
    setPromocode(promo_code?.value ?? "")
  },[promo_code])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromocode(event.target.value);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault(); 
    }
    if (promocode.trim() === "") {
      toast.error("Promo code cannot be blank.");
      return;
    }
    handlePromocode(promocode.trim(), 'promocode');
  };

  return (
    <div className="mt-4">
      <h5 className={classes.event_name}>Promo Code</h5>
      <form  onSubmit={handleSubmit}>
        <div className={classNames(classes.card_start, "card", "p-3")}>
          <div className={classNames(classes.input_form, "form-group mb-3")}>
            <input
              type="text"
              name="promocode"
              className={classNames(classes.input_filed, "form-control")}
              placeholder="Enter promo code"
              autoComplete="off"
              value={promocode}
              disabled={promo_code?.value}
              onChange={handleChange}
            />
            <button
              type="submit"
              className={classNames(classes.btn_apply, "btn")}
              disabled={isDisable || promo_code?.value}
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromCode;
