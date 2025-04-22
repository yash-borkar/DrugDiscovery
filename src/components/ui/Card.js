import React from "react";

export function Card({ children }) {
  return <div className="p-6 bg-white shadow-lg rounded-2xl">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}
