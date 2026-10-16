// import { useEffect, useState } from "react";
// import { fetchEventSource } from "@microsoft/fetch-event-source";
// import { panelService } from "@iptv/services/panelService";
// import { decrypt } from "@/utils/secureStorage";
// import { usePanelCallAction } from "../../hooks/panel/use-panel-action";

// interface StoredUser {
//   token: string;
//   user: {
//     id: string;
//     email: string;
//     role: string;
//     name: string;
//     permissions: Array<{ id: string; name: string }>;
//   };
// }

// export default function NurseCallMonitor() {
//   const [calls, setCalls] = useState<any[]>([]);
//   const [status, setStatus] = useState<string>("menghubungkan...");
//   const { acknowledgeCall, resolveCall, loadingId } = usePanelCallAction();

//   useEffect(() => {
//     // 1. Ambil token terenkripsi dari localStorage dan dekripsi
//     const encryptedData = localStorage.getItem("user");
//     let token = "";

//     if (encryptedData) {
//       const decrypted = decrypt<StoredUser>(encryptedData);
//       if (decrypted && decrypted.token) {
//         token = decrypted.token;
//       }
//     }

//     // 2. Ambil data snapshot awal via HTTP API
//     panelService
//       .getActiveCalls()
//       .then((res: any) => {
//         if (res?.data?.calls) setCalls(res.data.calls);
//       })
//       .catch((err) => console.error("Gagal memuat snapshot:", err));

//     const controller = new AbortController();

//     // 3. Sambungkan SSE dengan fetch-event-source
//     fetchEventSource("/iptv-api/panel/events", {
//       // Sesuaikan dengan prefix proxy /iptv-api jika diperlukan
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       signal: controller.signal,

//       // Diubah menjadi async / mengembalikan Promise agar sesuai tipe pustaka
//       async onopen(response) {
//         if (response.ok) {
//           setStatus("terhubung");
//         } else if (response.status === 401) {
//           setStatus("Autentikasi gagal (401) - Token tidak valid");
//         } else {
//           setStatus(`Koneksi bermasalah (${response.status})`);
//         }
//       },

//       onmessage(msg) {
//         if (msg.event === "snapshot" || msg.event.startsWith("call.")) {
//           panelService.getActiveCalls().then((res: any) => {
//             if (res?.data?.calls) setCalls(res.data.calls);
//           });
//         }
//       },

//       onerror(err) {
//         setStatus("terputus - menyambung lagi...");
//         throw err; // Memicu auto-reconnect
//       },
//     });

//     return () => {
//       controller.abort();
//     };
//   }, []);

//   return (
//     <div className="p-6">
//       <header className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Nurse Call Watcher</h1>
//         <span className="text-sm text-gray-400">Status: {status}</span>
//       </header>

//       <ul className="space-y-3">
//         {calls.map((c) => (
//           <li
//             key={c.call_id}
//             className="p-4 bg-base-200 rounded-box flex justify-between items-center"
//           >
//             <div>
//               <span className="font-semibold text-lg">{c.kind}</span>
//               <p className="text-sm opacity-70">
//                 {c.room_label} - {c.ward_name}
//               </p>
//             </div>
//             <div className="flex gap-2">
//               {c.status === "PENDING" ? (
//                 <button
//                   className="btn btn-sm btn-warning"
//                   disabled={loadingId === c.call_id}
//                   onClick={() => acknowledgeCall(c.call_id)}
//                 >
//                   Jawab
//                 </button>
//               ) : (
//                 <button
//                   className="btn btn-sm btn-success"
//                   disabled={loadingId === c.call_id}
//                   onClick={() => resolveCall(c.call_id)}
//                 >
//                   Tutup
//                 </button>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
