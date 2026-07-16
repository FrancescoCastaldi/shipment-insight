export default function TicketRef() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: "#8DC63F" }}
        >
          <svg
            className="icon-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">GLS Support Ticket</h3>
          <p className="text-xs text-gray-500">ServiceNow</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 text-amber-800">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium">
            Opened on 16/07/2026
          </span>
        </div>
      </div>

      <a
        href="https://glsitaly.service-now.com/gls_create_report?id=revisione_segnalazione_gls&table=u_segnalazioni_customer_care&sys_id=9e94c0ba2bca0f505b35fa8af291bfab"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-green w-full justify-center"
      >
        <svg
          className="icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        Open GLS Ticket
      </a>

      <p className="text-xs text-gray-400 mt-3 text-center">
        GLS Report Review - ServiceNow Portal
      </p>
    </div>
  );
}
