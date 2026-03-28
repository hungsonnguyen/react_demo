import { useRef } from "react";

export default function PromoCodeBox() {
  const promoRef = useRef(null);

  const focusBox = () => {
    promoRef.current?.focus();
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoRef.current?.value || "";

    if (code.trim()) {
      alert(`Áp dụng mã: ${code}`);
      promoRef.current.value = "";
    } else {
      alert("Vui lòng nhập mã khuyến mãi");
    }
  };

  return (
    <div className="promo-box">
      <h3> Uncontrolled Input with useRef</h3>

      <form className="promo-form" onSubmit={handleApplyPromo}>
        <input
          ref={promoRef}
          type="text"
          placeholder="Nhập mã khuyến mãi..."
          className="promo-input"
        />

        <div className="button-group">
          <button type="button" onClick={focusBox} className="focus-btn">
            Focus Input
          </button>
          <button type="submit" className="apply-btn">
            Áp dụng
          </button>
        </div>
      </form>
    </div>
  );
}
