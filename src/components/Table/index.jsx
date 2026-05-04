import { cloneElement } from "react";

export default function Table({ items, labels, buttons, onButtonsClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {labels.map((label, index) => (
              <th key={index} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-white/5 transition-colors">
              {Object.values(item).map((value, i) => (
                <td key={i} className="px-4 py-3 text-slate-300">{value}</td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {buttons.map((ButtonComponent, btnIndex) => (
                    <span key={btnIndex}>
                      {cloneElement(ButtonComponent, { onClick: () => onButtonsClick[btnIndex](item.id) })}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
