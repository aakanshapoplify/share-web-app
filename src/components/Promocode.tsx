import classes from "./styles/eventCard.module.css";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";

interface Props {
  isDisable: boolean;
  promo_code: any;
  handlePromocode: (data: string, type: string, apiUpdate: boolean) => void;
  apiCall: boolean;
}

const PromCode = ({
  handlePromocode,
  isDisable,
  promo_code,
  apiCall,
}: Props) => {
  const [promocode, setPromocode] = useState(promo_code?.value ?? "");
  const [apiUpdate, setApiUpdate] = useState(apiCall);
  useEffect(() => {
    setPromocode(promo_code?.value ?? "");
  }, [promo_code]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromocode(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent, type: string) => {
    event.preventDefault()
    
    if (type === "add") {
      if (promocode.trim() === "") {
        toast.error("Promo code cannot be blank.");
        return;
      }
      setApiUpdate(true);
      handlePromocode(promocode.trim(), "promocode", apiUpdate);
    } else {
      promo_code.value = "";
      setPromocode("");
      setApiUpdate(true);
      handlePromocode("", "promocode", apiUpdate);
    }
  };

  return (
    <div className="mt-4">
      <h5 className={classes.event_name}>Promo Code</h5>
      <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission by default */}
        <div className={classNames(classes.card_start, "card", "p-3")}>
          <div className={classNames(classes.input_form, "form-group")}>
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
            {!promo_code?.value ? (
              <button
                type="button"
                className={classNames(classes.btn_apply, "btn", "btn-dark")}
                disabled={isDisable || promo_code?.value}
                style={{
                  opacity: isDisable || promo_code?.value ? 0.5 : 1,
                }}
                onClick={(e) => handleSubmit(e, "add")}
              >
                Apply
              </button>
            ) : (
              <button
                type="button"
                className={classNames(classes.btn_apply, "btn", "btn-dark")}
                onClick={(e) => handleSubmit(e, "remove")}
                disabled={isDisable}
                style={{
                  opacity: isDisable ? 0.5 : 1,
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromCode;
