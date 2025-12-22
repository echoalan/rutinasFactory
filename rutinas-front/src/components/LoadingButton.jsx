import React from "react";

export default function LoadingButton({ children, loading, disabled, onClick, style = {}, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}
      {...props}
    >
      {children}
      {loading && <div className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }}></div>}
    </button>
  );
}
